import React, { useState } from 'react';
import { SectionId } from './types';
import { Button } from './components/Button';
// ScriptGenerator import 제거
import { OrderWorkflow } from './components/OrderWorkflow';
import { AdminPage } from './components/AdminPage';
import { NAV_LINKS, TARGETS } from './constants'; // PORTFOLIO_ITEMS 제거 (Context 사용)
import { usePortfolio } from './contexts/PortfolioContext'; // Context Hook 추가
import { 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X, 
  PlayCircle,
  Star,
  MessageCircle,
  Phone,
  Mail,
  Zap,
  LayoutTemplate,
  MonitorPlay,
  TrendingUp,
  ArrowDown,
  Images,
  Film,
  Lock
} from 'lucide-react';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'order' | 'admin'>('landing'); // 'admin' 뷰 추가
  const { items: portfolioItems } = usePortfolio(); // Context에서 데이터 가져오기

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

  const handleOrder = () => {
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

  // --- View Routing ---
  if (view === 'order') {
    return <OrderWorkflow onBack={handleBackToLanding} />;
  }

  if (view === 'admin') {
    return <AdminPage onBack={handleBackToLanding} />;
  }

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
              AI VOCAL<span className="text-yellow-500"> FX</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)}
                className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.label}
              </button>
            ))}
            
            <div className="pl-4 border-l border-slate-200">
              <Button size="sm" variant="primary" onClick={handleOrder} className="flex items-center gap-2 shadow-yellow-400/30">
                영상 제작하기 <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 p-4 md:hidden flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
            {NAV_LINKS.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)}
                className="text-left py-2 font-medium text-slate-700 border-b border-slate-50 last:border-0"
              >
                {link.label}
              </button>
            ))}
            
            <Button fullWidth onClick={handleOrder}>
              영상 제작하기
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
               <span className="text-xs md:text-sm font-bold text-yellow-400">당일 제작 완료 보장</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 break-keep animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              사진 몇 장만 주시면,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">오늘 바로</span> AI 홍보 영상이 완성됩니다
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed break-keep animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              복잡한 편집, 비싼 외주 비용은 잊으세요.<br/>
              단 <span className="text-white font-bold border-b-2 border-yellow-400">₩9,900</span>에 기획부터 영상 제작까지 AI가 다 해드립니다.
            </p>

            <Button size="lg" onClick={handleOrder} className="animate-pulse shadow-[0_0_40px_rgba(250,204,21,0.3)] px-10 py-5 text-xl rounded-full animate-in fade-in zoom-in duration-700 delay-300">
              👉 ₩9,900 영상 바로 만들기
            </Button>
            
            <p className="mt-4 text-xs text-slate-400 animate-in fade-in duration-1000 delay-500">
              * 결과물 불만족 시 100% 환불 보장
            </p>
          </div>
        </section>

        {/* --- Section 2: Portfolio Showcase (Revised: Before/After) --- */}
        <section id="portfolio" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-screen-xl">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                💬 "진짜 이 퀄리티가 ₩9,900 맞나요?"
              </h2>
              <p className="text-slate-500">네, 실제 고객님들이 <span className="text-blue-600 font-bold bg-blue-50 px-1">보내주신 사진</span>과 <span className="text-yellow-600 font-bold bg-yellow-50 px-1">완성된 결과물</span>입니다.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {portfolioItems.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col relative">
                  
                  {/* Top Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-yellow-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {item.tag}
                  </div>

                  <div className="p-5 pb-0">
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.category} • {item.desc}</p>
                  </div>

                  {/* Visual Comparison Area */}
                  <div className="p-5 flex flex-col gap-3">
                    
                    {/* Input Area */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Images className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">보내주신 사진 (Input)</span>
                      </div>
                      <div className="flex gap-2">
                        {item.inputs.map((img, i) => (
                          <div key={i} className="w-1/3 aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white relative">
                            <img src={img} alt="input" className="w-full h-full object-cover opacity-80" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex justify-center -my-2 relative z-10">
                      <div className="bg-white border border-slate-200 rounded-full p-1 shadow-sm">
                        <ArrowDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    {/* Output Area (Video Thumbnail) */}
                    <div className="relative rounded-xl overflow-hidden shadow-md aspect-video group-hover:ring-2 ring-yellow-400 transition-all">
                       <img src={item.result} alt="result" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-lg group-hover:scale-110 transition-transform">
                             <PlayCircle className="w-6 h-6 text-white fill-white/20" />
                          </div>
                       </div>
                       <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                         <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                           <Film className="w-3 h-3" /> REC
                         </div>
                         <span className="text-white text-xs font-medium drop-shadow-md">AI 제작 완료</span>
                       </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
               <p className="text-slate-500 text-sm mb-4">
                 * 위 사례들은 관리자 페이지에서 실시간으로 업데이트됩니다.
               </p>
            </div>
          </div>
        </section>

        {/* --- Section 3: Targeting (Services) --- */}
        <section id="services" className="py-20 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4 max-w-screen-xl">
             <div className="grid md:grid-cols-3 gap-6">
               {TARGETS.map((target, idx) => (
                 <div key={idx} className="bg-slate-50 p-8 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-100">
                    <div className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Target 0{idx+1}</div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">{target.title}</h3>
                    <p className="text-slate-600 mb-6 min-h-[3rem] break-keep">{target.desc}</p>
                    <button onClick={handleOrder} className="text-sm font-bold text-slate-900 flex items-center gap-2 hover:gap-3 transition-all border-b-2 border-yellow-400 pb-1 w-fit">
                      {target.action} <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* --- Section 4: Pricing --- */}
        <section id="pricing" className="py-24 bg-slate-900 text-white relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="container mx-auto px-4 max-w-screen-xl text-center relative z-10">
             <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
               이 모든 구성이,<br/>
               <span className="text-yellow-400">커피 두 잔 값인 ₩9,900</span>
             </h2>

             <div className="max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 mb-10">
                <div className="flex flex-col gap-4">
                  {[
                    "전문 AI 영상 기획 & 대본 생성",
                    "리얼한 AI 성우 내레이션",
                    "트렌디한 BGM & 자막 디자인",
                    "상업적 이용 100% 가능"
                  ].map((feat, i) => (
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
                  <span className="text-slate-400 text-sm line-through">정상가 ₩50,000</span>
                  <div className="text-5xl font-black text-white mt-1 mb-2">₩9,900</div>
                  <span className="bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-1 rounded">VAT 포함</span>
                </div>
             </div>

             <div className="flex flex-col items-center gap-2">
                <Button size="lg" onClick={handleOrder} className="px-12 py-4 text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  지금 ₩9,900으로 제작하기
                </Button>
                <p className="text-slate-400 text-sm mt-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> 
                  결과물 불만족 시 100% 환불 보장
                </p>
             </div>
          </div>
        </section>

        {/* Section 5 (Free Trial) removed */}

        {/* --- Section 6: Contact (Order Form) --- */}
        <section id="contact" className="py-20 bg-white border-t border-slate-200">
           <div className="container mx-auto px-4 max-w-screen-md text-center">
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
               영상 제작 문의 / 주문
             </h2>
             <p className="text-slate-600 mb-10 text-lg">
               원하시는 영상 종류를 알려주시면,<br/>
               담당자가 확인 후 <b>제작 가이드와 결제 링크</b>를 보내드립니다.
             </p>

             <div className="grid md:grid-cols-2 gap-4 mb-8">
                <a href="tel:010-1234-5678" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-yellow-400 hover:shadow-md transition-all flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-yellow-100 transition-colors">
                        <Phone className="w-6 h-6 text-slate-400 group-hover:text-yellow-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-500 uppercase">전화 주문</p>
                        <p className="text-lg font-bold text-slate-900">010-1234-5678</p>
                    </div>
                </a>
                <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-yellow-400 hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer" onClick={() => alert("카카오톡 채널로 연결됩니다.")}>
                    <div className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-slate-900" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-slate-500 uppercase">가장 빠른 접수</p>
                        <p className="text-lg font-bold text-slate-900">카카오톡 1:1 채팅</p>
                    </div>
                </div>
             </div>
             
             <div className="bg-slate-50 p-6 rounded-xl text-left border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <Mail className="w-5 h-5" /> 이메일 간편 접수
               </h3>
               <div className="space-y-4">
                 <input type="text" placeholder="연락받으실 전화번호 (예: 010-0000-0000)" className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-yellow-400 text-slate-900 placeholder:text-slate-400" />
                 <textarea placeholder="제작하고 싶은 영상 내용 (예: 강남역 카페 홍보 영상 만들고 싶어요)" className="w-full p-3 bg-white border border-slate-300 rounded-lg h-32 focus:outline-none focus:border-yellow-400 resize-none text-slate-900 placeholder:text-slate-400"></textarea>
                 <Button fullWidth onClick={() => alert("접수가 완료되었습니다. 담당자가 곧 연락드립니다.")}>
                    주문 접수하기
                 </Button>
               </div>
             </div>
           </div>
        </section>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <span className="font-black text-white text-lg">AI VOCAL FX</span>
              </div>
              <p>사업자등록번호: 000-00-00000 | 대표: 김대표</p>
              <p>주소: 서울특별시 강남구 테헤란로 000</p>
              <p className="mt-2 text-xs text-slate-500">
                *본 서비스는 AI 기술을 활용하여 제작되며, 결과물의 저작권은 구매자에게 귀속됩니다.
              </p>
            </div>
            <div className="flex flex-col gap-4 items-end">
              <div className="flex gap-6">
                <a href="#" className="hover:text-white transition-colors">이용약관</a>
                <a href="#" className="hover:text-white transition-colors">개인정보처리방침</a>
              </div>
              {/* 관리자 페이지 진입 버튼 (Footer에 위치) */}
              <button 
                onClick={handleAdminEnter}
                className="text-xs text-slate-700 hover:text-slate-500 flex items-center gap-1 transition-colors"
              >
                <Lock className="w-3 h-3" /> 관리자 로그인
              </button>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-600 text-xs">
            © 2024 AI VOCAL FX. All rights reserved.
          </p>
        </div>
      </footer>

      {/* --- Mobile Fixed CTA --- */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-40">
        <Button 
          fullWidth 
          size="lg" 
          className="shadow-2xl shadow-slate-900/40 flex items-center justify-between px-6 bg-yellow-400 text-slate-900 border-none"
          onClick={handleOrder}
        >
          <span className="font-bold text-sm">지금 시작하면</span>
          <span className="flex items-center gap-1 font-black text-lg">
            ₩9,900 <ArrowRight className="w-5 h-5 ml-1" />
          </span>
        </Button>
      </div>

    </div>
  );
};

export default App;