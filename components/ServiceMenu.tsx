import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio, ServiceItem } from '../contexts/PortfolioContext';
import { 
  ArrowRight, Sparkles, Zap, PlayCircle, AlertCircle
} from 'lucide-react';

interface ServiceMenuProps {
  onOrder: (serviceName: string) => void;
}

// 영상 링크 타입 판별 및 변환 헬퍼 (강화됨)
const getVideoEmbedInfo = (inputUrl: string) => {
  let url = inputUrl.trim();

  // 0. <iframe src="..."> 처리
  if (url.startsWith('<iframe') && url.includes('src="')) {
    const srcMatch = url.match(/src="([^"]+)"/);
    if (srcMatch && srcMatch[1]) {
      url = srcMatch[1];
    }
  }

  // 1. Google Drive
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    // 폴더 링크인지 체크
    if (url.includes('/folders/')) {
       return { type: 'error', message: 'Folder link not supported' };
    }

    // ID 추출 시도 (다양한 패턴)
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/, // /file/d/ID
      /\/d\/([a-zA-Z0-9_-]+)/,       // /d/ID
      /id=([a-zA-Z0-9_-]+)/          // ?id=ID
    ];

    let driveId = '';
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        driveId = match[1];
        break;
      }
    }

    if (driveId) {
      return { 
        type: 'drive', 
        url: `https://drive.google.com/file/d/${driveId}/preview` 
      };
    }
    
    // ID를 못 찾았지만 드라이브 링크인 경우 -> 렌더링 시도하되 에러 가능성 높음
    // 여기서는 사용자 경험을 위해 raw url로 시도하지 않고 에러 처리
    return { type: 'error', message: 'Invalid Drive Link' }; 
  }

  // 2. YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let ytId = '';
    const matchYt = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?]+)/);
    if (matchYt && matchYt[1]) {
      ytId = matchYt[1];
      return {
        type: 'youtube',
        // Autoplay, Mute, Loop, No Controls to mimic background video
        url: `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&modestbranding=1`
      };
    }
  }

  // 3. Direct File (Default)
  return { type: 'video', url: url };
};

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

// 개별 서비스 카드 컴포넌트 (비디오 자동 전환 로직 분리)
const ServiceCard: React.FC<{ item: ServiceItem; onOrder: (name: string) => void }> = ({ item, onOrder }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 비디오가 여러 개일 경우 5초마다 자동 회전 (영상 재생 시간 고려하여 조금 길게)
  useEffect(() => {
    if (item.results.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % item.results.length);
    }, 5000); // 5초마다 전환

    return () => clearInterval(interval);
  }, [item.results.length]);

  // 활성화된 비디오만 재생, 나머지는 일시정지 (iframe은 제어 불가하므로 skip)
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return; // iframe이거나 ref가 없으면 skip
      
      if (idx === currentVideoIndex) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay prevented handled silently
          });
        }
      } else {
        video.pause();
      }
    });
  }, [currentVideoIndex]);

  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col h-full">
      {/* Top Banner (Header) - Centered */}
      <div className="px-6 pt-6 pb-2 text-center flex flex-col items-center">
         
         {/* Badge Area - Fixed Height for Alignment */}
         <div className="h-7 mb-3 flex items-center justify-center w-full">
           {item.badge ? (
             <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm shrink-0 uppercase tracking-wide ${
                item.badge === 'BEST' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 
                item.badge === 'HOT' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 
                item.badge === 'NEW' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white' : 'bg-slate-100 text-slate-600'
             }`}>
               {item.badge === 'BEST' && <Sparkles className="w-3 h-3 fill-white" />}
               {item.badge === 'HOT' && <Zap className="w-3 h-3 fill-white" />}
               {item.badge}
             </span>
           ) : (
             // Placeholder to keep layout consistent if no badge
             <div className="w-1 h-1"></div>
           )}
         </div>

         {/* Title */}
         <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 h-14 flex items-center justify-center">
           {item.title}
         </h4>

         {/* Description */}
         <p className="text-sm text-slate-500 leading-relaxed min-h-[44px]">
            {item.desc}
         </p>
      </div>

      {/* Visual Area (Result Only) */}
      <div className="flex-1 p-3 flex flex-col">
         <div className="bg-slate-50/80 rounded-3xl p-3 border border-slate-100 h-full flex flex-col relative">
            
            {/* Result (Main) - Video Carousel */}
            <div className="flex-1 relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all border border-slate-100 aspect-[9/16] md:aspect-square lg:aspect-[3/4] bg-black">
                {item.results.map((videoSrc, idx) => {
                  const embedInfo = getVideoEmbedInfo(videoSrc);
                  
                  // Handle Error
                  if (embedInfo.type === 'error') {
                     return (
                      <div key={idx} className={`absolute inset-0 w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs transition-opacity duration-1000 ${
                          idx === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}>
                          <div className="text-center p-2">
                             <AlertCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                             <span>Video Unavailable</span>
                          </div>
                      </div>
                     );
                  }

                  // External Video (Drive, YouTube) -> iframe
                  if (embedInfo.type !== 'video') {
                    return (
                      <iframe
                        key={idx}
                        src={embedInfo.url}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                          idx === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        allow="autoplay; fullscreen; picture-in-picture"
                        loading="eager"
                        // iframe은 ref에 할당하지 않음 (play() 호출 불가)
                      />
                    );
                  }

                  // Direct Video File (.mp4 etc)
                  return (
                    <video
                      key={idx}
                      ref={el => videoRefs.current[idx] = el}
                      src={embedInfo.url}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        idx === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                      muted
                      loop
                      playsInline
                      // 첫 번째 영상은 초기 로드 시 자동 재생 시도
                      autoPlay={idx === 0} 
                    />
                  );
                })}
                
                {/* Status Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 z-20 pointer-events-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    AI Generated
                    {item.results.length > 1 && (
                      <span className="text-white/60 font-normal ml-1 border-l border-white/20 pl-1">
                        {currentVideoIndex + 1}/{item.results.length}
                      </span>
                    )}
                </div>
            </div>

         </div>
      </div>

      {/* Hover Action (Desktop) */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur border-t border-slate-100 hidden md:block z-30">
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