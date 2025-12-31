import React from 'react';

// --- 네비게이션 메뉴 ---
export const NAV_LINKS = [
  { label: '제작사례', id: 'portfolio' },
  { label: '서비스', id: 'services' },
  { label: '가격', id: 'pricing' },
];

// --- 서비스 메뉴 초기 데이터 (관리자 수정 가능) ---
// 카테고리 구분 없이 단일 리스트로 변경
// result(string) -> results(string[]) 로 변경하여 다중 이미지 지원
export const INITIAL_SERVICE_ITEMS = [
  {
    id: 1, categoryKey: 'video', badge: "BEST",
    title: "바이럴 훅 (Viral Hook)", desc: "시청자의 시선을 3초 안에 사로잡는 강렬한 도입부 영상입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600",
      "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=600"
    ]
  },
  {
    id: 2, categoryKey: 'video', badge: "NEW",
    title: "신년 스페셜", desc: "새해 맞이 프로모션이나 인사를 위한 시즌 한정 템플릿입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1513279922550-250c2129b13a?w=600",
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600"
    ]
  },
  {
    id: 3, categoryKey: 'video', badge: "",
    title: "언박싱 (Unboxing)", desc: "제품의 포장을 뜯고 구성품을 보여주는 생동감 넘치는 리뷰 영상입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=600"
    ]
  },
  {
    id: 4, categoryKey: 'video', badge: "HOT",
    title: "구매 유도 스킷", desc: "짧은 상황극을 통해 자연스럽게 구매 욕구를 자극하는 영상입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600"
    ]
  },
  {
    id: 5, categoryKey: 'video', badge: "",
    title: "POV 시점 영상", desc: "사용자 시점에서 제품이나 공간을 체험하는 듯한 몰입감 있는 영상입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=600"
    ]
  },
  {
    id: 6, categoryKey: 'video', badge: "",
    title: "데일리룩 / OOTD", desc: "오늘의 의상 스타일링을 감각적으로 보여주는 패션 숏폼입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"
    ]
  },
  {
    id: 7, categoryKey: 'video', badge: "",
    title: "ASMR", desc: "시각적, 청각적 자극을 극대화하여 제품의 질감을 전달하는 영상입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
    ]
  },
  {
    id: 8, categoryKey: 'video', badge: "",
    title: "코디 체인지 (의상 전환)", desc: "음악에 맞춰 순식간에 의상이 바뀌는 트렌디한 챌린지 영상입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1529139574466-a302d2052574?w=600"
    ]
  },
  {
    id: 9, categoryKey: 'video', badge: "",
    title: "제품 비주얼 이펙트", desc: "화려한 시각 효과로 제품을 돋보이게 만드는 고퀄리티 연출입니다.",
    inputs: [],
    results: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    ]
  }
];

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