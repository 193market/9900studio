import React, { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Button } from './Button';
import { Lock, Upload, ArrowLeft, Film, Settings, RotateCcw, Save, Grid, Plus, X, Trash2, Link as LinkIcon, Bot, FileText, AlertCircle, Folder, ExternalLink } from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
}

// 영상 링크 타입 판별 및 변환 헬퍼 (YouTube Shorts 지원)
const getVideoEmbedInfo = (inputUrl: string) => {
  const url = inputUrl ? inputUrl.trim() : '';
  if (!url) return { type: 'error', url: '', originalUrl: '', message: '' };

  // 1. YouTube 링크 (Shorts 포함)
  // 정규식에 'shorts'를 추가하여 /shorts/ 경로도 인식하도록 수정됨
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    // 쇼츠 및 일반 영상 공통 파라미터 (자동재생, 음소거, 반복, 컨트롤 숨김)
    const queryParams = `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
    return {
      type: 'youtube',
      id: videoId,
      url: `https://www.youtube.com/embed/${videoId}${queryParams}`,
      originalUrl: url
    };
  }

  // 2. Google Drive 링크 처리 (기존 로직 유지)
  if (url.includes('drive.google.com')) {
    let fileId = null;
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /open\?id=([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }

    if (fileId) {
      return {
        type: 'drive',
        id: fileId,
        url: `https://drive.google.com/file/d/${fileId}/preview`,
        originalUrl: url
      };
    }
  }

  // 3. 일반 비디오 파일
  return {
    type: 'video',
    id: url,
    url: url,
    originalUrl: url
  };
};

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'settings'>('services');
  
  // URL 입력 상태 관리용
  const [urlInputs, setUrlInputs] = useState<{[key: number]: string}>({});
  
  // 비밀번호 변경용 State
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const { 
    serviceItems, adminPassword, 
    updateServiceItem, addServiceVideos, addServiceVideoUrl, removeServiceVideo,
    updatePassword, resetData 
  } = usePortfolio();

  // 로그인 처리
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  // 비밀번호 변경 처리
  const handleChangePassword = () => {
    if (newPw.length < 4) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    if (newPw !== confirmPw) {
      alert('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    updatePassword(newPw);
    alert('비밀번호가 변경되었습니다.');
    setNewPw('');
    setConfirmPw('');
  };

  // URL 입력 핸들러
  const handleUrlSubmit = (itemId: number) => {
    const url = urlInputs[itemId];
    if (url) {
        addServiceVideoUrl(itemId, url.trim());
        setUrlInputs(prev => ({...prev, [itemId]: ''})); // 초기화
    }
  };

  const badgeOptions = ["BEST", "HOT", "NEW", "SALE"];

  // --- 로그인 전 화면 ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-slate-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">관리자 로그인</h2>
            <p className="text-slate-500 text-sm mt-2">포트폴리오 및 서비스 관리</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono text-slate-900 placeholder:text-slate-400"
            />
            <Button fullWidth size="lg">접속하기</Button>
            <button 
              type="button" 
              onClick={onBack}
              className="w-full text-center text-sm text-slate-400 hover:text-slate-600 py-2 border-t border-slate-100 mt-2"
            >
              메인으로 돌아가기
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- 로그인 후 관리자 화면 ---
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-lg">관리자 모드</h1>
            <span className="bg-yellow-400 text-slate-900 text-xs px-2 py-0.5 rounded font-bold">LocalStorage</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onBack} className="text-sm text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> 사이트 보기
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('services')}
             className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'services' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             <Grid className="w-4 h-4" /> 서비스 메뉴 관리
           </button>
           <button 
             onClick={() => setActiveTab('settings')}
             className={`pb-3 px-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
           >
             <Settings className="w-4 h-4" /> 설정 (비밀번호)
           </button>
        </div>

        {/* Tab Content: Services */}
        {activeTab === 'services' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">서비스 메뉴 수정</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        메인 페이지의 포트폴리오 영상을 관리합니다.
                    </p>
                </div>
                <div className="bg-blue-50 text-blue-800 text-xs px-4 py-3 rounded-lg border border-blue-100 flex items-start gap-2 max-w-md">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                        <span>
                            <b>권한 체크:</b> 클라우드 영상은 반드시 <u>'공개'</u> 상태여야 합니다.
                        </span>
                        <span className="text-blue-600 border-t border-blue-200 pt-1 mt-1">
                            <b>링크 팁:</b> YouTube Shorts 링크도 지원합니다.
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
              {serviceItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        {item.title}
                        <span className="text-xs font-normal text-slate-400 bg-white border px-1.5 rounded">ID: {item.id}</span>
                    </h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                      {/* 텍스트 수정 영역 */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">제목</label>
                          <input 
                            type="text" 
                            value={item.title}
                            onChange={(e) => updateServiceItem(item.id, 'title', e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded focus:border-blue-500 outline-none font-bold transition-colors text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">설명</label>
                          <input 
                            type="text" 
                            value={item.desc}
                            onChange={(e) => updateServiceItem(item.id, 'desc', e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded focus:border-blue-500 outline-none transition-colors text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">뱃지 (선택 또는 직접입력)</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {badgeOptions.map(option => (
                                <button 
                                  key={option}
                                  onClick={() => updateServiceItem(item.id, 'badge', option)}
                                  className={`px-2 py-1 text-xs rounded border transition-colors ${item.badge === option ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                                >
                                  {option}
                                </button>
                            ))}
                            <button 
                                onClick={() => updateServiceItem(item.id, 'badge', '')}
                                className="px-2 py-1 text-xs rounded border bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                            >
                              없음
                            </button>
                          </div>
                          <input 
                            type="text" 
                            value={item.badge}
                            onChange={(e) => updateServiceItem(item.id, 'badge', e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded focus:border-blue-500 outline-none text-red-500 transition-colors"
                            placeholder="뱃지 텍스트 직접 입력"
                          />
                        </div>
                      </div>

                      {/* 비디오 업로드 영역 (서비스) */}
                      <div className="space-y-6">
                          {/* Result Videos */}
                          <div>
                              <div className="flex items-center justify-between mb-2">
                                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                      <Film className="w-3 h-3" /> 샘플 영상 (다중 등록 가능)
                                  </label>
                                  <span className="text-[10px] text-slate-400">
                                    * 5초마다 자동 슬라이드
                                  </span>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-2">
                                  {item.results.map((videoSrc, idx) => {
                                    // videoSrc가 객체일 수도 있고 문자열일 수도 있음 (기존 데이터 호환)
                                    const embedInfo = getVideoEmbedInfo(videoSrc);
                                    
                                    return (
                                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-black">
                                          {embedInfo.type === 'error' ? (
                                             <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-2 text-center">
                                                <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
                                                <p className="text-[10px] text-red-600 font-bold break-all leading-tight">
                                                  {embedInfo.message}
                                                </p>
                                             </div>
                                          ) : embedInfo.type !== 'video' ? (
                                             <>
                                                <iframe 
                                                  src={embedInfo.url} 
                                                  className="w-full h-full object-cover" 
                                                  allowFullScreen 
                                                  title={`Video ${idx}`}
                                                />
                                                {/* 원본 바로가기 버튼 (디버깅용) */}
                                                <a 
                                                   href={embedInfo.originalUrl} 
                                                   target="_blank" 
                                                   rel="noopener noreferrer"
                                                   className="absolute top-1 left-1 bg-white/80 hover:bg-white text-slate-700 p-1 rounded-md z-20 transition-colors"
                                                   title="새 창에서 원본 열기"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                             </>
                                          ) : (
                                             <video src={embedInfo.url} className="w-full h-full object-cover" muted />
                                          )}
                                          
                                          <button 
                                            onClick={() => removeServiceVideo(item.id, idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-bold z-10">
                                            {idx + 1}
                                          </span>
                                      </div>
                                    );
                                  })}
                              </div>

                              {/* Add Video Actions */}
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                  {/* Option 1: File Upload (Multiple) */}
                                  <label className="p-3 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-yellow-400 transition-colors">
                                      <Upload className="w-4 h-4 text-slate-400 mb-1" />
                                      <span className="text-[10px] text-slate-500 font-bold">파일 다중 업로드</span>
                                      <span className="text-[9px] text-slate-400">(여러개 선택 가능)</span>
                                      <input 
                                          type="file" 
                                          accept="video/*"
                                          className="hidden"
                                          multiple // Allow multiple files
                                          onChange={(e) => {
                                              if(e.target.files) addServiceVideos(item.id, e.target.files);
                                          }}
                                      />
                                  </label>

                                  {/* Option 2: URL Input */}
                                  <div className="p-2 border border-slate-200 rounded-lg bg-slate-50">
                                    <div className="flex items-center gap-1 mb-1">
                                        <LinkIcon className="w-3 h-3 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-500">외부 영상 링크</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <input 
                                          type="text" 
                                          placeholder="https://..." 
                                          className="w-full text-[10px] p-1 border rounded"
                                          value={urlInputs[item.id] || ''}
                                          onChange={(e) => setUrlInputs({...urlInputs, [item.id]: e.target.value})}
                                        />
                                        <button 
                                          onClick={() => handleUrlSubmit(item.id)}
                                          className="bg-slate-900 text-white text-[10px] px-2 rounded hover:bg-slate-800"
                                        >
                                          추가
                                        </button>
                                    </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </div>

                    {/* AI 제작 가이드 섹션 */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                       <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <Bot className="w-4 h-4 text-slate-500" /> 
                          AI 제작 가이드 (내부 작업자용)
                       </h4>
                       <div className="grid md:grid-cols-1 gap-4">
                          <div>
                             <label className="text-xs font-bold text-slate-500 mb-1 block">사용 AI 툴 / 사이트</label>
                             <input 
                                type="text"
                                placeholder="예: Runway Gen-3, Midjourney v6" 
                                value={item.aiSite || ''}
                                onChange={(e) => updateServiceItem(item.id, 'aiSite', e.target.value)}
                                className="w-full p-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-500 outline-none text-slate-900"
                             />
                          </div>
                          <div>
                             <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> 참조 프롬프트 (Prompt)
                             </label>
                             <textarea 
                                placeholder="이 영상을 만들 때 사용한 프롬프트를 기록하세요..." 
                                value={item.aiPrompt || ''}
                                onChange={(e) => updateServiceItem(item.id, 'aiPrompt', e.target.value)}
                                className="w-full p-2 text-sm bg-white border border-slate-300 rounded focus:border-blue-500 outline-none h-20 resize-none text-slate-600 font-mono"
                             />
                          </div>
                       </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab Content: Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <Lock className="w-5 h-5 text-slate-400" /> 관리자 비밀번호 변경
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">새 비밀번호</label>
                    <input 
                      type="password" 
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-yellow-400 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">비밀번호 확인</label>
                    <input 
                      type="password" 
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-yellow-400 text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <Button onClick={handleChangePassword} fullWidth className="mt-2">
                    <Save className="w-4 h-4 mr-2" />
                    변경 내용 저장
                  </Button>
                </div>
             </div>

             <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
                <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
                   <AlertIcon /> 데이터 초기화
                </h3>
                <p className="text-red-600 text-sm mb-6">
                  모든 데이터와 비밀번호를 초기 상태로 되돌립니다.
                </p>
                <button 
                  onClick={resetData}
                  className="w-full py-3 border border-red-200 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  초기화 하기
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);