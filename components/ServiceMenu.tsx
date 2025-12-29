import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { 
  Building2, Shirt, UtensilsCrossed, ShoppingBag, 
  ArrowRight, Sparkles, Zap, Images, Film, PlayCircle,
  MonitorPlay, Camera, Wand2
} from 'lucide-react';

interface ServiceMenuProps {
  onOrder: (serviceName: string) => void;
}

export const ServiceMenu: React.FC<ServiceMenuProps> = ({ onOrder }) => {
  const { t } = useLanguage();
  const { serviceItems } = usePortfolio(); 
  const [activeCategory, setActiveCategory] = useState<'fashion' | 'food' | 'ecommerce' | 'interior' | 'creator' | 'media'>('fashion');

  // 카테고리 정의 (6개)
  const categories = [
    { id: 'fashion', label: t('services_menu.categories.fashion'), icon: Shirt },
    { id: 'food', label: t('services_menu.categories.food'), icon: UtensilsCrossed },
    { id: 'ecommerce', label: t('services_menu.categories.ecommerce'), icon: ShoppingBag },
    { id: 'interior', label: t('services_menu.categories.interior'), icon: Building2 },
    { id: 'creator', label: t('services_menu.categories.creator'), icon: MonitorPlay },
    { id: 'media', label: t('services_menu.categories.media'), icon: Camera },
  ] as const;

  // 선택된 카테고리에 맞는 아이템 필터링
  const items = serviceItems.filter(item => item.categoryKey === activeCategory);

  return (
    <div className="flex flex-col gap-12">
      
      {/* 1. Category Tabs (Modern Sliding) */}
      <div className="flex justify-start md:justify-center overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 p-1.5 bg-slate-100/80 backdrop-blur rounded-2xl border border-slate-200">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 whitespace-nowrap text-sm font-bold ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-slate-400'}`} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Grid of Enhanced Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => {
          return (
            <div 
              key={item.id} 
              className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col"
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

              {/* Visual Transformation Area */}
              <div className="flex-1 p-3 flex flex-col">
                 <div className="bg-slate-50/80 rounded-3xl p-3 border border-slate-100 h-full flex flex-col relative">
                    
                    {/* Floating Label */}
                    <div className="absolute top-0 right-0 left-0 flex justify-center -mt-3 z-10">
                       <span className="bg-white border border-slate-200 text-[10px] font-bold text-slate-400 px-3 py-1 rounded-full shadow-sm uppercase tracking-widest flex items-center gap-1">
                          Process Preview
                       </span>
                    </div>

                    {/* Inputs Row */}
                    <div className="flex gap-2 mt-4 px-2">
                       {item.inputs.map((img, i) => (
                          <div key={i} className="flex-1 aspect-square rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm relative group/input">
                             <img 
                               src={img} 
                               alt="input" 
                               className="w-full h-full object-cover opacity-80 group-hover/input:opacity-100 transition-opacity"
                               onError={(e) => {
                                 (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f1f5f9/94a3b8?text=Img';
                               }}
                             />
                             <div className="absolute bottom-0 right-0 bg-slate-900/60 text-white text-[9px] px-1.5 py-0.5 rounded-tl-lg font-bold">
                               In
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Magic Arrow Transition */}
                    <div className="h-10 flex items-center justify-center relative">
                        <div className="w-px h-full bg-gradient-to-b from-slate-200 to-transparent absolute top-0"></div>
                        <div className="z-10 bg-white border border-slate-200 rounded-full p-1.5 text-yellow-500 shadow-sm animate-pulse">
                           <Wand2 className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Result (Main) */}
                    <div className="flex-1 relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all border border-slate-100">
                        <img 
                          src={item.result} 
                          alt="result" 
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/ffffff?text=AI+Result';
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
                    이 스타일로 제작하기 <ArrowRight className="w-4 h-4" />
                 </button>
              </div>

            </div>
          );
        })}
      </div>
      
      {/* Admin Notice */}
      <p className="text-center text-slate-400 text-xs mt-8">
         * 위 사례들은 관리자 페이지에서 실시간으로 업데이트됩니다.
      </p>
    </div>
  );
};