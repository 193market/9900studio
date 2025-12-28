import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';
import { 
  Building2, Shirt, UtensilsCrossed, ShoppingBag, 
  ArrowRight, Sparkles, Zap, ChevronLeft, 
  Settings2, Image as ImageIcon, Lightbulb, 
  Layout, Maximize2, Palette, Languages, Crown
} from 'lucide-react';

interface StudioPageProps {
  onBack: () => void;
  onProceedOrder: (serviceName: string, config: any) => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({ onBack, onProceedOrder }) => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<'real_estate' | 'fashion' | 'food' | 'ecommerce'>('real_estate');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  
  // Configuration State
  const [config, setConfig] = useState({
    model: 'standard',
    ratio: '1:1',
    resolution: '1K',
    style: 'photo'
  });

  // 카테고리 데이터
  const categories = [
    { id: 'real_estate', label: t('services_menu.categories.real_estate'), icon: Building2, group: t('studio.sidebar.group_space') },
    { id: 'fashion', label: t('services_menu.categories.fashion'), icon: Shirt, group: t('studio.sidebar.group_commerce') },
    { id: 'food', label: t('services_menu.categories.food'), icon: UtensilsCrossed, group: t('studio.sidebar.group_commerce') },
    { id: 'ecommerce', label: t('services_menu.categories.ecommerce'), icon: ShoppingBag, group: t('studio.sidebar.group_commerce') },
  ] as const;

