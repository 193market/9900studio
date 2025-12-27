import React, { useState } from 'react';
import { Button } from './Button';
import { generateOrderScript } from '../services/geminiService';
import { 
  CreditCard, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  ChevronLeft,
  Home,
  ShoppingBag,
  UserSquare2,
  AlertCircle
} from 'lucide-react';

interface OrderWorkflowProps {
  onBack: () => void;
}

export const OrderWorkflow: React.FC<OrderWorkflowProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [isPaid, setIsPaid] = useState(false);
  const [videoType, setVideoType] = useState<string>('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [scriptTopic, setScriptTopic] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Step 1: Payment Simulator
  const handlePayment = () => {
    const confirmPayment = window.confirm("테스트 결제: '확인'을 누르면 결제가 완료됩니다.");
    if (confirmPayment) {
      setIsPaid(true);
      setStep(2); // Move to next step automatically
    }
  };

  // Step 4: AI Script Generation
  const handleGenerateScript = async () => {
    if (!scriptTopic.trim()) return;
    setIsGenerating(true);
    const result = await generateOrderScript(scriptTopic);
    setGeneratedScript(result);
    setIsGenerating(false);
  };

  // Step 5: Email Validation & Submit
  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("정확한 이메일 주소를 입력해 주세요.");
      return;
    }
    setEmailError('');
    
    // Final Submission Logic
    alert(`✅ 주문이 접수되었습니다!\n\n유형: ${videoType}\n대본: ${generatedScript ? 'AI 생성 완료' : '미입력'}\n이메일: ${email}\n\n담당자가 확인 후 24시간 내 연락드립니다.`);
    onBack(); // Return to home
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          메인으로 돌아가기
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-2">영상 제작 신청서</h1>
        <p className="text-slate-600 mb-8">AI 제작 도구를 통해 빠르고 간편하게 영상을 주문하세요.</p>

        <div className="space-y-6">
          
          {/* Step 1: Payment */}
          <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border ${isPaid ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                결제 확인
              </h2>
              {isPaid && <CheckCircle2 className="w-6 h-6 text-green-500" />}
            </div>
            
            {!isPaid ? (
              <div className="text-center py-6">
                <p className="text-lg font-medium text-slate-800 mb-2">🚀 거의 다 왔습니다!</p>
                <p className="text-slate-500 mb-6">먼저 결제를 진행해 주시면 아래의 <b>제작 도구가 활성화</b>됩니다.</p>
                <Button onClick={handlePayment} size="lg" className="w-full md:w-auto shadow-xl shadow-yellow-400/20">
                  <CreditCard className="w-5 h-5 mr-2" />
                  신용카드/페이 결제하기 (₩9,900)
                </Button>
                <p className="text-xs text-slate-400 mt-4">* 결제 후 제작이 진행되지 않을 경우 100% 환불됩니다.</p>
              </div>
            ) : (
              <div className="bg-green-50 text-green-800 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">결제가 완료되었습니다. 아래 단계를 진행해주세요.</span>
              </div>
            )}
          </div>

          {/* Wrapper for steps 2-5 to handle disabled state */}
          <div className={`space-y-6 transition-all duration-500 ${!isPaid ? 'opacity-40 pointer-events-none grayscale-[0.5]' : ''}`}>
            
            {/* Step 2: Video Type */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">2</span>
                어떤 종류의 영상을 만들까요?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'real_estate', label: '부동산 매물', icon: <Home className="w-6 h-6"/>, desc: '중개용, 분양 홍보' },
                  { id: 'product', label: '제품 홍보', icon: <ShoppingBag className="w-6 h-6"/>, desc: '커머스, 상세페이지' },
                  { id: 'avatar', label: '회사/인물', icon: <UserSquare2 className="w-6 h-6"/>, desc: '인터뷰, 인사말' },
                ].map((type) => (
                  <div 
                    key={type.id}
                    onClick={() => setVideoType(type.label)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:bg-slate-50 ${videoType === type.label ? 'border-yellow-400 bg-yellow-50/50 ring-1 ring-yellow-400' : 'border-slate-100'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${videoType === type.label ? 'bg-yellow-400 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>
                      {type.icon}
                    </div>
                    <div className="font-bold text-slate-900">{type.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{type.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Upload */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">3</span>
                제작 자료 업로드
              </h2>
              <p className="text-sm text-slate-500 mb-6 ml-10">사진은 최소 3장 이상 권장하며, 고화질일수록 결과물이 좋습니다.</p>
              
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-yellow-400 hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-500">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-700">
                    {files && files.length > 0 ? `${files.length}개의 파일이 선택됨` : '클릭하여 사진/영상 업로드'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">또는 파일을 여기로 드래그하세요</p>
                </div>
              </div>
            </div>

            {/* Step 4: AI Script */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">4</span>
                  무설탕 대본 기획? AI에게 맡기세요!
                </h2>
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">AI Beta</span>
              </div>
              <p className="text-sm text-slate-500 mb-6 ml-10">이름만 넣으면 5초 만에 판매 시나리오가 나옵니다.</p>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="mb-2 flex justify-between items-end">
                  <label className="text-xs font-bold text-slate-500">주제/키워드 입력</label>
                  <span className={`text-xs font-bold ${scriptTopic.length >= 160 ? 'text-red-500' : 'text-slate-400'}`}>
                    {scriptTopic.length} / 160자
                  </span>
                </div>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={scriptTopic}
                    maxLength={160}
                    onChange={(e) => setScriptTopic(e.target.value)}
                    placeholder="예: 맛있는 수제 쿠키, 강남역 오피스텔 (한글 160자 이내)"
                    className="flex-1 p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-slate-900 placeholder:text-slate-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateScript()}
                  />
                  <Button onClick={handleGenerateScript} disabled={isGenerating || !scriptTopic}>
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  </Button>
                </div>
                
                {generatedScript ? (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">생성된 대본 (수정 가능)</label>
                    <textarea 
                      value={generatedScript}
                      onChange={(e) => setGeneratedScript(e.target.value)}
                      className="w-full h-32 p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm leading-relaxed resize-none text-slate-900"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 text-center py-4 bg-white/50 rounded border border-dashed border-slate-200">
                    "맛있는 수제 쿠키"를 입력하면 150자 내외의 쇼츠 대본이 생성됩니다.
                  </div>
                )}
              </div>
            </div>

            {/* Step 5: Delivery Info */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">5</span>
                완성된 영상을 어디로 보내드릴까요?
              </h2>
              
              <div className="space-y-2">
                <label className="font-bold text-slate-700 text-sm">이메일 주소</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="예: hello@example.com"
                  className={`w-full p-4 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors text-slate-900 placeholder:text-slate-400 ${emailError ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {emailError}
                  </p>
                )}
              </div>
            </div>

            {/* Final Action */}
            <div className="pt-4 pb-20 md:pb-0">
              <Button 
                onClick={handleSubmit} 
                fullWidth 
                size="lg" 
                disabled={!isPaid || !videoType || !email}
                className="text-lg py-5 shadow-2xl shadow-yellow-400/30"
              >
                {!isPaid ? (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    결제 후 신청 가능합니다
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    입력한 정보로 영상 제작 요청하기
                  </>
                )}
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};