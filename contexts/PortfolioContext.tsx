import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { INITIAL_SERVICE_ITEMS } from '../constants';

// 서비스 아이템 타입
export interface ServiceItem {
  id: number;
  categoryKey: string;
  title: string;
  desc: string;
  inputs: string[]; 
  results: string[]; // 다중 비디오 URL 배열
  badge: string;
  
  // 작업 가이드 (내부용)
  aiSite?: string;    // 사용한 AI 사이트/툴 이름
  aiPrompt?: string;  // 사용한 프롬프트

  // 하위 호환성 (삭제 예정)
  result?: string; 
}

interface PortfolioContextType {
  serviceItems: ServiceItem[];
  adminPassword: string;
  
  // 서비스 관리용 함수
  updateServiceItem: (id: number, field: keyof ServiceItem, value: any) => void;
  // 비디오 파일들 추가 (다중 업로드)
  addServiceVideos: (id: number, files: FileList) => Promise<void>;
  // 비디오 URL 직접 추가
  addServiceVideoUrl: (id: number, url: string) => void;
  // 비디오 삭제
  removeServiceVideo: (id: number, videoIndex: number) => void;

  updatePassword: (newPassword: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// 저장소 버전을 올려서 강제로 최신 상수를 불러오도록 함 (v7)
const STORAGE_KEY_SERVICES = 'service_data_v7_items'; 
const STORAGE_KEY_PW = 'admin_password_v1';
const DEFAULT_PASSWORD = 'MRwol093462!';

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 2. 서비스 데이터 (Main)
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 마이그레이션 로직
        return parsed.map((item: any) => {
          // 1. result -> results 변환
          let newResults = item.results;
          if (!newResults && item.result) {
            newResults = [item.result];
          } else if (!newResults) {
            newResults = [];
          }

          return { 
            ...item, 
            results: newResults,
            // 2. aiSite, aiPrompt 초기화 (없으면 빈 문자열)
            aiSite: item.aiSite || '',
            aiPrompt: item.aiPrompt || ''
          };
        });
      } catch (e) {
        return INITIAL_SERVICE_ITEMS;
      }
    }
    return INITIAL_SERVICE_ITEMS;
  });

  // 3. 비밀번호
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PW) || DEFAULT_PASSWORD;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(serviceItems));
    } catch (e) {
      alert("브라우저 저장소 용량이 가득 찼습니다. 일부 영상을 URL로 변경하거나 삭제해주세요.");
    }
  }, [serviceItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PW, adminPassword);
  }, [adminPassword]);

  // --- 서비스 수정 ---
  const updateServiceItem = (id: number, field: keyof ServiceItem, value: any) => {
    setServiceItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 다중 파일 업로드 처리
  const addServiceVideos = async (id: number, files: FileList): Promise<void> => {
    const newVideos: string[] = [];
    let skippedCount = 0;

    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) {
          skippedCount++;
          resolve(''); // Skip large files
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const promises = Array.from(files).map(readFile);
    
    try {
      const results = await Promise.all(promises);
      results.forEach(res => {
        if (res) newVideos.push(res);
      });

      if (skippedCount > 0) {
        alert(`${skippedCount}개의 파일이 5MB를 초과하여 제외되었습니다.`);
      }

      if (newVideos.length > 0) {
        setServiceItems(prev => prev.map(item => {
          if (item.id !== id) return item;
          return { ...item, results: [...item.results, ...newVideos] };
        }));
      }
    } catch (error) {
      console.error("File read error:", error);
      alert("파일을 읽는 중 오류가 발생했습니다.");
    }
  };

  const addServiceVideoUrl = (id: number, url: string) => {
    if (!url.trim()) return;
    setServiceItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      return { ...item, results: [...item.results, url] };
    }));
  };

  const removeServiceVideo = (id: number, videoIndex: number) => {
    setServiceItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newResults = [...item.results];
      newResults.splice(videoIndex, 1);
      return { ...item, results: newResults };
    }));
  };

  const updatePassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  const resetData = () => {
    if (window.confirm('모든 데이터를 초기 상태로 되돌리시겠습니까?')) {
      setServiceItems(INITIAL_SERVICE_ITEMS);
      setAdminPassword(DEFAULT_PASSWORD);
      localStorage.removeItem(STORAGE_KEY_SERVICES);
      localStorage.removeItem(STORAGE_KEY_PW);
      alert('초기화되었습니다.');
    }
  };

  return (
    <PortfolioContext.Provider value={{ 
      serviceItems,
      adminPassword, 
      updateServiceItem,
      addServiceVideos,
      addServiceVideoUrl,
      removeServiceVideo,
      updatePassword, 
      resetData 
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};