import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio, ServiceItem } from '../contexts/PortfolioContext';
import { 
  ArrowRight, Sparkles, Zap, PlayCircle, AlertCircle, ExternalLink, Flame, Gift, Tag
} from 'lucide-react';

interface ServiceMenuProps {
  onOrder: (serviceName: string) => void;
}

// 영상 링크 타입 판별 및 변환 헬퍼 (YouTube Shorts 지원)
const getVideoEmbedInfo = (inputUrl: string) => {
  const url = inputUrl ? inputUrl.trim() : '';
  if (!url) return { type: 'error', url: '', originalUrl: '', message: '' };

  // 1. YouTube 링크 (Shorts 포함)
  // 정규식에 'shorts'를 추가하여 /shorts/ 경로도 인식하도록 수정됨
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

  // 2. Google Drive 링크 처리 (기존 로직 유지)
  if (url.includes('drive.google.com')) {
    let fileId = null;
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /open\?id=([a-zA-Z0-9_-]+)/
    ];

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

  // 3. 일반 비디오 파일
  return {
    type: 'video',
    id: url,
    url: url,
    originalUrl: url
  };
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

// 개별 서비스 카드 컴포넌트
const ServiceCard: React.FC<{ item: ServiceItem; onOrder: (name: string) => void }> = ({ item, onOrder }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // 호버 상태 관리
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 비디오가 여러 개일 경우 5초마다 자동 회전 (마우스 오버 시 정지)
  useEffect(() => {
    if (item.results.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % item.results.length);
    }, 5000); // 5초마다 전환

    return () => clearInterval(interval);
  }, [item.results.length, isHovered]);

  // 활성화된 비디오만 재생, 나머지는 일시정지 (iframe은 제어 불가하므로 skip)
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return; 
      
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

  // 뱃지에 따른 스타일 결정
  const getBadgeStyle = (badge: string) => {
    switch(badge?.toUpperCase()) {
      case 'BEST': return {
        bg: 'bg-gradient-to-r from-amber-400 to-orange-500',
        icon: <Sparkles className="w-3.5 h-3.5 fill-white/90 text-white" />,
        glow: 'shadow-orange-400/50',
        border: 'border-amber-200 group-hover:border-amber-400',
        cardBg: 'from-amber-50/50 to-white'
      };
      case 'HOT': return {
        bg: 'bg-gradient-to-r from-red-500 to-rose-500',
        icon: <Flame className="w-3.5 h-3.5 fill-white/90 text-white" />,
        glow: 'shadow-red-400/50',
        border: 'border-red-200 group-hover:border-red-400',
        cardBg: 'from-red-50/50 to-white'
      };
      case 'NEW': return {
        bg: 'bg-gradient-to-r from-blue-400 to-indigo-500',
        icon: <Zap className="w-3.5 h-3.5 fill-white/90 text-white" />,
        glow: 'shadow-blue-400/50',
        border: 'border-blue-200 group-hover:border-blue-400',
        cardBg: 'from-blue-50/50 to-white'
      };
      case 'SALE': return {
        bg: 'bg-gradient-to-r from-emerald-400 to-teal-500',
        icon: <Tag className="w-3.5 h-3.5 fill-white/90 text-white" />,
        glow: 'shadow-emerald-400/50',
        border: 'border-emerald-200 group-hover:border-emerald-400',
        cardBg: 'from-emerald-50/50 to-white'
      };
      case 'EVENT': return {
        bg: 'bg-gradient-to-r from-purple-400 to-pink-500',
        icon: <Gift className="w-3.5 h-3.5 fill-white/90 text-white" />,
        glow: 'shadow-purple-400/50',
        border: 'border-purple-200 group-hover:border-purple-400',
        cardBg: 'from-purple-50/50 to-white'
      };
      default: return {
        bg: 'bg-slate-100',
        icon: null,
        glow: 'shadow-transparent',
        border: 'border-slate-100 group-hover:border-slate-300',
        cardBg: 'from-slate-50/50 to-white'
      };
    }
  };

  const style = getBadgeStyle(item.badge);

  return (
    <div 
      className={`group relative bg-white rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full overflow-hidden ${style.border}`}
    >
      {/* Top Banner (Header) */}
      <div className={`px-6 pt-6 pb-2 text-center flex flex-col items-center bg-gradient-to-b ${style.cardBg}`}>
         
         {/* Badge Area */}
         <div className="h-8 mb-3 flex items-center justify-center w-full">
           {item.badge ? (
             <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shrink-0 uppercase tracking-wide text-white transform group-hover:scale-105 transition-transform ${style.bg} ${style.glow}`}>
               {style.icon}
               {item.badge}
             </span>
           ) : (
             <div className="w-1 h-1"></div>
           )}
         </div>

         {/* Title */}
         <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 h-14 flex items-center justify-center break-keep">
           {item.title}
         </h4>

         {/* Description */}
         <p className="text-sm text-slate-500 leading-relaxed min-h-[44px]">
            {item.desc}
         </p>
      </div>

      {/* Visual Area (Result Only) */}
      <div className="flex-1 p-3 flex flex-col bg-white">
         <div className="bg-slate-50 rounded-3xl p-2 border border-slate-100 h-full flex flex-col relative group-hover:border-slate-200 transition-colors">
            
            {/* Result (Main) - Video Carousel */}
            <div 
              className="flex-1 relative rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all border border-slate-200 aspect-[9/16] md:aspect-square lg:aspect-[3/4] bg-black"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
                {item.results.map((videoSrc, idx) => {
                  const embedInfo = getVideoEmbedInfo(videoSrc);
                  const isActive = idx === currentVideoIndex;

                  // Handle Error
                  if (embedInfo.type === 'error') {
                     return (
                      <div key={idx} className={`absolute inset-0 w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs transition-opacity duration-1000 ${
                          isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}>
                          <div className="text-center p-2">
                             <AlertCircle className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                             <span>Video Unavailable</span>
                          </div>
                      </div>
                     );
                  }

                  // External Video (Drive, YouTube, TeraBox, General Web) -> iframe
                  if (embedInfo.type !== 'video') {
                    return (
                      <React.Fragment key={idx}>
                        <iframe
                          src={embedInfo.url}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                            isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                          }`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          loading="lazy"
                        />
                        {/* 원본 바로가기 버튼 (오류 시 확인용) */}
                        {isActive && (
                           <a 
                             href={embedInfo.originalUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full z-20 transition-colors pointer-events-auto"
                             title="새 창에서 원본 열기"
                             onClick={(e) => e.stopPropagation()}
                           >
                              <ExternalLink className="w-3 h-3" />
                           </a>
                        )}
                      </React.Fragment>
                    );
                  }

                  // Direct Video File (.mp4 etc)
                  return (
                    <video
                      key={idx}
                      ref={(el) => { videoRefs.current[idx] = el; }}
                      src={embedInfo.url}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
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