import React, { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Button } from './Button';
import { Lock, ArrowLeft, Grid, Settings, Copy, Trash2, Upload, Sparkles, RotateCcw } from 'lucide-react';

// Firebase Import Removed

interface AdminPageProps {
  onBack: () => void;
}

// Helper: YouTube/Drive/File URL parser
const getVideoEmbedInfo = (inputUrl: string) => {
  const url = inputUrl ? inputUrl.trim() : '';
  if (!url) return { type: 'error', url: '', originalUrl: '', message: '' };

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

  if (url.includes('drive.google.com')) {
    let fileId = null;
    const patterns = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /id=([a-zA-Z0-9_-]+)/, /open\?id=([a-zA-Z0-9_-]+)/];
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

  return { type: 'video', id: url, url: url, originalUrl: url };
};

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'settings'>('services');
  const [urlInputs, setUrlInputs] = useState<{[key: number]: string}>({});
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const { 
    serviceItems, adminPassword,
    updateServiceItem, addServiceVideos, addServiceVideoUrl, removeServiceVideo,
    updatePassword, resetData 
  } = usePortfolio();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Compare with LocalStorage password
    if (inputPassword === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

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

  const handleDownloadBackup = () => {
    const dataStr = JSON.stringify(serviceItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-slate-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">관리자 로그인</h2>
            <p className="text-slate-500 text-sm mt-2">LocalStorage 모드</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="관리자 비밀번호"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full p-4 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 text-slate-900"
            />
            <Button fullWidth size="lg">접속하기</Button>
            <button type="button" onClick={onBack} className="w-full text-center text-sm text-slate-400 mt-2">메인으로</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-lg">관리자 모드 (Local)</h1>
          <button onClick={onBack} className="text-sm text-slate-300 flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg">
            <ArrowLeft className="w-4 h-4" /> 나가기
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex gap-4 mb-8 border-b border-slate-200">
           <button onClick={() => setActiveTab('services')} className={`pb-3 px-2 text-sm font-bold border-b-2 ${activeTab === 'services' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}>
             <Grid className="w-4 h-4 inline mr-1" /> 서비스 관리
           </button>
           <button onClick={() => setActiveTab('settings')} className={`pb-3 px-2 text-sm font-bold border-b-2 ${activeTab === 'settings' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'}`}>
             <Settings className="w-4 h-4 inline mr-1" /> 설정
           </button>
        </div>

        {activeTab === 'services' && (
          <div className="space-y-8">
            {serviceItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 font-bold">{item.title} (ID: {item.id})</div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500">제목</label>
                        <input type="text" value={item.title} onChange={(e) => updateServiceItem(item.id, 'title', e.target.value)} className="w-full p-2 border rounded font-bold" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500">설명</label>
                        <input type="text" value={item.desc} onChange={(e) => updateServiceItem(item.id, 'desc', e.target.value)} className="w-full p-2 border rounded" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500">뱃지</label>
                        <input type="text" value={item.badge} onChange={(e) => updateServiceItem(item.id, 'badge', e.target.value)} className="w-full p-2 border rounded text-red-500" placeholder="BEST, NEW..." />
                      </div>
                      
                      {/* AI Information Section */}
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-4">
                        <div className="flex items-center gap-2 mb-3">
                           <Sparkles className="w-4 h-4 text-blue-500" />
                           <span className="text-sm font-bold text-slate-700">AI 작업 가이드 (내부용)</span>
                        </div>
                        <div className="space-y-3">
                           <div>
                              <label className="text-xs font-bold text-slate-500">사용 AI 도구</label>
                              <input 
                                type="text" 
                                value={item.aiSite || ''} 
                                onChange={(e) => updateServiceItem(item.id, 'aiSite', e.target.value)} 
                                className="w-full p-2 border border-blue-200 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                                placeholder="예: Runway, Sora, Kling AI" 
                              />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-slate-500">참고 프롬프트</label>
                              <textarea 
                                value={item.aiPrompt || ''} 
                                onChange={(e) => updateServiceItem(item.id, 'aiPrompt', e.target.value)} 
                                className="w-full p-2 border border-blue-200 rounded text-sm h-24 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-xs" 
                                placeholder="작업자가 참고할 영문 프롬프트 등을 입력하세요." 
                              />
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-500">영상 목록 ({item.results.length})</label>
                      <div className="grid grid-cols-4 gap-2">
                        {item.results.map((vid, idx) => {
                          const info = getVideoEmbedInfo(vid);
                          return (
                            <div key={idx} className="aspect-square relative group bg-black rounded overflow-hidden">
                              {info.type !== 'video' ? <iframe src={info.url} className="w-full h-full" /> : <video src={info.url} className="w-full h-full object-cover" />}
                              <button onClick={() => removeServiceVideo(item.id, idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          className="flex-1 p-2 border rounded text-xs" 
                          placeholder="영상 링크 (YouTube 등)"
                          value={urlInputs[item.id] || ''}
                          onChange={(e) => setUrlInputs({...urlInputs, [item.id]: e.target.value})}
                        />
                        <button onClick={() => { if(urlInputs[item.id]) { addServiceVideoUrl(item.id, urlInputs[item.id]); setUrlInputs({...urlInputs, [item.id]: ''}); } }} className="bg-blue-600 text-white text-xs px-3 rounded">추가</button>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer border p-2 rounded justify-center hover:bg-slate-50">
                        <Upload className="w-3 h-3" /> <span className="text-xs">파일 업로드</span>
                        <input type="file" className="hidden" multiple accept="video/*" onChange={(e) => e.target.files && addServiceVideos(item.id, e.target.files)} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
               <h3 className="font-bold mb-4">비밀번호 변경</h3>
               <input type="password" value={newPw} onChange={(e)=>setNewPw(e.target.value)} placeholder="새 비밀번호" className="w-full p-2 border rounded mb-2" />
               <input type="password" value={confirmPw} onChange={(e)=>setConfirmPw(e.target.value)} placeholder="확인" className="w-full p-2 border rounded mb-4" />
               <Button onClick={handleChangePassword} fullWidth>저장</Button>
            </div>
            <div className="bg-slate-800 text-white p-6 rounded-xl">
               <h3 className="font-bold mb-4">데이터 관리</h3>
               <button onClick={handleDownloadBackup} className="w-full py-2 bg-white/10 rounded flex items-center justify-center gap-2 mb-2"><Copy className="w-4 h-4" /> 백업 다운로드</button>
               <button onClick={resetData} className="w-full py-2 bg-red-600 rounded flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" /> 초기화</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};