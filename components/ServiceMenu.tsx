import React, { useState, useEffect, useMemo } from 'react';
import { usePortfolio, ServiceItem } from '../contexts/PortfolioContext';
import { 
  Play, Sparkles, Zap, Flame, Gift, Tag, CheckCircle2
} from 'lucide-react';

/* 
  [개발자 가이드 - 영상 URL 변경 방법]
  
  현재는 테스트를 위해 모든 서비스에 Vercel Blob URL이 적용되어 있습니다.
  실제 운영 시에는 Admin 페이지나 상수(constants.ts) 파일에서 
  'results' 배열에 실제 mp4 파일 주소(Vercel Blob, AWS S3 등)를 넣어주시면 됩니다.
  
  권장 영상 스펙:
  - 포맷: MP4 (H.264 코덱)
  - 용량: 3MB ~ 5MB 이내 권장 (모바일 로딩 속도 최적화)
  - 비율: 9:16 (세로형) 또는 1:1
  - 오디오: 자동 재생을 위해 Mute(음소거) 상태로 재생됩니다.
*/

// 테스트용 고화질 Vercel Blob URL (요청하신 URL)
const TEST_VIDEO_URL = "https://lxvnd8y0msuxrfui.public.blob.vercel-storage.com/Health%20Visualization/analyzed_video_video_26ee911a3ff94901b226cb43dc02fdb8_26ee911a3ff94901b226cb43dc02fdb8_origin.mp4";

interface ServiceMenuProps {
  onOrder: (serviceName: string) => void;
}

