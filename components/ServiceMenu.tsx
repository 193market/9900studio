import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Play, Flame, Star, Zap } from 'lucide-react';

interface ServiceMenuProps {
  onOrder: (serviceName: string) => void;
}

export const ServiceMenu: React.FC<ServiceMenuProps> = ({ onOrder }) => {
  const { serviceItems } = usePortfolio();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Choose Your <span className="text-yellow-500">Video</span>
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            원하는 스타일을 선택하면 AI가 24시간 안에 제작해드립니다.
          </p>
        </div>

        {/* Masonry-like Grid for Shorts/Reels style */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-[1400px] mx-auto">
          {serviceItems.map((service) => (
            <ServiceCard key={service.id} service={service} onOrder={onOrder} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard: React.FC<{ service: any, onOrder: (name: string) => void }> = ({ service, onOrder }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrcs = service.results && service.results.length > 0 ? service.results : [];

  // Mobile Autoplay & Hover Play Logic
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  // Slide Logic if multiple videos
  useEffect(() => {
    if (videoSrcs.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videoSrcs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [videoSrcs.length]);

  // Badge Rendering
  const renderBadge = (badge: string) => {
    if (!badge) return null;
    if (badge === '🔥' || badge === 'HOT') {
        return (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                <Flame className="w-3 h-3 fill-white" /> HOT
            </div>
        );
    }
    if (badge === 'NEW') {
        return (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-blue-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                <Star className="w-3 h-3 fill-white" /> NEW
            </div>
        );
    }
    if (badge === 'SEASON' || badge === 'EVENT') {
        return (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-green-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                <Zap className="w-3 h-3 fill-white" /> EVENT
            </div>
        );
    }
    return (
        <div className="absolute top-3 left-3 z-20 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            {badge}
        </div>
    );
  };

  return (
    <div 
        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      {/* 9:16 Aspect Ratio Container */}
      <div className="relative aspect-[9/16] bg-black overflow-hidden">
        {renderBadge(service.badge)}
        
        {videoSrcs.map((src: string, index: number) => (
          <div
            key={`${src}-${index}`}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <video
              ref={index === currentIndex ? videoRef : null}
              src={src}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 z-10 pointer-events-none" />

        {/* Text Overlay (Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
            <h3 className="text-lg md:text-xl font-black leading-tight mb-1 shadow-black drop-shadow-md">
                {service.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-200 line-clamp-2 opacity-90 mb-3 font-medium">
                {service.desc}
            </p>
            <div className="flex items-center justify-between">
                <span className="font-bold text-yellow-400 text-lg">9,900원</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); onOrder(service.title); }}
                    className="bg-white text-slate-900 rounded-full p-2 hover:bg-yellow-400 transition-colors shadow-lg"
                    aria-label="Order this video"
                >
                    <Play className="w-4 h-4 fill-slate-900" />
                </button>
            </div>
        </div>
      </div>
      
      {/* Hover Effect Overlay (Optional Click Area) */}
      <div 
        className="absolute inset-0 z-30 cursor-pointer" 
        onClick={() => onOrder(service.title)}
      ></div>
    </div>
  );
};
