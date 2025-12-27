import React, { useState } from 'react';
import { Button } from './Button';
import { generateOrderScript } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
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

  const { wt } = useLanguage();

  // Step 1: Payment Simulator
  const handlePayment = () => {
    const confirmPayment = window.confirm(wt('step1.alert'));
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
      setEmailError(wt('step5.err_email'));
      return;
    }
    setEmailError('');
    
    // Final Submission Logic
    // Simple string replacement for alert message
    let alertMsg = wt('submit.alert');
    alertMsg = alertMsg.replace('{type}', videoType);
    alertMsg = alertMsg.replace('{script}', generatedScript ? 'AI Created' : 'None');
    alertMsg = alertMsg.replace('{email}', email);

    alert(alertMsg);
    onBack(); // Return to home
  };

  // Helper icons array mapped to types
  const typeIcons = {
    0: <Home className="w-6 h-6"/>,
    1: <ShoppingBag className="w-6 h-6"/>,
    2: <UserSquare2 className="w-6 h-6"/>
  };

  const videoTypes = wt('step2.types') as Array<{label: string, desc: string}>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-2xl mx-auto">
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

          {/* Wrapper for steps 2-5 to handle disabled state */}
          <div className={`space-y-6 transition-all duration-500 ${!isPaid ? 'opacity-40 pointer-events-none grayscale-[0.5]' : ''}`}>
            
            {/* Step 2: Video Type */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">2</span>
                {wt('step2.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {videoTypes.map((type, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setVideoType(type.label)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all hover:bg-slate-50 ${videoType === type.label ? 'border-yellow-400 bg-yellow-50/50 ring-1 ring-yellow-400' : 'border-slate-100'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${videoType === type.label ? 'bg-yellow-400 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>
                      {(typeIcons as any)[idx]}
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
                {wt('step3.title')}
              </h2>
              <p className="text-sm text-slate-500 mb-6 ml-10">{wt('step3.desc')}</p>
              
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

            {/* Step 5: Delivery Info */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">5</span>
                {wt('step5.title')}
              </h2>
              
              <div className="space-y-2">
                <label className="font-bold text-slate-700 text-sm">{wt('step5.label_email')}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={wt('step5.placeholder')}
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
                    {wt('submit.locked')}
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