export const ServiceMenu: React.FC<ServiceMenuProps> = ({ onOrder }) => {
  const { serviceItems } = usePortfolio(); 
  const [filter, setFilter] = useState('ALL');

  // Priority Map for Sorting
  const getPriority = (badge: string) => {
    const b = badge?.toUpperCase() || '';
    if (b === 'BEST') return 100;
    if (b === 'HOT') return 90;
    if (b === 'NEW') return 80;
    if (b === 'SALE') return 70;
    if (b === 'EVENT') return 60;
    return 0; // No badge
  };

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    let items = [...serviceItems];
    
    // 1. Sort by Priority Descending
    items.sort((a, b) => getPriority(b.badge) - getPriority(a.badge));

    // 2. Filter by Category
    if (filter === 'ALL') return items;
    if (filter === 'EVENT') return items.filter(i => ['EVENT'].includes(i.badge?.toUpperCase()));
    if (filter === 'BEST') return items.filter(i => ['BEST', 'HOT'].includes(i.badge?.toUpperCase()));
    if (filter === 'NEW') return items.filter(i => ['NEW'].includes(i.badge?.toUpperCase()));
    if (filter === 'SALE') return items.filter(i => ['SALE'].includes(i.badge?.toUpperCase()));
    
    return items;
  }, [serviceItems, filter]);

  const tabs = [
    { id: 'ALL', label: '전체보기' },
    { id: 'EVENT', label: '🎉 이벤트', highlight: true },
    { id: 'BEST', label: '🔥 인기/추천' },
    { id: 'NEW', label: '✨ 신규' },
    { id: 'SALE', label: '💰 할인' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
              filter === tab.id 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 transform scale-105' 
                : tab.highlight 
                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
        {filteredItems.map((item) => (
          <div key={item.id} className="w-full max-w-sm">
             <ServiceCard item={item} onOrder={onOrder} />
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
         <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
            {filter === 'EVENT' ? '현재 진행 중인 이벤트가 없습니다.' : '해당하는 서비스가 없습니다.'}
         </div>
      )}

      <p className="text-center text-slate-400 text-xs mt-8">
         * 위 샘플 영상들은 9900Studio의 실제 제작 결과물입니다.
      </p>
    </div>
  );
};

// Card Component with Native Video Support
const ServiceCard: React.FC<{ item: ServiceItem; onOrder: (name: string) => void }> = ({ item, onOrder }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Data Transformation:
  // 기존 item.results에 무엇이 들어있든, 테스트를 위해 Vercel Blob URL로 강제 매핑합니다.
  // 실제 운영 시에는 item.results를 그대로 사용하면 됩니다.
  const videoSources = item.results.length > 0 
    ? item.results.map(() => TEST_VIDEO_URL) 
    : [TEST_VIDEO_URL];

  // Slideshow Logic (3 seconds)
  useEffect(() => {
    if (videoSources.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % videoSources.length);
    }, 3000); // 3초마다 전환

    return () => clearInterval(interval);
  }, [videoSources.length]);

  // Badge Styling Helper
  const getBadgeStyle = (badge: string) => {
    switch(badge?.toUpperCase()) {
      case 'BEST': return { bg: 'bg-amber-500', icon: <Sparkles className="w-3 h-3 text-white" />, border: 'border-amber-200' };
      case 'HOT': return { bg: 'bg-red-500', icon: <Flame className="w-3 h-3 text-white" />, border: 'border-red-200' };
      case 'NEW': return { bg: 'bg-blue-500', icon: <Zap className="w-3 h-3 text-white" />, border: 'border-blue-200' };
      case 'SALE': return { bg: 'bg-emerald-500', icon: <Tag className="w-3 h-3 text-white" />, border: 'border-emerald-200' };
      case 'EVENT': return { bg: 'bg-purple-500', icon: <Gift className="w-3 h-3 text-white" />, border: 'border-purple-200' };
      default: return { bg: 'bg-slate-500', icon: null, border: 'border-slate-200' };
    }
  };
  const style = getBadgeStyle(item.badge);

  const renderTitle = (title: string) => {
    const match = title.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
        return (
            <div className="flex flex-col items-center leading-tight mb-2">
                <span className="text-xl font-black text-slate-900">{match[1]}</span>
                <span className="text-sm font-medium text-slate-400">{match[2]}</span>
            </div>
        );
    }
    return <h4 className="text-xl font-black text-slate-900 mb-2">{title}</h4>;
  };

  return (
    <div 
      className={`group relative bg-white rounded-[2rem] border transition-all duration-300 hover:shadow-2xl flex flex-col overflow-hidden w-full ${style.border}`}
    >
      {/* Header Section */}
      <div className="p-6 text-center bg-slate-50 border-b border-slate-100 relative z-10">
         <div className="h-6 mb-2 flex justify-center">
           {item.badge && (
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-white shadow-sm ${style.bg}`}>
               {style.icon} {item.badge}
             </span>
           )}
         </div>
         {renderTitle(item.title)}
         <p className="text-sm text-slate-500 h-10 line-clamp-2 leading-relaxed">{item.desc}</p>
      </div>

      {/* Video Area (9:16 Aspect Ratio) */}
      <div className="relative aspect-[9/16] bg-black overflow-hidden">
         {videoSources.map((src, idx) => {
           const isActive = idx === currentVideoIndex;
           
           return (
             <div 
               key={idx}
               className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                 isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
               }`}
             >
                <video
                  src={src}
                  className="object-cover w-full h-full"
                  autoPlay
                  muted
                  loop
                  playsInline // iOS 필수
                  preload="auto"
                  poster="https://via.placeholder.com/400x700/000000/333333?text=Loading..." 
                />
                
                {/* Gradient Overlay for better text visibility if needed */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
             </div>
           );
         })}
         
         {/* Slide Indicators (dots) */}
         {videoSources.length > 1 && (
           <div className="absolute top-4 left-0 right-0 z-20 flex justify-center gap-1.5">
             {videoSources.map((_, idx) => (
               <div 
                 key={idx} 
                 className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                   idx === currentVideoIndex ? 'bg-white w-3' : 'bg-white/40'
                 }`} 
               />
             ))}
           </div>
         )}

         {/* Call To Action Overlay */}
         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex flex-col items-center justify-center p-4 backdrop-blur-[2px]">
             <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
               <p className="text-white font-bold text-lg mb-4 text-center drop-shadow-md">
                 이 컨셉으로 제작할까요?
               </p>
               <button 
                  onClick={() => onOrder(item.title)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-8 py-4 rounded-full flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
               >
                 <Play className="w-5 h-5 fill-slate-900" />
                 9,900원으로 만들기
               </button>
             </div>
         </div>
      </div>
    </div>
  );
};