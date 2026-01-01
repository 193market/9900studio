import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio, ServiceItem } from '../contexts/PortfolioContext';
import { 
  ArrowRight, Sparkles, Zap, AlertCircle, ExternalLink, Flame, Gift, Tag, Play
} from 'lucide-react';

// Firebase Import Removed

interface ServiceMenuProps {
  onOrder: (serviceName: string) => void;
}

// Video Helper
const getVideoEmbedInfo = (inputUrl: string) => {
  const url = inputUrl ? inputUrl.trim() : '';
  if (!url) return { type: 'error', url: '', originalUrl: '' };

  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    // 쇼츠 및 일반 영상 공통 파라미터 (자동재생, 음소거, 반복, 컨트롤 숨김)
    const queryParams = `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
    return {
      type: 'youtube',
      id: videoId,
      url: `https://www.youtube.com/embed/${videoId}${queryParams}`,
      originalUrl: url
    };
  }

  if (url.includes('drive.google.com')) {
    let fileId = null;
    const patterns = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /id=([a-zA-Z0-9_-]+)/, /open\?id=([a-zA-Z0-9_-]+)/];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }
    if (fileId) {
      return {
        type: 'drive',
        id: fileId,
        url: `https://drive.google.com/file/d/${fileId}/preview`,
        originalUrl: url
      };
    }
  }

  return { type: 'video', id: url, url: url, originalUrl: url };
};

export const ServiceMenu: React.FC<ServiceMenuProps> = ({ onOrder }) => {
  const { serviceItems } = usePortfolio(); 

  return (
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceItems.map((item) => (
          <ServiceCard key={item.id} item={item} onOrder={onOrder} />
        ))}
      </div>
      <p className="text-center text-slate-400 text-xs mt-8">
         * 위 샘플 영상들은 관리자 페이지에서 실시간으로 업데이트됩니다.
      </p>
    </div>
  );
};

// Card Component
const ServiceCard: React.FC<{ item: ServiceItem; onOrder: (name: string) => void }> = ({ item, onOrder }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    if (item.results.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % item.results.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [item.results.length, isHovered]);

  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentVideoIndex) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentVideoIndex]);

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

  return (
    <div className={`group relative bg-white rounded-[2rem] border transition-all hover:shadow-xl flex flex-col overflow-hidden ${style.border}`}>
      <div className="p-6 text-center bg-slate-50 border-b border-slate-100">
         <div className="h-6 mb-2 flex justify-center">
           {item.badge && (
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-white ${style.bg}`}>
               {style.icon} {item.badge}
             </span>
           )}
         </div>
         <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
         <p className="text-sm text-slate-500 h-10 line-clamp-2">{item.desc}</p>
      </div>

      <div className="relative aspect-[9/16] bg-black">
         {item.results.map((videoSrc, idx) => {
           const info = getVideoEmbedInfo(videoSrc);
           const isActive = idx === currentVideoIndex;
           const commonClass = `absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`;

           if (info.type === 'error') return <div key={idx} className={commonClass + " bg-slate-100 flex items-center justify-center"}><AlertCircle className="text-slate-300" /></div>;
           
           if (info.type !== 'video') {
             return <iframe key={idx} src={info.url} className={commonClass} allow="autoplay; encrypted-media" loading="lazy" />;
           }
           
           return <video key={idx} ref={el => {videoRefs.current[idx]=el}} src={info.url} className={commonClass} muted loop playsInline autoPlay={idx===0} />;
         })}
         
         {/* Overlay Controls */}
         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col items-center justify-center p-4">
             <button 
                onClick={() => onOrder(item.title)}
                className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
             >
               <Play className="w-4 h-4 fill-slate-900" />제작하기
             </button>
         </div>
      </div>
    </div>
  );
};