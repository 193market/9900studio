import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 mb-8 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          메인으로 돌아가기
        </button>

        <h1 className="text-3xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-200">개인정보처리방침</h1>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-8">
          <p className="font-bold">
            193market(이하 '회사')은(는) 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.
          </p>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. 개인정보의 처리 목적</h3>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>회원 가입 및 관리</li>
              <li>재화 또는 서비스 제공 (영상 제작, 콘텐츠 제공, 요금 결제 등)</li>
              <li>마케팅 및 광고에의 활용</li>
              <li>고충 처리 및 서비스 개선</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. 개인정보의 처리 및 보유 기간</h3>
            <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유, 이용기간 내에서 개인정보를 처리, 보유합니다.</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. 정보주체와 법정대리인의 권리·의무 및 그 행사방법</h3>
            <p>이용자는 회사에 대해 언제든지 개인정보 열람, 정정, 삭제, 처리정지 요구 등의 권리를 행사할 수 있습니다.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">4. 처리하는 개인정보의 항목 작성</h3>
            <p>회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>필수항목: 이메일, 휴대전화번호, 결제기록</li>
              <li>선택항목: 제작 영상 관련 자료, 업종 정보</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">5. 개인정보의 파기</h3>
            <p>회사는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다.</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">6. 개인정보 보호책임자</h3>
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <div className="bg-slate-50 p-4 rounded-lg mt-2 border border-slate-200">
              <p><span className="font-bold">성명:</span> 이성열</p>
              <p><span className="font-bold">직책:</span> 대표</p>
              <p><span className="font-bold">소속:</span> 193market</p>
              <p><span className="font-bold">연락처:</span> 010-7320-5565</p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">7. 개인정보 처리방침 변경</h3>
            <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
          </section>

          <div className="pt-8 border-t border-slate-200 text-xs text-slate-500">
            <p>공고일자: 2025년 1월 1일</p>
            <p>시행일자: 2025년 1월 1일</p>
          </div>
        </div>
      </div>
    </div>
  );
};