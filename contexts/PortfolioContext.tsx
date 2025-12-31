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
  // 비디오 파일 추가
  addServiceVideo: (id: number, file: File) => Promise<void>;
  // 비디오 URL 직접 추가
  addServiceVideoUrl: (id: number, url: string) => void;
  // 비디오 삭제
  removeServiceVideo: (id: number, videoIndex: number) => void;

  updatePassword: (newPassword: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY_SERVICES = 'service_data_v6_items'; // 키 변경하여 데이터 업데이트 (v6: 5개 항목 추가)
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
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(serviceItems));
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

  const addServiceVideo = (id: number, file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 5MB 제한 체크 (LocalStorage 한계)
      if (file.size > 5 * 1024 * 1024) {
        alert("브라우저 저장소 제한으로 인해 5MB 이하의 영상만 업로드 가능합니다.\n용량이 큰 영상은 URL로 등록해주세요.");
        reject(new Error("File too large"));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setServiceItems(prev => prev.map(item => {
          if (item.id !== id) return item;
          return { ...item, results: [...item.results, base64String] };
        }));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
      addServiceVideo,
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