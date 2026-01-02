import React, { useState, useEffect } from 'react';
import { Button } from './components/Button';
import { OrderWorkflow } from './components/OrderWorkflow';
import { AdminPage } from './components/AdminPage';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { ServiceMenu } from './components/ServiceMenu';
import { ChatWidget } from './components/ChatWidget';
import { useLanguage } from './contexts/LanguageContext';
import { 
  ArrowRight, 
  Menu, 
  X, 
  PlayCircle,
  Star,
  MessageCircle,
  Phone,
  Zap,
  Globe,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
  Megaphone
} from 'lucide-react';

// Firebase import 절대 금지

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'order' | 'admin' | 'terms' | 'privacy'>('landing');
  const [initialService, setInitialService] = useState('');
  const { t, language, setLanguage } = useLanguage();

  // URL 경로 체크 (Admin 진입)
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, '');
    if (path === '/9900' || path === '/admin') {
      setView('admin');
    }
  }, []);

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
    if (window.location.pathname.includes('/9900') || window.location.pathname.includes('/admin')) {
      window.history.pushState({}, '', '/');
    }
  };

  // --- 화면 라우팅 ---
  if (view === 'order') return <OrderWorkflow onBack={handleBackToLanding} initialService={initialService} />;
  if (view === 'admin') return <AdminPage onBack={handleBackToLanding} />;
  if (view === 'terms') return <TermsPage onBack={handleBackToLanding} />;
  if (view === 'privacy') return <PrivacyPage onBack={handleBackToLanding} />;

  // 네비게이션 링크
  const navLinks = [
    { label: t('nav.services'), id: 'services' },
    { label: t('nav.pricing'), id: 'pricing' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-24 md:pb-0 relative">
      
      {/* Header */}
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
              <Button 
                size="sm" 
                variant="primary" 
                onClick={() => window.open('https://smartstore.naver.com/cheda/products/12907044385', '_blank')} 
                className="flex items-center gap-2 shadow-yellow-400/30"
              >
                {t('nav.cta')} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
              className="p-2 text-slate-600"
            >
               <Globe className="w-5 h-5" />
            </button>
            {isLangMenuOpen && (
                <div className="absolute top-14 right-14 w-32 bg-white border border-slate-100 rounded-xl shadow-lg py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
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

            <button className="p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
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
            <Button fullWidth onClick={() => window.open('https://smartstore.naver.com/cheda/products/12907044385', '_blank')}>
              {t('nav.cta')}
            </Button>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-slate-900 overflow-hidden text-white">
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
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-loose break-keep animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              {t('hero.desc')}<span className="text-white font-bold border-b-2 border-yellow-400">{t('hero.desc_price')}</span>{t('hero.desc_suffix')}
            </p>

            <Button 
              size="lg" 
              onClick={() => window.open('https://smartstore.naver.com/cheda/products/12907044385', '_blank')} 
              className="group relative overflow-hidden animate-pulse shadow-[0_0_40px_rgba(250,204,21,0.3)] px-10 py-5 text-xl rounded-full animate-in fade-in zoom-in duration-700 delay-300 min-w-[320px]"
            >
              <span className="block transition-all duration-300 group-hover:-translate-y-[150%]">
                {t('hero.cta')}
              </span>
              <span className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 transition-all duration-300 translate-y-[150%] opacity-0 group-hover:translate-y-[-50%] group-hover:opacity-100 text-slate-900">
                 {t('hero.cta_hover')} <ExternalLink className="w-5 h-5" />
              </span>
            </Button>
            
            <p className="mt-4 text-xs text-slate-400 animate-in fade-in duration-1000 delay-500">
              {t('hero.disclaimer')}
            </p>
          </div>
        </section>

        {/* Services Menu */}
        <section id="services" className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="container mx-auto px-4 max-w-screen-xl relative z-10">
             
             {/* Announcement Banner */}
             <div className="max-w-4xl mx-auto mb-20">
                <div className="bg-slate-900 rounded-2xl p-1 shadow-2xl transform hover:-translate-y-1 transition-transform duration-300">
                    <div className="bg-slate-900 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-white/10">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg rotate-3">
                                <Megaphone className="w-7 h-7 text-slate-900" />
                            </div>
                            <div className="text-center md:text-left">
                                <div className="inline-block bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                                    NEWS
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-white mb-1">
                                    선착순 100명 <span className="text-yellow-400 underline decoration-yellow-400/30 decoration-4 underline-offset-4">프리미엄 기획</span> 무료
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    지금 주문 시 5만원 상당의 전문 기획안을 무료로 제공해드립니다.
                                </p>
                            </div>
                        </div>
                        
                        <button 
                          onClick={() => handleOrder()}
                          className="relative z-10 bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-50 transition-colors shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                          혜택받고 시작하기 <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
             </div>

             <div className="text-center mb-20">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                  Our Capabilities
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                 {t('services_menu.title')}
               </h2>
               <p className="text-slate-500 mb-4 text-sm md:text-base font-medium">
                 {t('services_menu.description')}
               </p>
               <div className="w-24 h-1.5 bg-yellow-400 mx-auto mb-6 rounded-full"></div>
             </div>
             
             <ServiceMenu onOrder={handleOrder} />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
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

             <Button size="lg" onClick={() => handleOrder()} className="px-12 py-4 text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
               {t('pricing.cta')}
             </Button>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-20 bg-white border-t border-slate-200">
           <div className="container mx-auto px-4 max-w-screen-md text-center">
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">{t('contact.title')}</h2>
             <p className="text-slate-600 mb-10 text-lg whitespace-pre-line">{t('contact.desc')}</p>
             <div className="grid md:grid-cols-2 gap-4 mb-8">
                <a href="tel:010-7320-5565" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-yellow-400 transition-all flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-yellow-100">
                        <Phone className="w-6 h-6 text-slate-400 group-hover:text-yellow-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-500 uppercase">{t('contact.phone_label')}</p>
                        <p className="text-lg font-bold text-slate-900">010-7320-5565</p>
                    </div>
                </a>
                <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-yellow-400 transition-all flex items-center gap-4 cursor-pointer" onClick={() => {
                   const chatButton = document.querySelector('button[aria-label="AI 상담원 연결"]');
                   if (chatButton instanceof HTMLElement) chatButton.click();
                }}>
                    <div className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-slate-900" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-500 uppercase">{t('contact.chat_label')}</p>
                        <p className="text-lg font-bold text-slate-900">{t('contact.chat_value')}</p>
                    </div>
                </div>
             </div>
           </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 text-sm">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <span className="font-black text-white text-lg block mb-2">9900Studio</span>
              <p>사업자등록번호: 109-02-01988 | 대표: 이성열</p>
              <p>{t('footer.address')}</p>
            </div>
            <div className="flex gap-6">
              <button onClick={() => { setView('terms'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">{t('footer.terms')}</button>
              <button onClick={() => { setView('privacy'); window.scrollTo(0,0); }} className="hover:text-white transition-colors">{t('footer.privacy')}</button>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-600 text-xs">{t('footer.copyright')}</p>
        </div>
      </footer>

      {/* Mobile CTA */}
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

      <ChatWidget />
    </div>
  );
};

export default App;