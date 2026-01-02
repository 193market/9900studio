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
  Lock,
  Send,
  ExternalLink,
  Plus,
  Trash2,
  FileText,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface OrderWorkflowProps {
  onBack: () => void;
  initialService?: string;
}

export const OrderWorkflow: React.FC<OrderWorkflowProps> = ({ onBack, initialService }) => {
  // Multi-Selection State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // File State Map (Key: Service Title) -> Changed from FileList to Map
  const [serviceFiles, setServiceFiles] = useState<{[key: string]: File[]}>({});
  
  // Script State Map (Key: Service Title)
  const [scriptTopics, setScriptTopics] = useState<{[key: string]: string}>({});
  const [generatedScripts, setGeneratedScripts] = useState<{[key: string]: string}>({});
  const [generatingStatus, setGeneratingStatus] = useState<{[key: string]: boolean}>({});
  
  // User Info State
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t, wt } = useLanguage();
  const { serviceItems } = usePortfolio();
  const PRICE_PER_UNIT = 9900;

  // Initialize with passed service
  useEffect(() => {
    if (initialService) {
      toggleService(initialService);
      // UX: 이미 선택된 경우 자연스럽게 다음 단계(업로드)로 시선 유도
      setTimeout(() => {
         const step2 = document.getElementById('step-2-container');
         if (step2) {
            step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }
      }, 500);
    }
  }, [initialService]);

  const toggleService = (title: string) => {
    setSelectedServices(prev => {
      if (prev.includes(title)) {
        // Deselect: Remove from array and cleanup script/file data
        const newSelection = prev.filter(t => t !== title);
        
        // Cleanup state
        const newTopics = {...scriptTopics}; delete newTopics[title];
        setScriptTopics(newTopics);

        const newFiles = {...serviceFiles}; delete newFiles[title];
        setServiceFiles(newFiles);
        
        return newSelection;
      } else {
        // Select
        return [...prev, title];
      }
    });
  };

  const handleFileChange = (serviceTitle: string, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setServiceFiles(prev => ({
        ...prev,
        [serviceTitle]: [...(prev[serviceTitle] || []), ...newFiles]
    }));
  };

  const removeFile = (serviceTitle: string, fileIndex: number) => {
    setServiceFiles(prev => {
        const currentFiles = prev[serviceTitle] || [];
        const updatedFiles = currentFiles.filter((_, i) => i !== fileIndex);
        return { ...prev, [serviceTitle]: updatedFiles };
    });
  };

  // Helper: Title Formatter (Korean big, English small)
  const renderServiceTitle = (title: string, isCompact = false) => {
    const match = title.match(/^(.*?)\s*\((.*?)\)$/);
    if (match) {
        return (
            <div className={`flex flex-col ${isCompact ? 'leading-tight' : 'leading-snug'}`}>
                <span className={`${isCompact ? 'text-sm' : 'text-lg'} font-black text-slate-900`}>{match[1]}</span>
                <span className={`${isCompact ? 'text-[10px]' : 'text-xs'} font-medium text-slate-400`}>{match[2]}</span>
            </div>
        );
    }
    return <span className={`${isCompact ? 'text-sm' : 'text-lg'} font-black text-slate-900`}>{title}</span>;
  };

  // Helper for Contextual Placeholders
  const getTopicPlaceholder = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('viral') || lower.includes('바이럴')) return '예: "이거 모르면 손해"라고 외치며 시작, 30대 직장인 타겟의 공감 유도 영상';
    if (lower.includes('unboxing') || lower.includes('언박싱')) return '예: 택배 박스를 뜯는 ASMR 소리 강조, 구성품 하나하나 클로즈업하며 설명';
    if (lower.includes('skit') || lower.includes('스킷')) return '예: 친구가 "너 피부 왜 이렇게 좋아?"라고 묻자 제품을 꺼내 보여주는 상황극';
    if (lower.includes('pov')) return '예: 카페 문을 열고 들어가서 키오스크로 주문하고 커피를 받는 1인칭 시점';
    if (lower.includes('ootd') || lower.includes('데일리룩')) return '예: 전신 거울 앞에서 오늘의 코디(트렌치코트, 부츠)를 머리부터 발끝까지 보여줌';
    if (lower.includes('asmr')) return '예: 뚜껑 따는 소리, 얼음컵에 음료 따르는 청량한 소리, 마시는 소리 강조';
    if (lower.includes('swap') || lower.includes('코디')) return '예: 박수 칠 때마다 캐주얼 -> 정장 -> 파티룩으로 순식간에 옷이 바뀌는 컷 편집';
    if (lower.includes('vfx') || lower.includes('이펙트')) return '예: 제품 주변으로 빛이 나거나, 신발이 공중에 떠있는 듯한 화려한 시각 효과';
    if (lower.includes('fitness') || lower.includes('헬스')) return '예: 러닝하는 사람 옆에 심박수, 속도, 칼로리 소모량이 그래픽으로 표시됨';
    if (lower.includes('meme') || lower.includes('코믹')) return '예: 멋지게 걷다가 발 헛디디는 반전, 웃긴 효과음과 줌인 효과 추가';
    if (lower.includes('sale') || lower.includes('할인')) return '예: 검은 배경에 네온 사인으로 "50% 할인", "오늘만 특가" 텍스트가 깜빡임';
    if (lower.includes('estate') || lower.includes('부동산')) return '예: 현관부터 거실, 주방, 안방 순서로 이동하며 채광과 넓은 수납공간 강조';
    if (lower.includes('food') || lower.includes('먹방')) return '예: 치즈가 쭉 늘어나는 피자 클로즈업, 맛있게 한 입 먹고 엄지척 하는 리액션';
    return '예: 영상에서 강조하고 싶은 핵심 포인트나 분위기, 타겟 고객층을 자세히 적어주세요.';
  };

  // Helper for Upload Guide
  const getUploadGuide = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('ootd') || lower.includes('데일리룩')) return '전신이 잘 나온 사진 2장 이상, 옷 소재가 보이는 클로즈업 사진 2장 이상';
    if (lower.includes('food') || lower.includes('먹방')) return '음식 전체 샷, 한 숟가락 뜬 클로즈업 샷, 메뉴판 사진 등';
    if (lower.includes('estate') || lower.includes('부동산')) return '현관, 거실, 주방, 화장실, 방 내부를 순서대로 촬영한 사진 또는 영상';
    if (lower.includes('unboxing') || lower.includes('언박싱')) return '박스 외관, 개봉 과정, 구성품 나열 사진들을 순서대로 올려주세요.';
    return '영상 제작에 사용할 고화질 사진이나 영상 파일들을 올려주세요.';
  }

  // Step 4: AI Script Generation (Per Item)
  const handleGenerateScript = async (serviceTitle: string) => {
    const topic = scriptTopics[serviceTitle];
    if (!topic?.trim()) return;

    setGeneratingStatus(prev => ({ ...prev, [serviceTitle]: true }));
    
    // Generate specifically for this service type
    const promptPrefix = `[영상 종류: ${serviceTitle}] `;
    const result = await generateOrderScript(promptPrefix + topic);
    
    setGeneratedScripts(prev => ({ ...prev, [serviceTitle]: result }));
    setGeneratingStatus(prev => ({ ...prev, [serviceTitle]: false }));
  };

  // Final Step: Validation, Submit to Formspree, then Redirect to Payment
  const handlePaymentAndSubmit = async () => {
    // 1. Validation
    if (selectedServices.length === 0) {
        setErrorMsg('최소 1개 이상의 영상 종류를 선택해주세요.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg(wt('step4.err_email'));
      return;
    }
    if (!companyName.trim() || !phoneNumber.trim()) {
      setErrorMsg(wt('step4.err_common'));
      return;
    }
    setErrorMsg('');

    // 2. Submit Data
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('applicant_name', companyName); 
    formData.append('phone', phoneNumber);
    
    // Combine selected services data
    const servicesData = selectedServices.map(title => {
        const item = serviceItems.find(i => i.title === title);
        const fileCount = serviceFiles[title]?.length || 0;
        return `
        [Service: ${title}]
        [Desc: ${item?.desc}]
        - Files Uploaded: ${fileCount} EA
        - User Topic: ${scriptTopics[title] || 'Not provided'}
        - AI Prompt Used: ${item?.aiPrompt || 'N/A'}
        -----------------------------------
        `;
    }).join('\n');

    const scriptsData = Object.entries(generatedScripts).map(([key, val]) => `[Script for ${key}]\n${val}\n`).join('\n=================\n');

    formData.append('selectedServices', selectedServices.join(', '));
    formData.append('orderDetails', servicesData);
    formData.append('generatedScripts', scriptsData);
    formData.append('totalPrice', (selectedServices.length * PRICE_PER_UNIT).toLocaleString() + '원');

    // Attach Files
    let totalFileCount = 0;
    Object.entries(serviceFiles).forEach(([serviceTitle, files]) => {
        (files as File[]).forEach((file, index) => {
            formData.append(`attachment`, file); 
            totalFileCount++;
        });
    });

    formData.append('totalFileCount', totalFileCount.toString());

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
            // 3. Success -> Redirect to Payment
            const confirmRedirect = window.confirm(wt('step5.alert'));
            if (confirmRedirect) {
               window.open('https://smartstore.naver.com/cheda/products/12907044385', '_blank');
               onBack(); // Return to home
            } else {
               onBack();
            }
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

  const totalPrice = selectedServices.length * PRICE_PER_UNIT;

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
          
          {/* Step 1: Video Type Selection (Multi) */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                {wt('step1.title')}
                </h2>
                <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {selectedServices.length}개 선택됨
                </span>
            </div>

            <p className="text-sm text-slate-500 mb-4 ml-10">
                원하는 영상을 <span className="font-bold text-slate-900">중복 선택</span>할 수 있습니다. 선택한 개수만큼 주문이 생성됩니다.
            </p>

            {/* Service Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {serviceItems.map((item) => {
                const isSelected = selectedServices.includes(item.title);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleService(item.title)}
                    className={`cursor-pointer p-4 rounded-xl border-2 text-left transition-all relative select-none ${
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
                    {/* Compact Title Render */}
                    {renderServiceTitle(item.title, true)}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {selectedServices.length === 0 && (
                <p className="text-red-500 text-xs mt-4 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> 제작할 영상 종류를 최소 1개 이상 선택해주세요.
                </p>
            )}
          </div>

          {/* Step 2: Upload (Per Service) */}
          <div id="step-2-container" className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 scroll-mt-24">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">2</span>
              {wt('step2.title')}
            </h2>
            <p className="text-sm text-slate-500 mb-6 ml-10">
               선택하신 각 영상 제작에 필요한 자료(사진/영상)를 업로드해주세요.
            </p>
            
            {selectedServices.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                    영상 종류를 먼저 선택해주세요.
                </div>
            ) : (
                <div className="space-y-6">
                    {selectedServices.map((serviceTitle, idx) => {
                        const item = serviceItems.find(i => i.title === serviceTitle);
                        const files = serviceFiles[serviceTitle] || [];
                        
                        return (
                          <div key={serviceTitle} className="bg-slate-50 p-5 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2">
                              <div className="mb-4 pb-3 border-b border-slate-200">
                                  <div className="flex items-center gap-3 mb-2">
                                      <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded shrink-0">
                                          {idx + 1}
                                      </span>
                                      {renderServiceTitle(serviceTitle)}
                                  </div>
                                  {/* Description from Service Item */}
                                  <p className="text-sm text-slate-600 leading-relaxed pl-8">
                                      {item?.desc}
                                  </p>
                              </div>
                              
                              {/* Upload Guide */}
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 flex items-start gap-2">
                                 <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                 <div className="text-xs text-blue-700">
                                     <span className="font-bold block mb-1">업로드 가이드</span>
                                     {getUploadGuide(serviceTitle)}
                                 </div>
                              </div>

                              {/* Dropzone */}
                              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-yellow-400 hover:bg-white transition-colors cursor-pointer relative group">
                                <input 
                                  type="file" 
                                  multiple 
                                  accept="image/*,video/*"
                                  onChange={(e) => handleFileChange(serviceTitle, e.target.files)}
                                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex flex-col items-center pointer-events-none">
                                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2 text-slate-400 shadow-sm group-hover:text-yellow-600 group-hover:scale-110 transition-all">
                                    <UploadCloud className="w-5 h-5" />
                                  </div>
                                  <p className="text-sm font-bold text-slate-600">
                                    클릭하여 파일 업로드
                                  </p>
                                  <p className="text-xs text-slate-400 mt-1">또는 파일을 여기로 드래그하세요</p>
                                </div>
                              </div>

                              {/* File List */}
                              {files.length > 0 && (
                                  <div className="mt-4 space-y-2">
                                      <p className="text-xs font-bold text-slate-500">업로드된 파일 ({files.length}개)</p>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                          {files.map((file, fIdx) => (
                                              <div key={fIdx} className="bg-white p-2 rounded border border-slate-200 flex items-center gap-2 relative group">
                                                  <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center shrink-0">
                                                      <ImageIcon className="w-4 h-4 text-slate-400" />
                                                  </div>
                                                  <span className="text-xs text-slate-600 truncate flex-1">{file.name}</span>
                                                  <button 
                                                    onClick={() => removeFile(serviceTitle, fIdx)}
                                                    className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                                                  >
                                                      <X className="w-3 h-3" />
                                                  </button>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </div>
                        );
                    })}
                </div>
            )}
          </div>

          {/* Step 3: AI Script (Multi Input) */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">3</span>
                {wt('step3.title')}
              </h2>
              <span className="bg-blue-100 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">AI Beta</span>
            </div>
            <p className="text-sm text-slate-500 mb-6 ml-10">
                선택한 각 서비스에 대해 주제를 입력하면 AI가 기획안을 제안합니다.
            </p>

            {selectedServices.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
                    영상 종류를 먼저 선택해주세요.
                </div>
            ) : (
                <div className="space-y-6">
                    {selectedServices.map((serviceTitle, idx) => {
                        const item = serviceItems.find(i => i.title === serviceTitle);
                        return (
                          <div key={serviceTitle} className="bg-slate-50 p-5 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 100}ms` }}>
                              <div className="mb-3 pb-3 border-b border-slate-200">
                                  <div className="flex items-center gap-3 mb-2">
                                      <span className="bg-slate-900 text-white text-xs font-bold px-2 py-0.5 rounded shrink-0">
                                          {idx + 1}
                                      </span>
                                      {renderServiceTitle(serviceTitle)}
                                  </div>
                                  <p className="text-sm text-slate-600 leading-relaxed pl-8">
                                      {item?.desc}
                                  </p>
                              </div>

                              <div className="mb-2">
                                  <label className="text-xs font-bold text-slate-500 block mb-1">
                                      이 영상의 주제/키워드
                                  </label>
                                  <div className="flex gap-2">
                                      <input 
                                          type="text" 
                                          value={scriptTopics[serviceTitle] || ''}
                                          onChange={(e) => setScriptTopics({...scriptTopics, [serviceTitle]: e.target.value})}
                                          placeholder={getTopicPlaceholder(serviceTitle)}
                                          className="flex-1 p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm placeholder:text-slate-400"
                                          onKeyDown={(e) => e.key === 'Enter' && handleGenerateScript(serviceTitle)}
                                      />
                                      <Button 
                                          size="sm"
                                          onClick={() => handleGenerateScript(serviceTitle)} 
                                          disabled={generatingStatus[serviceTitle] || !scriptTopics[serviceTitle]}
                                          className="whitespace-nowrap"
                                      >
                                          {generatingStatus[serviceTitle] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
                                          기획하기
                                      </Button>
                                  </div>
                              </div>

                              {generatedScripts[serviceTitle] && (
                                  <div className="mt-3 bg-white p-3 rounded-lg border border-blue-100 shadow-sm relative">
                                      <div className="absolute top-2 right-2">
                                          <Sparkles className="w-3 h-3 text-blue-400" />
                                      </div>
                                      <textarea 
                                          value={generatedScripts[serviceTitle]}
                                          onChange={(e) => setGeneratedScripts({...generatedScripts, [serviceTitle]: e.target.value})}
                                          className="w-full h-24 p-2 text-xs leading-relaxed resize-none focus:outline-none text-slate-700 bg-transparent"
                                      />
                                  </div>
                              )}
                          </div>
                        );
                    })}
                </div>
            )}
          </div>

          {/* Step 4: Applicant Info */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm">4</span>
              {wt('step4.title')}
            </h2>
            
            <div className="space-y-4">
              {/* 성명/회사명 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-sm">{wt('step4.label_company')}</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={wt('step4.placeholder_company')}
                  className="w-full p-4 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors text-slate-900 placeholder:text-slate-400 border-slate-300"
                />
              </div>

              {/* 전화번호 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-sm">{wt('step4.label_phone')}</label>
                <input 
                  type="tel" 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={wt('step4.placeholder_phone')}
                  className="w-full p-4 border bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors text-slate-900 placeholder:text-slate-400 border-slate-300"
                />
              </div>

              {/* 이메일 */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-sm">{wt('step4.label_email')}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={wt('step4.placeholder')}
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

          {/* Step 5: Final Payment & Submit */}
          <div className="bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800 text-white">
             <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center text-sm">5</span>
                {wt('step5.title')}
             </h2>
             <p className="text-slate-400 text-sm mb-6 ml-10">
               {wt('step5.desc')}
             </p>

             <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6 space-y-3">
                {selectedServices.map((service, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm text-slate-300">
                        {renderServiceTitle(service, true)}
                        <span>{PRICE_PER_UNIT.toLocaleString()}원</span>
                    </div>
                ))}
                
                <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
                    <span className="font-bold text-white">총 결제금액 ({selectedServices.length}개)</span>
                    <span className="font-black text-yellow-400 text-2xl">{totalPrice.toLocaleString()}원</span>
                </div>
             </div>

             <Button 
                onClick={handlePaymentAndSubmit} 
                fullWidth 
                size="lg" 
                disabled={isSubmitting}
                className="text-lg py-5 shadow-2xl shadow-yellow-400/20 bg-yellow-400 text-slate-900 hover:bg-yellow-500 border-none"
             >
                {isSubmitting ? (
                   <>
                     <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                     {wt('submit.sending')}
                   </>
                ) : (
                   <>
                     <Send className="w-5 h-5 mr-2" />
                     주문서 제출 및 결제하기
                   </>
                )}
             </Button>
             <p className="text-center text-slate-500 text-xs mt-4">
               {wt('step5.warn')}
             </p>
          </div>
            
        </div>
      </div>
    </div>
  );
};