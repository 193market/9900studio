import React from 'react';
import { LayoutTemplate, TrendingUp, MonitorPlay } from 'lucide-react';

// --- 네비게이션 메뉴 ---
export const NAV_LINKS = [
  { label: '제작사례', id: 'portfolio' },
  { label: '서비스', id: 'services' },
  { label: '가격', id: 'pricing' },
];

// --- 포트폴리오 데이터 (여기서 이미지와 텍스트를 수정하세요) ---
export const PORTFOLIO_ITEMS = [
  {
    id: 1,
    category: "부동산/매물",
    title: "강남역 오피스텔 분양",
    desc: "사진 5장 → 30초 브리핑 영상",
    // 고객이 보낸 사진들 (입력)
    inputs: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=150&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=150&q=80",
      "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=150&q=80"
    ],
    // 완성된 영상 썸네일 (결과)
    result: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80",
    tag: "공인중개사 인기"
  },
  {
    id: 2,
    category: "제품/커머스",
    title: "수제 유기농 쿠키",
    desc: "상세페이지 누끼컷 → 광고 숏폼",
    // 고객이 보낸 사진들
    inputs: [
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=150&q=80",
      "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=150&q=80",
      "https://images.unsplash.com/photo-1499636138143-bd649043ea52?w=150&q=80"
    ],
    // 완성된 영상 썸네일
    result: "https://images.unsplash.com/photo-1557089706-68d02dbda277?w=600&q=80",
    tag: "매출 200% 상승"
  },
  {
    id: 3,
    category: "퍼스널 브랜딩",
    title: "헬스트레이너 프로필",
    desc: "프로필 사진 1장 → AI 인터뷰",
    // 고객이 보낸 사진들
    inputs: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&q=80",
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=150&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80"
    ],
    // 완성된 영상 썸네일
    result: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&q=80",
    tag: "문의 폭주"
  }
];

// --- 타겟 고객 및 서비스 소개 ---
export const TARGETS = [
  {
    title: "쇼핑몰 셀러",
    desc: "상세페이지에 영상 하나 넣었을 뿐인데, 구매 전환율이 달라집니다.",
    action: "제품 영상 만들기"
  },
  {
    title: "부동산 공인중개사",
    desc: "매번 현장 촬영 힘드셨죠? 사진만 보내주시면 브리핑 영상이 나옵니다.",
    action: "매물 영상 만들기"
  },
  {
    title: "자영업/브랜드",
    desc: "전단지보다 강력한 우리 매장 홍보 영상, 인스타/틱톡에 바로 올리세요.",
    action: "홍보 영상 만들기"
  }
];