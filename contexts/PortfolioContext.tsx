import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { INITIAL_SERVICE_ITEMS } from '../constants';

// 서비스 아이템 타입
export interface ServiceItem {
  id: number;
  categoryKey: string;
  title: string;
  desc: string;
  inputs: string[];
  result: string;
  badge: string;
}

interface PortfolioContextType {
  serviceItems: ServiceItem[];
  adminPassword: string;
  
  // 서비스 관리용 함수
  updateServiceItem: (id: number, field: keyof ServiceItem, value: any) => void;
  updateServiceImage: (id: number, type: 'input' | 'result', index: number | null, file: File) => void;

  updatePassword: (newPassword: string) => void;
  resetData: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY_SERVICES = 'service_data_v1';
const STORAGE_KEY_PW = 'admin_password_v1';
const DEFAULT_PASSWORD = 'admin';

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 2. 서비스 데이터 (Main)
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_ITEMS;
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

  const updateServiceImage = (id: number, type: 'input' | 'result', index: number | null, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setServiceItems(prev => prev.map(item => {
        if (item.id !== id) return item;
        if (type === 'result') {
          return { ...item, result: base64String };
        } else if (type === 'input' && index !== null) {
          const newInputs = [...item.inputs];
          newInputs[index] = base64String;
          return { ...item, inputs: newInputs };
        }
        return item;
      }));
    };
    reader.readAsDataURL(file);
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
      alert('초기화되었습니다. 비밀번호도 "admin"으로 변경됩니다.');
    }
  };

  return (
    <PortfolioContext.Provider value={{ 
      serviceItems,
      adminPassword, 
      updateServiceItem,
      updateServiceImage,
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