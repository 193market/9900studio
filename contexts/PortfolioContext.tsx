import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { INITIAL_SERVICE_ITEMS } from '../constants';

// 서비스 아이템 타입
export interface ServiceItem {
  id: number;
  categoryKey: string;
  title: string;
  desc: string;
  inputs: string[]; 
  results: string[]; // 다중 이미지를 위해 배열로 변경
  badge: string;
  // 하위 호환성을 위해 구버전 데이터가 들어올 경우 처리 필요
  result?: string; 
}

interface PortfolioContextType {
  serviceItems: ServiceItem[];
  adminPassword: string;
  
  // 서비스 관리용 함수
  updateServiceItem: (id: number, field: keyof ServiceItem, value: any) => void;
  // 이미지 추가 (기존 이미지를 덮어쓰지 않고 배열에 추가)
  addServiceImage: (id: number, file: File) => void;
  // 이미지 삭제
  removeServiceImage: (id: number, imageIndex: number) => void;

  updatePassword: (newPassword: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY_SERVICES = 'service_data_v3'; // 키 변경하여 데이터 초기화 유도 (v3)
const STORAGE_KEY_PW = 'admin_password_v1';
const DEFAULT_PASSWORD = 'MRwol093462!';

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 2. 서비스 데이터 (Main)
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 마이그레이션 로직: 옛날 데이터(result 단일 문자열)가 있으면 results 배열로 변환
        return parsed.map((item: any) => {
          if (!item.results && item.result) {
            return { ...item, results: [item.result] };
          }
          if (!item.results) {
             return { ...item, results: [] };
          }
          return item;
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

  const addServiceImage = (id: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setServiceItems(prev => prev.map(item => {
        if (item.id !== id) return item;
        // 기존 배열에 새 이미지 추가
        return { ...item, results: [...item.results, base64String] };
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeServiceImage = (id: number, imageIndex: number) => {
    setServiceItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newResults = [...item.results];
      newResults.splice(imageIndex, 1);
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
      addServiceImage,
      removeServiceImage,
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