import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { 
  ArrowRight, Sparkles, Zap, PlayCircle,
} from 'lucide-react';

interface ServiceMenuProps {
  onOrder: (serviceName: string) => void;
}

export const ServiceMenu: React.FC<ServiceMenuProps> = ({ onOrder }) => {
  const { t } = useLanguage();
  const { serviceItems } = usePortfolio(); 

  return (
    <div className="flex flex-col gap-12">
      
      {/* Grid of Video Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {serviceItems.map((item) => {
          return (
            <div 
              key={item.id} 
              className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col h-full"
            >
              {/* Top Banner (Header) */}
              <div className="px-6 pt-6 pb-2">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-black text-slate-900 leading-tight">
                      {item.title}
                    </h4>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm shrink-0 uppercase tracking-wide ${
                         item.badge === 'BEST' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 
                         item.badge === 'HOT' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' : 'bg-slate-100 text-slate-600'
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
                    
                    {/* Result (Main) */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all border border-slate-100 aspect-[9/16] md:aspect-square lg:aspect-[3/4]">
                        <img 
                          src={item.result} 
                          alt="result" 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/ffffff?text=AI+Video';
                          }}
                        />
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform">
                                <PlayCircle className="w-6 h-6 text-white fill-white/30" />
                            </div>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                            AI Generated
                        </div>
                    </div>

                 </div>
              </div>

              {/* Hover Action (Desktop) */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur border-t border-slate-100 hidden md:block">
                 <button 
                    onClick={() => onOrder(item.title)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                 >
                    이 영상으로 만들기 <ArrowRight className="w-4 h-4" />
                 </button>
              </div>

            </div>
          );
        })}
      </div>
      
      {/* Admin Notice */}
      <p className="text-center text-slate-400 text-xs mt-8">
         * 위 샘플 영상들은 관리자 페이지에서 실시간으로 업데이트됩니다.
      </p>
    </div>
  );
};