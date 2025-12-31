import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { generateOrderScript } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { usePortfolio } from '../contexts/PortfolioContext';
import { 
  CreditCard, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ChevronLeft,
  AlertCircle,
} from 'lucide-react';

interface OrderWorkflowProps {
  onBack: () => void;
  initialService?: string;
}

export const OrderWorkflow: React.FC<OrderWorkflowProps> = ({ onBack, initialService }) => {
  const [isPaid, setIsPaid] = useState(false);
  
  // Selection State
  const [videoType, setVideoType] = useState<string>('');
  
  const [files, setFiles] = useState<FileList | null>(null);
  const [scriptTopic, setScriptTopic] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // User Info State
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t, wt } = useLanguage();
  const { serviceItems } = usePortfolio();

  // Initialize with passed service
  useEffect(() => {
    if (initialService) {
      setVideoType(initialService);
    }
  }, [initialService]);

  // Step 1: Payment Simulator
  const handlePayment = () => {
    const confirmPayment = window.confirm(wt('step1.alert'));
    if (confirmPayment) {
      setIsPaid(true);
      // Removed auto-advance to let user verify settings
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

  // Step 5: Email Validation & Submit (Formspree)
  const handleSubmit = async () => {
    // 1. Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg(wt('step5.err_email'));
      return;
    }
    if (!companyName.trim() || !phoneNumber.trim()) {
      setErrorMsg(wt('step5.err_common'));
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    // 2. Data Preparation
    const formData = new FormData();
    formData.append('email', email);
    formData.append('company', companyName);
    formData.append('phone', phoneNumber);
    formData.append('videoType', videoType);
    formData.append('scriptTopic', scriptTopic);
    formData.append('generatedScript', generatedScript);
    if (files) {
        formData.append('fileCount', files.length.toString());
    }

    try {
        // Formspree로 데이터 전송
        const response = await fetch("https://formspree.io/infin@naver.com", {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: formData
        });

        if (response.ok) {
            alert(wt('submit.alert'));
            onBack(); // Return to home
        } else {
            alert("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {wt('back')}
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-2">{wt('title')}</h1>
        <p className="text-slate-600 mb-8">{wt('subtitle')}</p>

        <div className="space-y-6">
          
          {/* Step 1: Payment */}
          <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border ${isPaid ? 'border-green-500 ring-1 ring-green-500' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                {wt('step1.title')}
              </h2>
              {isPaid && <CheckCircle2 className="w-6 h-6 text-green-500" />}
            </div>
            
            {!isPaid ? (
              <div className="text-center py-6">
                <p className="text-lg font-medium text-slate-800 mb-2">{wt('step1.desc_title')}</p>
                <p className="text-slate-500 mb-6" dangerouslySetInnerHTML={{__html: wt('step1.desc')}}></p>
                <Button onClick={handlePayment} size="lg" className="w-full md:w-auto shadow-xl shadow-yellow-400/20">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {wt('step1.btn')}
                </Button>
                <p className="text-xs text-slate-400 mt-4">{wt('step1.warn')}</p>
              </div>
            ) : (
              <div className="bg-green-50 text-green-800 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">{wt('step1.done')}</span>
              </div>
            )}
          </div>

          {/* Wrapper for steps 2-5 */}
          <div className="space-y-6 transition-all duration-500">
            
            {/* Step 2: Video Type (Enhanced) */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">2</span>
                {wt('step2.title')}
              </h2>

              {/* Service Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {serviceItems.map((item) => {
                  const isSelected = videoType === item.title;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setVideoType(item.title)}
                      className={`cursor-pointer p-4 rounded-xl border-2 text-left transition-all relative ${
                        isSelected 
                          ? 'border-yellow-400 bg-yellow-50/30 ring-1 ring-yellow-400' 
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                           item.badge ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                         }`}>
                           {item.badge || 'Basic'}
                         </span>
                         {isSelected && <CheckCircle2 className="w-5 h-5 text-yellow-500 fill-white" />}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              {!videoType && (
                 <p className="text-red-500 text-xs mt-4 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> 제작할 영상 종류를 선택해주세요.
                 </p>
              )}
            </div>

            {/* Step 3: Upload */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">3</span>
                {wt('step3.title')}
              </h2>
              <p className="text-sm text-slate-500 mb-6 ml-10">{wt('step3.desc')}</p>
              
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-yellow-400 hover:bg-slate-50 transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*,video/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-500 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-colors">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-slate-700">
                    {files && files.length > 0 ? `${files.length} ${wt('step3.drop_selected')}` : wt('step3.drop_empty')}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{wt('step3.drop_drag')}</p>
                </div>
              </div>
            </div>

            {/* Step 4: AI Script */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">4</span>
                  {wt('step4.title')}
                </h2>
                <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">AI Beta</span>
              </div>
              <p className="text-sm text-slate-500 mb-6 ml-10">{wt('step4.desc')}</p>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="mb-2 flex justify-between items-end">
                  <label className="text-xs font-bold text-slate-500">{wt('step4.label_topic')}</label>
                  <span className={`text-xs font-bold ${scriptTopic.length >= 160 ? 'text-red-500' : 'text-slate-400'}`}>
                    {scriptTopic.length} / 160
                  </span>
                </div>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={scriptTopic}
                    maxLength={160}
                    onChange={(e) => setScriptTopic(e.target.value)}
                    placeholder={wt('step4.placeholder')}
                    className="flex-1 p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-slate-900 placeholder:text-slate-400"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateScript()}
                  />
                  <Button onClick={handleGenerateScript} disabled={isGenerating || !scriptTopic}>
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  </Button>
                </div>
                
                {generatedScript ? (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">{wt('step4.label_result')}</label>
                    <textarea 
                      value={generatedScript}
                      onChange={(e) => setGeneratedScript(e.target.value)}
                      className="w-full h-32 p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm leading-relaxed resize-none text-slate-900"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 text-center py-4 bg-white/50 rounded border border-dashed border-slate-200">
                    {wt('step4.empty_guide')}
                  </div>
                )}
              </div>
            </div>

            {/* Step 5: Applicant Info */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">5</span>
                {wt('step5.title')}
              </h2>
              
              <div className="space-y-4">
                {/* 회사명 */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-sm">{wt('step5.label_company')}</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder={wt('step5.placeholder_company')}
                    className="w-full p-4 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors text-slate-900 placeholder:text-slate-400 border-slate-300"
                  />
                </div>

                {/* 전화번호 */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-sm">{wt('step5.label_phone')}</label>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={wt('step5.placeholder_phone')}
                    className="w-full p-4 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors text-slate-900 placeholder:text-slate-400 border-slate-300"
                  />
                </div>

                {/* 이메일 */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-sm">{wt('step5.label_email')}</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={wt('step5.placeholder')}
                    className={`w-full p-4 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors text-slate-900 placeholder:text-slate-400 ${errorMsg ? 'border-red-500 bg-red-50' : 'border-slate-300'}`}
                  />
                </div>
                
                {errorMsg && (
                  <p className="text-red-500 text-xs flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" /> {errorMsg}
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
                disabled={!videoType || !email || !companyName || !phoneNumber || isSubmitting}
                className="text-lg py-5 shadow-2xl shadow-yellow-400/30"
              >
                {isSubmitting ? (
                   <>
                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                     {wt('submit.sending')}
                   </>
                ) : (
                   <>
                     <CheckCircle2 className="w-5 h-5 mr-2" />
                     {wt('submit.active')}
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