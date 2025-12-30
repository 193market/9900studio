import React, { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { Button } from './Button';
import { Lock, Upload, ArrowLeft, Image as ImageIcon, Film, Settings, RotateCcw, Save, Grid } from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'services' | 'settings'>('services');
  
  // 비밀번호 변경용 State
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const { 
    serviceItems, adminPassword, 
    updateServiceItem, updateServiceImage,
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">서비스 메뉴 수정</h2>
                <p className="text-sm text-slate-500 bg-white px-3 py-1 rounded border border-slate-200 shadow-sm">
                    카테고리별 서비스 목록
                </p>
            </div>

            <div className="space-y-8">
              {serviceItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">
                        <span className="text-slate-400 mr-2">[{item.categoryKey}]</span>
                        {item.title}
                    </h3>
                  </div>
                  
                  <div className="p-6 grid md:grid-cols-2 gap-8">
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
                        <label className="block text-xs font-bold text-slate-500 mb-1">뱃지 (BEST, HOT 등)</label>
                        <input 
                          type="text" 
                          value={item.badge}
                          onChange={(e) => updateServiceItem(item.id, 'badge', e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded focus:border-blue-500 outline-none text-red-500 transition-colors"
                          placeholder="비워두면 표시 안됨"
                        />
                      </div>
                    </div>

                    {/* 이미지 업로드 영역 (서비스) */}
                    <div className="space-y-6">
                        {/* Input Images */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" /> 입력 사진 (Before) - 3장
                            </label>
                            <div className="flex gap-2">
                                {item.inputs.map((imgUrl, idx) => (
                                    <div key={idx} className="relative w-20 h-20 group">
                                        <img src={imgUrl} className="w-full h-full object-cover rounded-lg border border-slate-200 bg-slate-50" alt={`input-${idx}`} />
                                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                                            <Upload className="w-5 h-5 text-white" />
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if(e.target.files?.[0]) updateServiceImage(item.id, 'input', idx, e.target.files[0]);
                                                }}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Result Image */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                                <Film className="w-3 h-3" /> 결과물 썸네일 (After)
                            </label>
                            <div className="relative w-full aspect-video group">
                                <img src={item.result} className="w-full h-full object-cover rounded-lg border border-slate-200 bg-slate-50" alt="result" />
                                 <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                                    <div className="text-white flex flex-col items-center">
                                        <Upload className="w-8 h-8 mb-1" />
                                        <span className="text-xs font-bold">결과물 변경</span>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if(e.target.files?.[0]) updateServiceImage(item.id, 'result', null, e.target.files[0]);
                                        }}
                                    />
                                </label>
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
                  모든 포트폴리오/서비스 데이터와 비밀번호를 초기 상태로 되돌립니다.
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