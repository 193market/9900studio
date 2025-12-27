import React, { useState } from 'react';
import { generateSampleScript } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, Loader2, Play, MessageCircle, ArrowRight } from 'lucide-react';

interface ScriptGeneratorProps {
  onInquiry: () => void;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ onInquiry }) => {
  const [input, setInput] = useState('');
  const [type, setType] = useState('제품 홍보');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');
    
    const script = await generateSampleScript(input, type);
    setResult(script);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-blue-100 text-blue-600">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">AI 무료 체험</span>
        </div>
        <h3 className="font-black text-2xl md:text-3xl text-slate-900 mb-2">돈 안 드는 AI 영상 기획</h3>
        <p className="text-slate-500 text-sm md:text-base">
          상품/매물의 이름을 입력하면 <span className="text-blue-600 font-bold">5초 만에</span> 판매 시나리오가 나옵니다.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="md:w-40 p-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none shadow-sm"
          >
            <option value="제품 홍보">제품 홍보</option>
            <option value="부동산 매물">부동산 매물</option>
            <option value="서비스 소개">서비스 소개</option>
          </select>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 맛있는 수제 쿠키, 강남역 오피스텔"
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading || !input}
          fullWidth
          size="lg"
          variant="secondary"
          className="flex items-center gap-2 justify-center py-4 text-lg bg-slate-800 hover:bg-slate-900"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI가 시나리오 작성 중...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              무료 시나리오 생성하기
            </>
          )}
        </Button>

        {result && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 relative text-left">
              <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-2">
                 <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">AI Result</span>
              </div>
              <div className="prose prose-sm text-slate-700 whitespace-pre-line leading-relaxed max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {result}
              </div>
            </div>
            
            <div className="mt-6 flex flex-col items-center text-center p-6 bg-yellow-50 rounded-xl border border-yellow-200">
              <p className="text-lg font-bold text-slate-900 mb-1">이 기획대로 영상을 만드시겠습니까?</p>
              <p className="text-slate-600 mb-4 text-sm">전문가가 24시간 내에 완성된 영상을 보내드립니다.</p>
              <Button 
                onClick={onInquiry}
                className="w-full md:w-auto shadow-xl shadow-yellow-400/20 flex items-center gap-2"
                size="lg"
              >
                <MessageCircle className="w-5 h-5" />
                9,900원으로 제작 신청하기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};