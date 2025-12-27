import React, { useState } from 'react';
import { Button } from './Button';
import { X, Mail, Lock, ArrowRight, MessageCircle, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // 폼 상태 관리 (이름 필드 제거)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(provider);
    
    // 소셜 로그인 시뮬레이션
    setTimeout(() => {
      setIsLoading(null);
      const fakeUserName = provider === '카카오' ? '김카카오' : '이네이버';
      onLoginSuccess(fakeUserName);
      onClose();
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading('email');

    // 이메일 로그인 시뮬레이션
    setTimeout(() => {
      setIsLoading(null);
      
      // 회원가입이 없으므로 이메일 아이디 부분을 이름으로 사용
      const userName = formData.email.split('@')[0] || '고객';

      onLoginSuccess(userName);
      onClose();
      
      // 폼 초기화
      setFormData({ email: '', password: '' });
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Image/Gradient */}
        <div className="h-32 bg-slate-900 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 text-center">
                <h3 className="text-2xl font-black text-white tracking-tight">AI VOCAL<span className="text-yellow-400"> FX</span></h3>
                <p className="text-slate-400 text-sm mt-1">
                    돌아오신 것을 환영합니다!
                </p>
            </div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                type="button"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        {/* Form Section */}
        <div className="p-8">
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <button 
                    type="button"
                    onClick={() => handleSocialLogin('카카오')}
                    disabled={!!isLoading}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#FEE500] hover:bg-[#FDD835] disabled:opacity-70 disabled:cursor-wait text-slate-900 rounded-lg font-medium text-sm transition-colors relative"
                >
                    {isLoading === '카카오' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <MessageCircle className="w-4 h-4 fill-slate-900" />
                            <span className="font-bold">카카오로</span> 시작하기
                        </>
                    )}
                </button>
                <button 
                    type="button"
                    onClick={() => handleSocialLogin('네이버')}
                    disabled={!!isLoading}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-[#03C75A] hover:bg-[#02b351] disabled:opacity-70 disabled:cursor-wait text-white rounded-lg font-medium text-sm transition-colors"
                >
                    {isLoading === '네이버' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <span className="font-black text-lg leading-none">N</span>
                            <span className="font-bold">네이버로</span> 시작하기
                        </>
                    )}
                </button>
            </div>

            <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">또는 이메일로 로그인</span>
                </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">이메일</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 ml-1">비밀번호</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                <Button fullWidth size="lg" className="mt-6" disabled={!!isLoading}>
                    {isLoading === 'email' ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                        <>
                            로그인하기
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </form>
        </div>
      </div>
    </div>
  );
};