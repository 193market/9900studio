import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PORTFOLIO_ITEMS } from '../constants';

// 데이터 타입 정의
export interface PortfolioItem {
  id: number;
  category: string;
  title: string;
  desc: string;
  inputs: string[];
  result: string;
  tag: string;
}

interface PortfolioContextType {
  items: PortfolioItem[];
  adminPassword: string; // 관리자 비밀번호 상태
  updateItem: (id: number, field: keyof PortfolioItem, value: any) => void;
  updateImage: (id: number, type: 'input' | 'result', index: number | null, file: File) => void;
  updatePassword: (newPassword: string) => void; // 비밀번호 변경 함수
  resetData: () => void; // 데이터 초기화 함수
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const STORAGE_KEY_DATA = 'portfolio_data_v1';
const STORAGE_KEY_PW = 'admin_password_v1';
const DEFAULT_PASSWORD = 'admin'; // 초기 비밀번호

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. 초기 데이터 로드 (LocalStorage 확인 후 없으면 기본값 사용)
  const [items, setItems] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DATA);
    return saved ? JSON.parse(saved) : PORTFOLIO_ITEMS;
  });

  // 2. 비밀번호 로드
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PW) || DEFAULT_PASSWORD;
  });

  // 데이터 변경 시 LocalStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(items));
  }, [items]);

  // 비밀번호 변경 시 LocalStorage에 자동 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PW, adminPassword);
  }, [adminPassword]);

  // 텍스트 정보 업데이트
  const updateItem = (id: number, field: keyof PortfolioItem, value: any) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // 이미지 파일 업로드 (Base64 변환하여 저장 - 새로고침 유지용)
  const updateImage = (id: number, type: 'input' | 'result', index: number | null, file: File) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;

      setItems(prev => prev.map(item => {
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

    reader.readAsDataURL(file); // 파일을 Base64 문자열로 읽기
  };

  // 비밀번호 변경
  const updatePassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  // 데이터 초기화 (기본값으로 복구)
  const resetData = () => {
    if (window.confirm('모든 데이터를 초기 상태로 되돌리시겠습니까?')) {
      setItems(PORTFOLIO_ITEMS);
      setAdminPassword(DEFAULT_PASSWORD);
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_PW);
      alert('초기화되었습니다. 비밀번호도 "admin"으로 변경됩니다.');
    }
  };

  return (
    <PortfolioContext.Provider value={{ 
      items, 
      adminPassword, 
      updateItem, 
      updateImage, 
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