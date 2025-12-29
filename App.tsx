import React, { useState } from 'react';
import { Button } from './components/Button';
import { OrderWorkflow } from './components/OrderWorkflow';
import { AdminPage } from './components/AdminPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { ServiceMenu } from './components/ServiceMenu';
import { useLanguage } from './contexts/LanguageContext';
import { 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X, 
  PlayCircle,
  Star,
  MessageCircle,
  Phone,
  Zap,
  Lock,
  Globe,
  ChevronDown
} from 'lucide-react';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'order' | 'admin' | 'terms' | 'privacy'>('landing');
  const [initialService, setInitialService] = useState('');
  const { t, language, setLanguage } = useLanguage();

  const languages = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'vi', label: 'Tiếng Việt' },
  ] as const;

  const handleLanguageSelect = (langCode: typeof languages[number]['code']) => {
    setLanguage(langCode);
    setIsLangMenuOpen(false);
  };

  const getLanguageLabel = () => {
    const found = languages.find(l => l.code === language);
    return found ? found.label : 'Language';
  };

  const scrollToSection = (id: string) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setIsMenuOpen(false);
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    }
  };

  const handleOrder = (serviceName?: string | unknown) => {
    if (typeof serviceName === 'string') {
      setInitialService(serviceName);
    } else {
      setInitialService('');
    }
    setView('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminEnter = () => {
    setView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1:1 상담 링크 (카카오톡)
  const handleChatInquiry = () => {
    window.open('http://pf.kakao.com/_YfxiUn/chat', '_blank');
  };

  // --- View Routing ---
  if (view === 'order') {
    return <OrderWorkflow onBack={handleBackToLanding} initialService={initialService} />;
  }

  if (view === 'admin') {
    return <AdminPage onBack={handleBackToLanding} />;
  }

  if (view === 'terms') {
    return <TermsPage onBack={handleBackToLanding} />;
  }

  if (view === 'privacy') {
    return <PrivacyPage onBack={handleBackToLanding} />;
  }

  // Define Nav Links (Portfolio removed)
  const navLinks = [
    { label: t('nav.services'), id: 'services' },
    { label: t('nav.pricing'), id: 'pricing' },
  ];

  // --- Landing Page View ---
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-24 md:pb-0">
      
      {/* --- Header --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16 transition-all">
        <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-screen-xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              9900<span className="text-yellow-500">Studio</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </button>
            ))}
            
            {/* Language Dropdown (Desktop) */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                className="flex items-center gap-1 p-2 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-600"
              >
                <Globe className="w-4 h-4" />
                <span>{getLanguageLabel()}</span>
                <ChevronDown className={`w-3 h-3 ml-0.5 opacity-50 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-lg py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                  {languages.map((langOption) => (
                    <button
                      key={langOption.code}
                      onClick={() => handleLanguageSelect(langOption.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${language === langOption.code ? 'text-yellow-600 font-bold bg-yellow-50' : 'text-slate-600'}`}
                    >
                      {langOption.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pl-4 border-l border-slate-200">
              <Button size="sm" variant="primary" onClick={() => handleOrder()} className="flex items-center gap-2 shadow-yellow-400/30">
                {t('nav.cta')} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle & Language */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
                className="flex items-center gap-1 p-2 hover:bg-slate-100 rounded-lg transition-colors text-sm font-medium text-slate-600"
              >
                 <Globe className="w-5 h-5" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-lg py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                  {languages.map((langOption) => (
                    <button
                      key={langOption.code}
                      onClick={() => handleLanguageSelect(langOption.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${language === langOption.code ? 'text-yellow-600 font-bold bg-yellow-50' : 'text-slate-600'}`}
                    >
                      {langOption.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-4 md:hidden flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)}
                className="text-left py-2 font-medium text-slate-700 border-b border-slate-50 last:border-0"
              >
                {link.label}
              </button>
            ))}
            
            <Button fullWidth onClick={() => handleOrder()}>
              {t('nav.cta')}
            </Button>
          </div>
        )}
      </header>

      <main className="pt-16">
        
        {/* --- Section 1: Hero --- */}
        <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden text-white">
           {/* Background Effect */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] opacity-70"></div>
             <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] opacity-60"></div>
           </div>

          <div className="container mx-auto px-4 max-w-screen-xl relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
               <span className="text-xs md:text-sm font-bold text-yellow-400">{t('hero.badge')}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 break-keep animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              {t('hero.title_prefix')}<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">{t('hero.title_highlight')}</span> {t('hero.title_suffix')}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed break-keep animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              {t('hero.desc')}<span className="text-white font-bold border-b-2 border-yellow-400">{t('hero.desc_price')}</span>{t('hero.desc_suffix')}
            </p>

            <Button size="lg" onClick={() => handleOrder()} className="animate-pulse shadow-[0_0_40px_rgba(250,204,21,0.3)] px-10 py-5 text-xl rounded-full animate-in fade-in zoom-in duration-700 delay-300">
              {t('hero.cta')}
            </Button>
            
            <p className="mt-4 text-xs text-slate-400 animate-in fade-in duration-1000 delay-500">
              {t('hero.disclaimer')}
            </p>
          </div>
        </section>

        {/* --- Section 3: Service Menu (Main Showcase) --- */}
        <section id="services" className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
          {/* Subtle Grid Background for Trust/Tech feel */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
               style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>
          
          {/* Professional Gradient Accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

          <div className="container mx-auto px-4 max-w-screen-xl relative z-10">
             <div className="text-center mb-20">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                  Our Capabilities
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                 {t('services_menu.title')}
               </h2>
               <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
               <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto whitespace-pre-line leading-relaxed">
                 {t('services_menu.subtitle')}
               </p>
             </div>
             
             <ServiceMenu onOrder={handleOrder} />
             
             <div className="mt-16 text-center">
                <p className="text-slate-500 mb-6 text-sm">원하는 서비스가 없으신가요? 1:1 맞춤 제작도 가능합니다.</p>
                <Button size="lg" onClick={handleChatInquiry} className="shadow-xl shadow-yellow-400/20 px-10 py-4 text-lg">
                   1:1 상담 및 맞춤 제작 문의
                </Button>
             </div>

          </div>
        </section>

        {/* --- Section 4: Pricing --- */}
        <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="container mx-auto px-4 max-w-screen-xl text-center relative z-10">
             <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
               {t('pricing.title_prefix')}<br/>
               <span className="text-yellow-400">{t('pricing.title_highlight')}</span>
             </h2>

             <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-10">
                <div className="flex flex-col gap-4">
                  {(t('pricing.features') as string[]).map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-left">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="font-medium text-lg text-slate-200">{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="my-8 h-px bg-white/10"></div>
                <div className="text-center">
                  <span className="text-slate-400 text-sm line-through">{t('pricing.original_price')}</span>
                  <div className="text-5xl font-black text-white mt-1 mb-2">{t('pricing.current_price')}</div>
                  <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded">{t('pricing.vat')}</span>
                </div>
             </div>

             <div className="flex flex-col items-center gap-2">
                <Button size="lg" onClick={() => handleOrder()} className="px-12 py-4 text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  {t('pricing.cta')}
                </Button>
                <p className="text-slate-400 text-sm mt-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 
                  {t('pricing.guarantee')}
                </p>
             </div>
          </div>
        </section>

        {/* --- Section 6: Contact (Order Form) --- */}
        <section id="contact" className="py-20 bg-white border-t border-slate-200">
           <div className="container mx-auto px-4 max-w-screen-md text-center">
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
               {t('contact.title')}
             </h2>
             <p className="text-slate-600 mb-10 text-lg whitespace-pre-line">
               {t('contact.desc')}
             </p>

             <div className="grid md:grid-cols-2 gap-4 mb-8">
                <a href="tel:010-7320-5565" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-yellow-400 hover:shadow-md transition-all flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                        <Phone className="w-6 h-6 text-slate-400 group-hover:text-yellow-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-500 uppercase">{t('contact.phone_label')}</p>
                        <p className="text-lg font-bold text-slate-900">010-7320-5565</p>
                    </div>
                </a>
                <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-yellow-400 hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer" onClick={handleChatInquiry}>
                    <div className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-slate-900" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-500 uppercase">{t('contact.chat_label')}</p>
                        <p className="text-lg font-bold text-slate-900">{t('contact.chat_value')}</p>
                    </div>
                </div>
             </div>
             
             {/* Email Inquiry Section Removed */}
           </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <span className="font-black text-white text-lg">9900Studio</span>
              </div>
              <p>사업자등록번호: 109-02-01988 | 대표: 이성열</p>
              <p>{t('footer.address')}</p>
              <p className="mt-2 text-xs text-slate-500">
                {t('footer.copyright')}
              </p>
            </div>
            <div className="flex flex-col gap-4 items-end">
              <div className="flex gap-6">
                <button onClick={() => { setView('terms'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">{t('footer.terms')}</button>
                <button onClick={() => { setView('privacy'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">{t('footer.privacy')}</button>
              </div>
              {/* 관리자 페이지 진입 버튼 (Footer에 위치) */}
              <button 
                onClick={handleAdminEnter}
                className="text-xs text-slate-700 hover:text-slate-500 flex items-center gap-1 transition-colors"
              >
                <Lock className="w-3 h-3" /> {t('footer.admin')}
              </button>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-600 text-xs">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>

      {/* --- Mobile Fixed CTA --- */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-40">
        <Button 
          fullWidth 
          size="lg" 
          className="shadow-2xl shadow-slate-900/40 flex items-center justify-between px-6 bg-yellow-400 text-slate-900 border-none"
          onClick={() => handleOrder()}
        >
          <span className="font-bold text-sm">{t('mobile_cta.prefix')}</span>
          <span className="flex items-center gap-1 font-black text-lg">
            {t('mobile_cta.price')} <ArrowRight className="w-5 h-5 ml-1" />
          </span>
        </Button>
      </div>

    </div>
  );
};

export default App;