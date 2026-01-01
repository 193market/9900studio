import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { INITIAL_SERVICE_ITEMS } from '../constants';
import { db, isFirebaseReady } from '../services/firebase';
import { ref, onValue, set } from 'firebase/database';

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

  // 하위 호환성
  result?: string; 
}

interface PortfolioContextType {
  serviceItems: ServiceItem[];
  adminPassword: string;
  isLiveMode: boolean; // Firebase 연동 여부
  
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

// LocalStorage Keys (Backup & Offline use)
const STORAGE_KEY_SERVICES = 'service_data_v7_items'; 
const STORAGE_KEY_PW = 'admin_password_v1';
const DEFAULT_PASSWORD = 'MRwol093462!';

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  // 1. 데이터 State (초기값은 LocalStorage 또는 Constant)
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SERVICE_ITEMS;
      }
    }
    return INITIAL_SERVICE_ITEMS;
  });

  // 2. 비밀번호 State
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PW) || DEFAULT_PASSWORD;
  });

  // --- Firebase 실시간 동기화 (Mount 시) ---
  useEffect(() => {
    if (isFirebaseReady && db) {
      setIsLiveMode(true);
      const servicesRef = ref(db, 'serviceItems');
      
      // DB 데이터 구독 (실시간 수신)
      const unsubscribe = onValue(servicesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // 배열이나 객체 형태로 올 수 있으므로 파싱
          const items = Array.isArray(data) ? data : Object.values(data);
          // 마이그레이션 로직 포함하여 상태 업데이트
          const cleanItems = items.map((item: any) => ({
             ...item,
             results: item.results || (item.result ? [item.result] : []),
             aiSite: item.aiSite || '',
             aiPrompt: item.aiPrompt || ''
          }));
          setServiceItems(cleanItems);
          // 로컬에도 백업 저장
          localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(cleanItems));
        } else {
          // DB가 비어있으면 초기값으로 세팅 (최초 1회)
          set(ref(db, 'serviceItems'), INITIAL_SERVICE_ITEMS);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  // --- 로컬 저장소 백업 (Firebase 없을 때 or 백업용) ---
  useEffect(() => {
    if (!isLiveMode) {
      try {
        localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(serviceItems));
      } catch (e) {
        console.error("Storage full");
      }
    }
  }, [serviceItems, isLiveMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PW, adminPassword);
  }, [adminPassword]);


  // --- 데이터 업데이트 로직 (Firebase 우선) ---
  
  const saveToCloud = (newItems: ServiceItem[]) => {
    if (isLiveMode && db) {
      set(ref(db, 'serviceItems'), newItems).catch(err => {
        console.error("Cloud save failed:", err);
        alert("클라우드 저장 실패! 네트워크를 확인하세요.");
      });
    }
  };

  const updateServiceItem = (id: number, field: keyof ServiceItem, value: any) => {
    const newItems = serviceItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    setServiceItems(newItems);
    saveToCloud(newItems);
  };

  const addServiceVideos = async (id: number, files: FileList): Promise<void> => {
    // 경고: 클라우드 모드일 때 파일 직접 업로드는 데이터베이스 용량을 초과할 수 있음
    if (isLiveMode && confirm("주의: 영상 파일을 직접 업로드하면 데이터베이스 용량이 빠르게 찹니다.\n가급적 유튜브/구글드라이브 링크를 사용하는 것을 권장합니다.\n\n계속 하시겠습니까?") === false) {
      return;
    }

    const newVideos: string[] = [];
    let skippedCount = 0;

    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB Limit
          skippedCount++;
          resolve(''); 
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
        const newItems = serviceItems.map(item => {
          if (item.id !== id) return item;
          return { ...item, results: [...item.results, ...newVideos] };
        });
        setServiceItems(newItems);
        saveToCloud(newItems);
      }
    } catch (error) {
      alert("파일 처리 중 오류가 발생했습니다.");
    }
  };

  const addServiceVideoUrl = (id: number, url: string) => {
    if (!url.trim()) return;
    const newItems = serviceItems.map(item => {
      if (item.id !== id) return item;
      return { ...item, results: [...item.results, url] };
    });
    setServiceItems(newItems);
    saveToCloud(newItems);
  };

  const removeServiceVideo = (id: number, videoIndex: number) => {
    const newItems = serviceItems.map(item => {
      if (item.id !== id) return item;
      const newResults = [...item.results];
      newResults.splice(videoIndex, 1);
      return { ...item, results: newResults };
    });
    setServiceItems(newItems);
    saveToCloud(newItems);
  };

  const updatePassword = (newPassword: string) => {
    setAdminPassword(newPassword);
  };

  const resetData = () => {
    if (window.confirm('모든 데이터를 초기 상태로 되돌리시겠습니까?')) {
      const resetItems = INITIAL_SERVICE_ITEMS;
      setServiceItems(resetItems);
      setAdminPassword(DEFAULT_PASSWORD);
      
      if (isLiveMode && db) {
        set(ref(db, 'serviceItems'), resetItems);
      } else {
        localStorage.removeItem(STORAGE_KEY_SERVICES);
      }
      localStorage.removeItem(STORAGE_KEY_PW);
      alert('초기화되었습니다.');
    }
  };

  return (
    <PortfolioContext.Provider value={{ 
      serviceItems,
      adminPassword,
      isLiveMode,
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