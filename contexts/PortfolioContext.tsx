import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { INITIAL_SERVICE_ITEMS } from '../constants';

// 서비스 아이템 타입 정의
export interface ServiceItem {
  id: number;
  categoryKey: string;
  title: string;
  desc: string;
  inputs: string[]; 
  results: string[]; // 다중 비디오 URL 지원
  badge: string;
  
  // 메타데이터
  aiSite?: string;
  aiPrompt?: string;

  // 하위 호환성 (단일 결과)
  result?: string; 
}

interface PortfolioContextType {
  serviceItems: ServiceItem[];
  adminPassword: string;
  
  // 액션 함수들
  updateServiceItem: (id: number, field: keyof ServiceItem, value: any) => void;
  addServiceVideos: (id: number, files: FileList) => Promise<void>;
  addServiceVideoUrl: (id: number, url: string) => void;
  removeServiceVideo: (id: number, videoIndex: number) => void;
  updatePassword: (newPassword: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// LocalStorage Keys
// v9 -> v10: Update key to force refresh data from constants.ts on user's browser
const STORAGE_KEY_SERVICES = 'service_data_v10_items'; 
const STORAGE_KEY_PW = 'admin_password_v1';
const DEFAULT_PASSWORD = 'MRwol093462!';

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  
  // 1. 서비스 데이터 State (초기화 시 LocalStorage 확인)
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 데이터 구조 마이그레이션 (results 배열이 없는 구버전 데이터 대비)
        return parsed.map((item: any) => ({
             ...item,
             results: item.results || (item.result ? [item.result] : []),
             aiSite: item.aiSite || '',
             aiPrompt: item.aiPrompt || ''
        }));
      }
    } catch (e) {
      console.error("Failed to load from storage", e);
    }
    return INITIAL_SERVICE_ITEMS;
  });

  // 2. 관리자 비밀번호 State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PW) || DEFAULT_PASSWORD;
  });

  // --- LocalStorage 동기화 (값이 변할 때마다 저장) ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(serviceItems));
    } catch (e) {
      console.error("Storage save failed", e);
    }
  }, [serviceItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PW, adminPassword);
  }, [adminPassword]);


  // --- CRUD 기능 구현 ---
  
  const updateServiceItem = (id: number, field: keyof ServiceItem, value: any) => {
    setServiceItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addServiceVideos = async (id: number, files: FileList): Promise<void> => {
    // 로컬 스토리지 용량 한계로 인해 파일을 Base64로 저장하는 것은 매우 제한적임.
    // 3MB 이하 파일만 허용하거나 경고 필요.
    const newVideos: string[] = [];
    
    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        if (file.size > 3 * 1024 * 1024) { 
           console.warn("File too large for local storage");
           resolve(''); // 3MB 초과 시 스킵
           return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    };

    const promises = Array.from(files).map(readFile);
    const results = await Promise.all(promises);
    
    results.forEach(res => {
      if (res) newVideos.push(res);
    });

    if (newVideos.length > 0) {
      setServiceItems(prev => prev.map(item => {
        if (item.id !== id) return item;
        return { ...item, results: [...item.results, ...newVideos] };
      }));
    } else {
      alert("파일이 너무 크거나 처리할 수 없습니다. URL 추가를 권장합니다.");
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
    if (confirm("정말 초기화하시겠습니까? 모든 변경사항이 사라집니다.")) {
        setServiceItems(INITIAL_SERVICE_ITEMS);
        setAdminPassword(DEFAULT_PASSWORD);
        localStorage.removeItem(STORAGE_KEY_SERVICES);
        localStorage.removeItem(STORAGE_KEY_PW);
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