  const items = t(`services_menu.items.${activeCategory}`) as Array<{title: string, desc: string, badge?: string, tip?: string}>;
  const selectedItem = items[selectedItemIndex] || items[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
               <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <h1 className="font-black text-lg text-slate-900 tracking-tight">
              9900<span className="text-yellow-500 font-normal">Studio</span> Editor
            </h1>
          </div>
        </div>
        <div className="hidden md:flex text-sm text-slate-500 gap-6">
             <span className="hover:text-slate-900 cursor-pointer">{t('nav.portfolio')}</span>
             <span className="hover:text-slate-900 cursor-pointer font-bold text-slate-900">{t('nav.services')}</span>
             <span className="hover:text-slate-900 cursor-pointer">{t('nav.pricing')}</span>
        </div>
      </div>

      <div className="flex-1 max-w-[1920px] mx-auto w-full flex flex-col md:flex-row overflow-hidden h-[calc(100vh-64px)]">
        
        {/* 1. Left Sidebar (Category Navigation) */}
        <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto z-10">
          <div className="p-4">
            <h3 className="text-xs font-bold text-yellow-600 mb-4 px-2 uppercase tracking-wider">{t('studio.sidebar.group_space')}</h3>
            {categories.filter(c => c.id === 'real_estate').map(cat => (
               <CategoryButton 
                 key={cat.id} 
                 category={cat} 
                 isActive={activeCategory === cat.id} 
                 onClick={() => { setActiveCategory(cat.id as any); setSelectedItemIndex(0); }} 
               />
            ))}

            <h3 className="text-xs font-bold text-yellow-600 mt-6 mb-4 px-2 uppercase tracking-wider">{t('studio.sidebar.group_commerce')}</h3>
            {categories.filter(c => c.id !== 'real_estate').map(cat => (
               <CategoryButton 
                 key={cat.id} 
                 category={cat} 
                 isActive={activeCategory === cat.id} 
                 onClick={() => { setActiveCategory(cat.id as any); setSelectedItemIndex(0); }} 
               />
            ))}
          </div>
          
          <div className="mt-auto p-4 border-t border-slate-100">
             <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <Settings2 className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-xs">
                    <p className="font-bold text-slate-700">Studio Settings</p>
                    <p className="text-slate-400">v.2.4.0</p>
                </div>
             </div>
          </div>
        </div>

        {/* 2. Middle Column (Service List) */}
        <div className="w-full md:w-80 lg:w-96 bg-slate-50/50 border-r border-slate-200 flex flex-col h-full overflow-y-auto">
          <div className="p-5 sticky top-0 bg-slate-50/95 backdrop-blur z-10 border-b border-slate-100">
             <h2 className="text-lg font-bold text-slate-900">{categories.find(c => c.id === activeCategory)?.label}</h2>
             <span className="text-xs text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full mt-1 inline-block">
                {items.length} services available
             </span>
          </div>
          <div className="p-4 space-y-3 pb-20 md:pb-4">
             {items.map((item, idx) => (
               <div 
                 key={idx}
                 onClick={() => setSelectedItemIndex(idx)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md relative overflow-hidden group ${
                   selectedItemIndex === idx 
                     ? 'bg-white border-yellow-400 shadow-md ring-1 ring-yellow-400' 
                     : 'bg-white border-slate-200 hover:border-blue-300'
                 }`}
               >
                 {selectedItemIndex === idx && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400" />}
                 
                 <div className="flex justify-between items-start mb-1">
                   <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${selectedItemIndex === idx ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>
                         <ImageIcon className="w-4 h-4" />
                      </div>
                      <h4 className={`font-bold text-sm ${selectedItemIndex === idx ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </h4>
                   </div>
                   {item.badge && (
                     <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                        item.badge === 'BEST' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                     }`}>
                        {item.badge === 'HOT' && <Zap className="w-2 h-2" />}
                        {item.badge}
                     </span>
                   )}
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed pl-8">
                   {item.desc}
                 </p>
               </div>
             ))}
          </div>
        </div>

        {/* 3. Right Column (Detail & Config) */}
        <div className="flex-1 bg-white h-full overflow-y-auto flex flex-col md:flex-row relative">
           
           {/* Center Preview Area (Visual) */}
           <div className="flex-1 p-6 md:p-10 flex flex-col bg-slate-100/50">
              {/* Selected Item Header */}
              <div className="mb-6">
                 <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white border border-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                       {categories.find(c => c.id === activeCategory)?.label}
                    </span>
                 </div>
                 <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">{selectedItem.title}</h2>
                 <p className="text-slate-600 text-sm md:text-base max-w-2xl">{selectedItem.desc}</p>
              </div>

              {/* Tip Box */}
              <div className="bg-white border border-yellow-200 rounded-xl p-5 mb-8 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                 <div className="flex gap-3">
                    <div className="mt-0.5">
                       <Lightbulb className="w-5 h-5 text-yellow-500 fill-yellow-100" />
                    </div>
                    <div>
                       <h4 className="font-bold text-sm text-slate-900 mb-1">{t('studio.preview.tip_title')}</h4>
                       <p className="text-sm text-slate-600 leading-relaxed">
                          {selectedItem.tip || selectedItem.desc}
                       </p>
                       <div className="mt-3 text-xs text-slate-400 flex flex-col gap-1">
                          <p>[추천 레퍼런스]</p>
                          <p>- 메뉴 설명 텍스트(.txt)</p>
                          <p>- 실제 음식 조리 사진 (플레이팅 참고용)</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Preview Placeholder */}
              <div className="flex-1 min-h-[300px] bg-slate-200 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group">
                 <div className="text-center p-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                       <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-bold text-slate-400 whitespace-pre-line">
                       {t('studio.preview.placeholder')}
                    </p>
                 </div>
              </div>
           </div>

           {/* Right Config Panel */}
           <div className="w-full md:w-80 border-l border-slate-200 bg-white p-5 flex flex-col h-auto md:h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Settings2 className="w-4 h-4" /> {t('studio.preview.config_title')}
                 </h3>
                 <div className="flex bg-slate-100 rounded-lg p-1">
                    <button className="px-3 py-1 bg-white shadow-sm rounded text-[10px] font-bold text-slate-900">{t('studio.preview.mode_create')}</button>
                    <button className="px-3 py-1 text-[10px] font-medium text-slate-500 hover:text-slate-900">{t('studio.preview.mode_edit')}</button>
                 </div>
              </div>

              <div className="space-y-6 flex-1">
                 {/* Model Selection */}
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-500 mb-2 block">{t('studio.preview.model_label')}</label>
                    <div className="flex flex-col gap-2">
                       <button 
                         onClick={() => setConfig({...config, model: 'standard'})}
                         className={`px-3 py-2 text-sm text-left rounded-lg border transition-all ${config.model === 'standard' ? 'bg-white border-slate-400 text-slate-900 shadow-sm font-bold' : 'border-transparent hover:bg-white text-slate-500'}`}
                       >
                         NanoBanana (Standard)
                       </button>
                       <button 
                         onClick={() => setConfig({...config, model: 'pro'})}
                         className={`px-3 py-2 text-sm text-left rounded-lg border transition-all flex items-center justify-between ${config.model === 'pro' ? 'bg-violet-600 border-violet-600 text-white shadow-md font-bold' : 'bg-white border-slate-200 text-slate-600'}`}
                       >
                         <span>NanoBanana Pro (HQ)</span>
                         <Crown className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                       </button>
                    </div>
                 </div>

                 {/* Ratio */}
                 <div>
                    <label className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1">
                       <Layout className="w-3 h-3" /> {t('studio.preview.ratio')}
                    </label>
                    <select 
                      value={config.ratio}
                      onChange={(e) => setConfig({...config, ratio: e.target.value})}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    >
                       <option value="1:1">{t('studio.options.ratio_1_1')}</option>
                       <option value="9:16">{t('studio.options.ratio_9_16')}</option>
                       <option value="16:9">{t('studio.options.ratio_16_9')}</option>
                    </select>
                 </div>

                 {/* Resolution */}
                 <div>
                    <label className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1">
                       <Maximize2 className="w-3 h-3" /> {t('studio.preview.resolution')}
                    </label>
                    <select 
                      value={config.resolution}
                      onChange={(e) => setConfig({...config, resolution: e.target.value})}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none"
                    >
                       <option value="1K">{t('studio.options.res_1k')}</option>
                       <option value="4K">{t('studio.options.res_4k')}</option>
                    </select>
                 </div>

                 {/* Style */}
                 <div>
                    <label className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1">
                       <Palette className="w-3 h-3" /> {t('studio.preview.style')}
                    </label>
                    <select 
                      value={config.style}
                      onChange={(e) => setConfig({...config, style: e.target.value})}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none bg-slate-900 text-white"
                    >
                       <option value="photo">{t('studio.options.style_photo')}</option>
                       <option value="art">{t('studio.options.style_art')}</option>
                       <option value="3d">{t('studio.options.style_3d')}</option>
                    </select>
                 </div>
                 
                 {/* Language Tags (Visual Only) */}
                 <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                       <Languages className="w-3 h-3" /> {t('studio.preview.lang_input')}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                       <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-bold">한국어</span>
                       <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">영어</span>
                       <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">일본어</span>
                       <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">중국어</span>
                    </div>
                 </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-slate-100">
                 <Button 
                   fullWidth 
                   size="lg" 
                   onClick={() => onProceedOrder(selectedItem.title, config)}
                   className="shadow-xl shadow-yellow-400/20"
                 >
                   {t('studio.preview.btn_generate')}
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Sidebar Buttons
const CategoryButton: React.FC<{category: any, isActive: boolean, onClick: () => void}> = ({ category, isActive, onClick }) => {
  const Icon = category.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 mb-1 group ${
        isActive 
          ? 'bg-yellow-50 text-yellow-900 font-bold border border-yellow-200' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
      }`}
    >
      <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
        isActive ? 'bg-yellow-400 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm">{category.label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-500" />}
    </button>
  );
};