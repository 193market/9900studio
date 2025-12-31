import React from 'react';

// --- 네비게이션 메뉴 ---
export const NAV_LINKS = [
  { label: '제작사례', id: 'portfolio' },
  { label: '서비스', id: 'services' },
  { label: '가격', id: 'pricing' },
];

// --- 서비스 메뉴 초기 데이터 (관리자 수정 가능) ---
// 결과물(results)을 비디오 URL로 변경
// 작업 가이드(aiSite, aiPrompt) 필드 추가
export const INITIAL_SERVICE_ITEMS = [
  {
    id: 1, categoryKey: 'video', badge: "BEST",
    title: "바이럴 훅 (Viral Hook)", desc: "시청자의 시선을 3초 안에 사로잡는 강렬한 도입부 영상입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-street-food-in-seoul-4516/1080p.mp4",
      "https://cdn.coverr.co/videos/coverr-making-coffee-at-home-5095/1080p.mp4"
    ],
    aiSite: "Runway Gen-2",
    aiPrompt: "Cinematic close-up shot of street food cooking, steam rising, vibrant colors, 4k, high detail"
  },
  {
    id: 2, categoryKey: 'video', badge: "NEW",
    title: "신년 스페셜 (New Year)", desc: "새해 맞이 프로모션이나 인사를 위한 시즌 한정 템플릿입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-fireworks-in-the-sky-5238/1080p.mp4"
    ],
    aiSite: "Luma Dream Machine",
    aiPrompt: "Colorful fireworks exploding in the night sky, city skyline in background, festive atmosphere"
  },
  {
    id: 3, categoryKey: 'video', badge: "",
    title: "언박싱 (Unboxing)", desc: "제품의 포장을 뜯고 구성품을 보여주는 생동감 넘치는 리뷰 영상입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-opening-a-gift-box-5368/1080p.mp4"
    ],
    aiSite: "Sora (OpenAI)",
    aiPrompt: "POV shot of hands opening a luxury gift box, excitement, smooth camera movement"
  },
  {
    id: 4, categoryKey: 'video', badge: "HOT",
    title: "구매 유도 스킷 (Sales Skit)", desc: "짧은 상황극을 통해 자연스럽게 구매 욕구를 자극하는 영상입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-online-shopping-with-card-5645/1080p.mp4"
    ],
    aiSite: "Runway Gen-3 Alpha",
    aiPrompt: "A person happily using a credit card on a laptop, bright lighting, commercial style"
  },
  {
    id: 5, categoryKey: 'video', badge: "",
    title: "POV 시점 (First Person View)", desc: "사용자 시점에서 제품이나 공간을 체험하는 듯한 몰입감 있는 영상입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-walking-in-a-supermarket-4296/1080p.mp4"
    ],
    aiSite: "Kling AI",
    aiPrompt: "First person view walking through a modern supermarket aisle, stabilized camera"
  },
  {
    id: 6, categoryKey: 'video', badge: "",
    title: "데일리룩 (OOTD)", desc: "오늘의 의상 스타일링을 감각적으로 보여주는 패션 숏폼입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-model-posing-in-studio-5847/1080p.mp4"
    ],
    aiSite: "Midjourney v6 + Runway",
    aiPrompt: "Fashion model posing in a studio, trendy outfit, soft lighting, 85mm lens"
  },
  {
    id: 7, categoryKey: 'video', badge: "",
    title: "ASMR (Sensory)", desc: "시각적, 청각적 자극을 극대화하여 제품의 질감을 전달하는 영상입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-pouring-milk-into-coffee-5101/1080p.mp4"
    ],
    aiSite: "Runway Gen-2",
    aiPrompt: "Slow motion pouring milk into coffee, swirling textures, macro shot, warm tone"
  },
  {
    id: 8, categoryKey: 'video', badge: "",
    title: "코디 체인지 (Outfit Swap)", desc: "음악에 맞춰 순식간에 의상이 바뀌는 트렌디한 챌린지 영상입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-woman-trying-on-clothes-5852/1080p.mp4"
    ],
    aiSite: "Viggle AI",
    aiPrompt: "Woman transforming outfits instantly, dance moves, tiktok trend style"
  },
  {
    id: 9, categoryKey: 'video', badge: "",
    title: "비주얼 이펙트 (Visual FX)", desc: "화려한 시각 효과로 제품을 돋보이게 만드는 고퀄리티 연출입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-neon-lights-in-city-4521/1080p.mp4"
    ],
    aiSite: "Leonardo.ai Motion",
    aiPrompt: "Cyberpunk product showcase, neon lights reflecting, futuristic vibes, cinematic lighting"
  },
  {
    id: 10, categoryKey: 'video', badge: "NEW",
    title: "헬스 데이터 (Fitness Data)", desc: "운동 기록과 신체 변화를 다이내믹한 인포그래픽으로 시각화합니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-man-running-on-the-road-5447/1080p.mp4"
    ],
    aiSite: "After Effects + AI Plugins",
    aiPrompt: "Futuristic HUD interface overlay, fitness statistics, heart rate monitor, neon lines, running motion tracking"
  },
  {
    id: 11, categoryKey: 'video', badge: "HOT",
    title: "트렌딩 코믹 (Comedy Meme)", desc: "최신 밈(Meme)과 유머 코드를 섞어 공유를 부르는 바이럴 영상입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-friends-laughing-together-5388/1080p.mp4"
    ],
    aiSite: "Viggle AI / D-ID",
    aiPrompt: "Funny character dancing in an unexpected location, exaggerated expressions, comic book style effects"
  },
  {
    id: 12, categoryKey: 'video', badge: "SALE",
    title: "사이버 먼데이 (Cyber Monday)", desc: "디지털 기기 및 IT 제품 파격 할인을 위한 사이버펑크 스타일 영상입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-typing-on-a-keyboard-with-neon-lights-4519/1080p.mp4"
    ],
    aiSite: "Kling AI",
    aiPrompt: "Cyber Monday sale text 3D render, neon blue and purple, glitch effect, high tech product showcase background"
  },
  {
    id: 13, categoryKey: 'video', badge: "EVENT",
    title: "크리스마스 (Christmas)", desc: "따뜻한 연말 감성으로 브랜드 이미지를 높이는 시즌 무비입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-decorating-a-christmas-tree-5345/1080p.mp4"
    ],
    aiSite: "Midjourney v6 + Runway",
    aiPrompt: "Cozy christmas atmosphere, snow falling outside window, fireplace, gifts under tree, cinematic warm lighting"
  },
  {
    id: 14, categoryKey: 'video', badge: "SALE",
    title: "블랙 프라이데이 (Black Friday)", desc: "1년 중 가장 강력한 세일 기간, 긴박감을 주는 타이포그래피 모션입니다.",
    inputs: [],
    results: [
      "https://cdn.coverr.co/videos/coverr-woman-holding-shopping-bags-5481/1080p.mp4"
    ],
    aiSite: "Leonardo.ai Motion",
    aiPrompt: "Black Friday bold typography, red and black theme, fast cuts, shopping bags, excitement, motion graphics"
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