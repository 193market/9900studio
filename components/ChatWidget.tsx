import React, { useState, useEffect, useRef } from 'react';
import { createChatSession } from '../services/geminiService';
import { usePortfolio } from '../contexts/PortfolioContext'; // 포트폴리오 데이터 가져오기
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from './Button';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '안녕하세요! 9,900원 AI 영상 제작소입니다. 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 전역 상태에서 최신 서비스 목록 가져오기
  const { serviceItems } = usePortfolio();

  // 채팅 세션 초기화 (serviceItems가 변경되면 세션도 업데이트된 정보로 다시 생성)
  useEffect(() => {
    // 채팅 세션을 최신 데이터로 생성
    chatSessionRef.current = createChatSession(serviceItems);
    
    // 만약 채팅창이 열려있고 대화 내역이 있다면, 
    // 문맥 유지를 위해 시스템 프롬프트만 몰래 업데이트하는 것이 좋지만,
    // Gemini SDK 구조상 새 세션을 만드는 것이 가장 확실함.
    // 사용자가 느끼기에 끊김이 없도록 ref만 교체.
  }, [serviceItems]);

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession(serviceItems);
      }
      
      const result = await chatSessionRef.current.sendMessage({ message: userMsg });
      const responseText = result.text;

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-[100] bottom-6 right-4 md:bottom-10 md:right-10 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[340px] md:w-[380px] h-[500px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-10 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI 상담원</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  실시간 서비스 정보 연동됨
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 shrink-0">
                     <Bot className="w-4 h-4 text-slate-600" />
                  </div>
                )}
                <div 
                  className={`max-w-[80%] p-3 text-sm leading-relaxed rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-yellow-400 text-slate-900 rounded-tr-none font-medium' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 shrink-0">
                     <Bot className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="궁금한 점을 물어보세요..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <Button size="sm" type="submit" disabled={isLoading || !input.trim()} className="px-3">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 md:w-16 md:h-16 bg-[#FEE500] rounded-full shadow-2xl shadow-black/20 hover:scale-110 transition-transform duration-200 flex items-center justify-center relative group border-2 border-white/20 z-50"
      >
        {isOpen ? (
          <X className="w-7 h-7 md:w-8 md:h-8 text-slate-900" />
        ) : (
          <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-[#391B1B] fill-[#391B1B]" />
        )}
        
        {/* Tooltip (Only when closed) */}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI 상담원 연결
          </span>
        )}
        
        {/* Notification Badge (Only when closed) */}
        {!isOpen && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#FEE500] flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          </span>
        )}
      </button>

    </div>
  );
};