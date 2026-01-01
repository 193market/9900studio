import React, { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Button } from './Button';
import { Lock, Upload, ArrowLeft, Film, Settings, RotateCcw, Save, Grid, Plus, X, Trash2, Link as LinkIcon, Bot, FileText, AlertCircle, Folder, ExternalLink, Code, Copy, Cloud, CloudOff, RefreshCw } from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
}

// 영상 링크 타입 판별 및 변환 헬퍼 (YouTube Shorts 지원)
const getVideoEmbedInfo = (inputUrl: string) => {
  const url = inputUrl ? inputUrl.trim() : '';
  if (!url) return { type: 'error', url: '', originalUrl: '', message: '' };

  // 1. YouTube 링크 (Shorts 포함)
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    const queryParams = `?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
    return {
      type: 'youtube',
      id: videoId,
      url: `https://www.youtube.com/embed/${videoId}${queryParams}`,
      originalUrl: url
    };
  }

  // 2. Google Drive 링크 처리
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
    serviceItems, adminPassword, isLiveMode,
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

  // 데이터 내보내기 (JSON 파일 다운로드 - 백업용)
  const handleDownloadBackup = () => {
    const dataStr = JSON.stringify(serviceItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `service_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            {isLiveMode ? (
               <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                 <Cloud className="w-3 h-3" /> Auto Sync
               </span>
            ) : (
               <span className="bg-yellow-400 text-slate-900 text-xs px-2 py-0.5 rounded font-bold flex items-center gap-1">
                 <CloudOff className="w-3 h-3" /> Local Mode
               </span>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onBack} className="text-sm text-slate-300 hover:text-white flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" /> 사이트 보기
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Sync Alert (If not connected) */}
        {!isLiveMode && (
           <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8 rounded-r-lg shadow-sm">
              <div className="flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                 <div>
                    <h3 className="font-bold text-orange-800">자동 동기화가 꺼져있습니다. (모바일에서 안 보임)</h3>
                    <p className="text-sm text-orange-700 mt-1 leading-relaxed">
                       현재 변경사항은 이 컴퓨터에만 저장됩니다. 스마트폰 등 다른 기기에서도 보려면 
                       <span className="font-bold bg-orange-200 px-1 rounded mx-1">services/firebase.ts</span> 
                       파일에 Firebase 설정값을 입력해야 합니다.
                    </p>
                 </div>
              </div>
           </div>
        )}

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
             <Settings className="w-4 h-4" /> 설정 (동기화/백업)
           </button>
        </div>

        {/* Tab Content: Services */}
        {activeTab === 'services' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">서비스 메뉴 수정</h2>
                    <p className="text-sm text-slate-500 mt-1">
                       {isLiveMode ? "수정 즉시 모든 기기에 반영됩니다." : "저장 후 '설정' 탭에서 데이터를 복사하여 배포하세요."}
                    </p>
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

                      {/* 비디오 업로드 영역 */}
                      <div className="space-y-6">
                          <div>
                              <div className="flex items-center justify-between mb-2">
                                  <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                      <Film className="w-3 h-3" /> 샘플 영상
                                  </label>
                                  <span className="text-[10px] text-slate-400">
                                    * 5초마다 자동 슬라이드
                                  </span>
                              </div>
                              
                              <div className="grid grid-cols-4 gap-2">
                                  {item.results.map((videoSrc, idx) => {
                                    const embedInfo = getVideoEmbedInfo(videoSrc);
                                    return (
                                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-black">
                                          {embedInfo.type === 'error' ? (
                                             <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-2 text-center">
                                                <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
                                                <p className="text-[10px] text-red-600 font-bold break-all leading-tight">
                                                  오류
                                                </p>
                                             </div>
                                          ) : embedInfo.type !== 'video' ? (
                                             <iframe 
                                               src={embedInfo.url} 
                                               className="w-full h-full object-cover" 
                                               title={`Video ${idx}`}
                                             />
                                          ) : (
                                             <video src={embedInfo.url} className="w-full h-full object-cover" muted />
                                          )}
                                          
                                          <button 
                                            onClick={() => removeServiceVideo(item.id, idx)}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                      </div>
                                    );
                                  })}
                              </div>

                              {/* Add Video Actions */}
                              <div className="grid grid-cols-1 gap-2 mt-2">
                                  {/* URL Input (Primary Recommendation) */}
                                  <div className="p-2 border border-blue-200 rounded-lg bg-blue-50/50">
                                    <div className="flex items-center gap-1 mb-1">
                                        <LinkIcon className="w-3 h-3 text-blue-600" />
                                        <span className="text-[10px] font-bold text-blue-700">외부 영상 링크 (권장)</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <input 
                                          type="text" 
                                          placeholder="유튜브 / 구글드라이브 공유 링크 붙여넣기" 
                                          className="w-full text-[11px] p-1.5 border border-blue-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                          value={urlInputs[item.id] || ''}
                                          onChange={(e) => setUrlInputs({...urlInputs, [item.id]: e.target.value})}
                                        />
                                        <button 
                                          onClick={() => handleUrlSubmit(item.id)}
                                          className="bg-blue-600 text-white text-[10px] px-3 rounded hover:bg-blue-700 font-bold whitespace-nowrap"
                                        >
                                          추가
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-blue-400 mt-1">
                                      * 유튜브 쇼츠 링크도 가능합니다. (자동 변환됨)
                                    </p>
                                  </div>

                                  {/* File Upload (Secondary - with Warning) */}
                                  <label className={`p-2 flex flex-col items-center justify-center border border-dashed rounded-lg cursor-pointer transition-colors ${isLiveMode ? 'border-orange-200 bg-orange-50 hover:bg-orange-100' : 'border-slate-300 hover:bg-slate-50'}`}>
                                      <div className="flex items-center gap-2">
                                        <Upload className={`w-3 h-3 ${isLiveMode ? 'text-orange-500' : 'text-slate-400'}`} />
                                        <span className={`text-[10px] font-bold ${isLiveMode ? 'text-orange-600' : 'text-slate-500'}`}>
                                          파일 직접 업로드 {isLiveMode && '(DB용량 주의)'}
                                        </span>
                                      </div>
                                      <input 
                                          type="file" 
                                          accept="video/*"
                                          className="hidden"
                                          multiple
                                          onChange={(e) => {
                                              if(e.target.files) addServiceVideos(item.id, e.target.files);
                                          }}
                                      />
                                  </label>
                              </div>
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
          <div className="max-w-md mx-auto space-y-8">
             {/* 1. Sync Status */}
             <div className={`rounded-2xl shadow-lg border p-8 text-white relative overflow-hidden ${isLiveMode ? 'bg-green-600 border-green-500' : 'bg-slate-800 border-slate-700'}`}>
                {isLiveMode ? (
                  <>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                     <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Cloud className="w-5 h-5" /> 자동 동기화 사용 중
                     </h3>
                     <p className="text-green-100 text-sm mb-6 leading-relaxed">
                        현재 Firebase 데이터베이스와 연결되어 있습니다.
                        <br/>
                        수정 사항이 모든 기기에 <b>즉시 자동 반영</b>됩니다.
                     </p>
                  </>
                ) : (
                  <>
                     <h3 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">
                        <CloudOff className="w-5 h-5" /> 자동 동기화 미사용
                     </h3>
                     <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                        현재는 변경사항이 이 컴퓨터에만 저장됩니다.
                        <br/>
                        <code className="bg-slate-900 px-1 py-0.5 rounded text-yellow-200">services/firebase.ts</code> 파일에 설정값을 넣으면 자동 모드로 전환됩니다.
                     </p>
                  </>
                )}
                
                {/* Manual Backup Button (Always available) */}
                <button 
                  onClick={handleDownloadBackup}
                  className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/20"
                >
                  <Copy className="w-4 h-4" />
                  현재 데이터 백업(다운로드)
                </button>
             </div>

             {/* 2. Password Change */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
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

             {/* 3. Reset Data */}
             <div className="bg-red-50 rounded-2xl border border-red-100 p-8">
                <h3 className="text-lg font-bold text-red-700 mb-2 flex items-center gap-2">
                   <RotateCcw className="w-4 h-4" /> 데이터 초기화
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