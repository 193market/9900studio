import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio, ServiceItem } from '../contexts/PortfolioContext';
import { 
  ArrowRight, Sparkles, Zap, PlayCircle,
} from 'lucide-react';

interface ServiceMenuProps {
  onOrder: (serviceName: string) => void;
}

export const ServiceMenu: React.FC<ServiceMenuProps> = ({ onOrder }) => {
  const { serviceItems } = usePortfolio(); 

  return (
    <div className="flex flex-col gap-12">
      {/* Grid of Video Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceItems.map((item) => (
          <ServiceCard key={item.id} item={item} onOrder={onOrder} />
        ))}
      </div>
      
      {/* Admin Notice */}
      <p className="text-center text-slate-400 text-xs mt-8">
         * 위 샘플 영상들은 관리자 페이지에서 실시간으로 업데이트됩니다.
      </p>
    </div>
  );
};

// 개별 서비스 카드 컴포넌트 (이미지 자동 슬라이드 로직 분리)
const ServiceCard: React.FC<{ item: ServiceItem; onOrder: (name: string) => void }> = ({ item, onOrder }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 이미지가 여러 장일 경우 3초마다 자동 회전
  useEffect(() => {
    if (item.results.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % item.results.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [item.results.length]);

  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col h-full">
      {/* Top Banner (Header) */}
      <div className="px-6 pt-6 pb-2">
         <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-black text-slate-900 leading-tight">
              {item.title}
            </h4>
            {item.badge && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm shrink-0 uppercase tracking-wide ${
                 item.badge === 'BEST' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 
                 item.badge === 'HOT' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 
                 item.badge === 'NEW' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {item.badge === 'BEST' && <Sparkles className="w-3 h-3 fill-white" />}
                {item.badge === 'HOT' && <Zap className="w-3 h-3 fill-white" />}
                {item.badge}
              </span>
            )}
         </div>
         <p className="text-sm text-slate-500 leading-relaxed min-h-[44px]">
            {item.desc}
         </p>
      </div>

      {/* Visual Area (Result Only) */}
      <div className="flex-1 p-3 flex flex-col">
         <div className="bg-slate-50/80 rounded-3xl p-3 border border-slate-100 h-full flex flex-col relative">
            
            {/* Result (Main) - Carousel */}
            <div className="flex-1 relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all border border-slate-100 aspect-[9/16] md:aspect-square lg:aspect-[3/4]">
                {item.results.map((imgSrc, idx) => (
                  <img 
                    key={idx}
                    src={imgSrc} 
                    alt="result" 
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/ffffff?text=AI+Video';
                    }}
                  />
                ))}
                
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-6 h-6 text-white fill-white/30" />
                    </div>
                </div>
                {/* Status Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    AI Generated
                    {item.results.length > 1 && (
                      <span className="text-white/60 font-normal ml-1 border-l border-white/20 pl-1">
                        {currentImageIndex + 1}/{item.results.length}
                      </span>
                    )}
                </div>
            </div>

         </div>
      </div>

      {/* Hover Action (Desktop) */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur border-t border-slate-100 hidden md:block z-20">
         <button 
            onClick={() => onOrder(item.title)}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
         >
            이 영상으로 만들기 <ArrowRight className="w-4 h-4" />
         </button>
      </div>

    </div>
  );
};