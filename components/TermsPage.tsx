import React from 'react';
import { Button } from './Button';
import { ChevronLeft } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
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

        <h1 className="text-3xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-200">이용약관</h1>

        <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-8">
          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제1조 (목적)</h3>
            <p>
              본 약관은 193market(이하 "회사"라 함)이 운영하는 웹사이트 및 제반 서비스(이하 "서비스"라 함)의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제2조 (정의)</h3>
            <ol className="list-decimal pl-4 space-y-1">
              <li>"서비스"란 회사가 제공하는 AI 영상 제작 및 관련 제반 서비스를 의미합니다.</li>
              <li>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제3조 (약관의 명시와 개정)</h3>
            <p>
              회사는 이 약관의 내용과 상호, 영업소 소재지, 대표자의 성명, 사업자등록번호, 연락처 등을 이용자가 알 수 있도록 초기 서비스 화면에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제4조 (서비스의 제공 및 변경)</h3>
            <p>
              회사는 다음과 같은 업무를 수행합니다.
            </p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>AI 영상 제작 및 편집 서비스</li>
              <li>디지털 콘텐츠 디자인 및 제공</li>
              <li>기타 회사가 정하는 업무</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제5조 (서비스 중단)</h3>
            <p>
              회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제6조 (회원가입)</h3>
            <p>
              이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제7조 (개인정보보호)</h3>
            <p>
              회사는 이용자의 정보수집 시 구매계약 이행에 필요한 최소한의 정보를 수집합니다. 회사는 이용자의 개인정보를 보호하기 위해 노력하며, 자세한 내용은 '개인정보처리방침'을 따릅니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제8조 (저작권의 귀속 및 이용제한)</h3>
            <p>
              회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다. 이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다. 단, 회원이 정당한 대가를 지불하고 제작된 최종 결과물(영상 등)에 대한 사용권은 별도 계약에 따릅니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-900 mb-2">제9조 (분쟁해결)</h3>
            <p>
              회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치, 운영합니다.
            </p>
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