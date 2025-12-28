import React from 'react';

// --- 네비게이션 메뉴 ---
export const NAV_LINKS = [
  { label: '제작사례', id: 'portfolio' },
  { label: '서비스', id: 'services' },
  { label: '가격', id: 'pricing' },
];

// --- 서비스 메뉴 초기 데이터 (관리자 수정 가능) ---
export const INITIAL_SERVICE_ITEMS = [
  // 1. 패션 / 의류 / 잡화
  {
    id: 101, categoryKey: 'fashion', badge: "BEST",
    title: "패션 매거진 화보", desc: "트렌디한 패션 잡지 화보 컷을 연출합니다.",
    inputs: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150", "https://images.unsplash.com/photo-1529139574466-a302d2052574?w=150"],
    result: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600"
  },
  {
    id: 102, categoryKey: 'fashion', badge: "",
    title: "패션 매거진 표지", desc: "시즌 트렌드를 반영한 감각적인 잡지 표지를 디자인합니다.",
    inputs: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"],
    result: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600"
  },
  {
    id: 103, categoryKey: 'fashion', badge: "",
    title: "티셔츠 그래픽 프린트", desc: "의류에 들어갈 그래픽 아트를 디자인합니다.",
    inputs: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150", "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=150", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150"],
    result: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600"
  },
  {
    id: 104, categoryKey: 'fashion', badge: "",
    title: "원단 패턴 디자인", desc: "의류 제작을 위한 텍스타일 패턴을 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=150", "https://images.unsplash.com/photo-1543486978-8d41c21061aa?w=150", "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150"],
    result: "https://images.unsplash.com/photo-1523380744952-b7e00e6e2ffa?w=600"
  },
  {
    id: 105, categoryKey: 'fashion', badge: "HOT",
    title: "가상 모델 피팅 (룩북)", desc: "의상을 착용한 모델의 화보를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150", "https://images.unsplash.com/photo-1509631179647-b849389774ba?w=150", "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=150"],
    result: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600"
  },
  {
    id: 106, categoryKey: 'fashion', badge: "",
    title: "패션 무드보드", desc: "의류 컬렉션 기획을 위한 색감 및 소재 무드보드를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=150", "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=150", "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150"],
    result: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600"
  },
  {
    id: 107, categoryKey: 'fashion', badge: "",
    title: "잡화/액세서리 목업", desc: "가방, 신발, 모자 등의 디자인 시안을 확인합니다.",
    inputs: ["https://images.unsplash.com/photo-1591561954557-26941169b49e?w=150", "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=150", "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=150"],
    result: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=600"
  },
  {
    id: 108, categoryKey: 'fashion', badge: "",
    title: "주얼리 렌더링", desc: "반지, 목걸이 등 주얼리 디자인을 시각화합니다.",
    inputs: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=150", "https://images.unsplash.com/photo-1605100804763-eb2fc645a456?w=150", "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=150"],
    result: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600"
  },
  {
    id: 109, categoryKey: 'fashion', badge: "",
    title: "스니커즈/신발 디자인", desc: "새로운 스타일의 신발 컨셉 아트를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150", "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=150", "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=150"],
    result: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600"
  },
  {
    id: 110, categoryKey: 'fashion', badge: "",
    title: "패션쇼 런웨이 무대", desc: "패션쇼 무대 디자인이나 쇼 분위기를 시각화합니다.",
    inputs: ["https://images.unsplash.com/photo-1509631179647-b849389774ba?w=150", "https://images.unsplash.com/photo-1537832816519-0439447f0d53?w=150", "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=150"],
    result: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600"
  },

  // 2. F&B / 요식업
  {
    id: 201, categoryKey: 'food', badge: "BEST",
    title: "시그니처 메뉴 연출샷", desc: "메뉴판용 고해상도 음식 사진을 촬영합니다.",
    inputs: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=150", "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=150", "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=150"],
    result: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
  },
  {
    id: 202, categoryKey: 'food', badge: "",
    title: "시그니처 메뉴 소개 인포그래픽", desc: "대표 메뉴의 재료와 맛 특징을 설명하는 소개 이미지를 만듭니다.",
    inputs: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150", "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=150", "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=150"],
    result: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600"
  },
  {
    id: 203, categoryKey: 'food', badge: "",
    title: "카페 입간판/칠판 디자인", desc: "손글씨 느낌의 카페 메뉴판을 디자인합니다.",
    inputs: ["https://images.unsplash.com/photo-1511920170033-f8396924c348?w=150", "https://images.unsplash.com/photo-1463797221720-6b07e6426c24?w=150", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150"],
    result: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600"
  },
  {
    id: 204, categoryKey: 'food', badge: "",
    title: "시즌 한정 프로모션 배너", desc: "이벤트 홍보용 배너 이미지를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1501854140884-074cf2b2c3af?w=150", "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=150", "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=150"],
    result: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600"
  },
  {
    id: 205, categoryKey: 'food', badge: "",
    title: "푸드트럭/키오스크 디자인", desc: "매장 외관이나 푸드트럭 디자인 컨셉을 확인합니다.",
    inputs: ["https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=150", "https://images.unsplash.com/photo-1567129937968-cdad8f07e2f8?w=150", "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=150"],
    result: "https://images.unsplash.com/photo-1552084718-453678096df3?w=600"
  },
  {
    id: 206, categoryKey: 'food', badge: "",
    title: "식재료 패턴/배경", desc: "신선한 재료들이 배치된 배경 이미지를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=150", "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=150", "https://images.unsplash.com/photo-1579113800032-c38bd1d994ff?w=150"],
    result: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600"
  },
  {
    id: 207, categoryKey: 'food', badge: "",
    title: "식당/카페 로고 아이디어", desc: "매장의 아이덴티티를 나타내는 로고 심볼을 만듭니다.",
    inputs: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?w=150", "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=150", "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=150"],
    result: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600"
  },

  // 3. 이커머스 / 온라인 셀러
  {
    id: 301, categoryKey: 'ecommerce', badge: "HOT",
    title: "쇼핑몰 상품 누끼/배치", desc: "흰 배경에 깔끔하게 정돈된 상품 이미지를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=150"],
    result: "https://images.unsplash.com/photo-1531297461136-82lw9z1s1z1a?w=600"
  },
  {
    id: 302, categoryKey: 'ecommerce', badge: "",
    title: "기획전 메인 배너", desc: "쇼핑몰 메인에 걸릴 시선을 끄는 배너 이미지를 만듭니다.",
    inputs: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150", "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150", "https://images.unsplash.com/photo-1472851294608-41531268f719?w=150"],
    result: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
  },
  {
    id: 303, categoryKey: 'ecommerce', badge: "BEST",
    title: "제품 상세 페이지 (종합)", desc: "상품의 매력을 극대화하는 상세 페이지 레이아웃을 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150", "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=150", "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150"],
    result: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
  },
  {
    id: 304, categoryKey: 'ecommerce', badge: "",
    title: "패키지 박스 디자인", desc: "배송 박스나 제품 패키징 디자인을 시각화합니다.",
    inputs: ["https://images.unsplash.com/photo-1603201667141-5a2d4c673378?w=150", "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150", "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=150"],
    result: "https://images.unsplash.com/photo-1532153354457-5fbe1a3bb0b4?w=600"
  },
  {
    id: 305, categoryKey: 'ecommerce', badge: "",
    title: "배송/물류 일러스트", desc: "빠른 배송을 강조하는 귀여운 일러스트를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150", "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=150", "https://images.unsplash.com/photo-1494412574643-35d3d1706f28?w=150"],
    result: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=600"
  },
  {
    id: 306, categoryKey: 'ecommerce', badge: "",
    title: "리뷰 이벤트 배너", desc: "고객 리뷰 작성을 유도하는 배너 이미지를 디자인합니다.",
    inputs: ["https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=150", "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150", "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150"],
    result: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?w=600"
  },

  // 4. 인테리어 / 부동산 중개인
  {
    id: 401, categoryKey: 'interior', badge: "",
    title: "시간대 및 날씨 변환", desc: "흐린 날이나 밤 사진을 화창한 낮이나 노을 진 저녁으로 변경합니다.",
    inputs: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150", "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=150", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150"],
    result: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600"
  },
  {
    id: 402, categoryKey: 'interior', badge: "",
    title: "부동산 안내판 생성", desc: "이미지 내의 텍스트를 수정하거나 새로운 안내판을 합성합니다.",
    inputs: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=150", "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=150", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150"],
    result: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
  },
  {
    id: 403, categoryKey: 'interior', badge: "",
    title: "3D 평면도/조감도 변환", desc: "2D 도면을 이해하기 쉬운 3D 아이소메트릭 뷰로 변환합니다.",
    inputs: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150", "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=150", "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=150"],
    result: "https://images.unsplash.com/photo-1505578788390-50d4816c4c0b?w=600"
  },
  {
    id: 404, categoryKey: 'interior', badge: "",
    title: "드론 뷰/주변 합성", desc: "건물 주변에 녹지나 환경이 조성된 항공 샷을 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=150", "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=150", "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=150"],
    result: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600"
  },
  {
    id: 405, categoryKey: 'interior', badge: "BEST",
    title: "가상 홈 스테이징", desc: "빈 공간을 원하는 스타일의 가구로 채웁니다.",
    inputs: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150", "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=150", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=150"],
    result: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600"
  },
  {
    id: 406, categoryKey: 'interior', badge: "",
    title: "건물 외관 리모델링", desc: "건물 외관 디자인 시안을 미리 확인합니다.",
    inputs: ["https://images.unsplash.com/photo-1460317442991-0ec209397118?w=150", "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=150", "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=150"],
    result: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600"
  },
  {
    id: 407, categoryKey: 'interior', badge: "",
    title: "무드보드(재질/색감)", desc: "인테리어 컨셉 보드를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150", "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=150", "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?w=150"],
    result: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=600"
  },
  {
    id: 408, categoryKey: 'interior', badge: "",
    title: "벽지/패브릭 패턴", desc: "인테리어에 사용할 벽지나 커튼의 패턴을 디자인합니다.",
    inputs: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=150", "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=150", "https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=150"],
    result: "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600"
  },
  {
    id: 409, categoryKey: 'interior', badge: "",
    title: "주방/키친 디자인", desc: "최신 트렌드의 주방 인테리어를 시각화합니다.",
    inputs: ["https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=150", "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=150", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150"],
    result: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=600"
  },
  {
    id: 410, categoryKey: 'interior', badge: "",
    title: "조경/정원 디자인", desc: "건물 주변의 조경이나 정원 디자인을 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1558904541-efa843a96f01?w=150", "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=150", "https://images.unsplash.com/photo-1598902108854-10e335adac99?w=150"],
    result: "https://images.unsplash.com/photo-1558293842-c0fd3db86157?w=600"
  },

  // 5. 콘텐츠 크리에이터
  {
    id: 501, categoryKey: 'creator', badge: "HOT",
    title: "유튜브 썸네일 자동화", desc: "텍스트가 포함된 고퀄리티 썸네일을 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150", "https://images.unsplash.com/photo-1526498460520-4c294f266870?w=150", "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=150"],
    result: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600"
  },
  {
    id: 502, categoryKey: 'creator', badge: "",
    title: "플레이리스트 썸네일 (텍스트 심도)", desc: "피사체 뒤에 PLAY LIST 텍스트가 배치됨 감성 썸네일을 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=150", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150", "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150"],
    result: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=600"
  },
  {
    id: 503, categoryKey: 'creator', badge: "",
    title: "가상 부캐(Avatar) 생성", desc: "일관성 있는 3D 캐릭터 시트를 디자인합니다.",
    inputs: ["https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150", "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150"],
    result: "https://images.unsplash.com/photo-1626025437642-0b05076ca301?w=600"
  },
  {
    id: 504, categoryKey: 'creator', badge: "",
    title: "방송용 오버레이/프레임", desc: "게임 방송이나 캠 화면에 씌울 오버레이를 디자인합니다.",
    inputs: ["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150", "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=150", "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150"],
    result: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600"
  },
  {
    id: 505, categoryKey: 'creator', badge: "",
    title: "채널 아트/배너", desc: "유튜브/트위치 채널 상단 배너 이미지를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150", "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=150", "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=150"],
    result: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600"
  },
  {
    id: 506, categoryKey: 'creator', badge: "",
    title: "밈(Meme) 템플릿 생성", desc: "유머러스한 상황의 짤방 이미지를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150", "https://images.unsplash.com/photo-1545996124-0501eb296251?w=150", "https://images.unsplash.com/photo-1488161628813-9942522814a1?w=150"],
    result: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=600"
  },

  // 6. 사진/영상/음향
  {
    id: 601, categoryKey: 'media', badge: "BEST",
    title: "고화질 스톡 포토 생성", desc: "상업적으로 사용할 수 있는 고해상도 스톡 이미지를 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150", "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=150", "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=150"],
    result: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600"
  },
  {
    id: 602, categoryKey: 'media', badge: "",
    title: "영상용 시네마틱 배경", desc: "크로마키 합성을 위한 영상 배경 소스를 만듭니다.",
    inputs: ["https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150", "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=150", "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=150"],
    result: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600"
  },
  {
    id: 603, categoryKey: 'media', badge: "",
    title: "영상 스토리보드 (콘티)", desc: "영상 기획 단계에서 샷 구성을 위한 스토리보드 컷을 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=150", "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=150", "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=150"],
    result: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=600"
  },
  {
    id: 604, categoryKey: 'media', badge: "",
    title: "이중 노출(Double Exposure)", desc: "두 이미지가 예술적으로 겹쳐진 이중 노출 사진을 만듭니다.",
    inputs: ["https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=150", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150", "https://images.unsplash.com/photo-1544352427-0f505668d6c1?w=150"],
    result: "https://images.unsplash.com/photo-1532517891316-72a08e5c03a7?w=600"
  },
  {
    id: 605, categoryKey: 'media', badge: "",
    title: "매크로(접사) 사진", desc: "작은 물체를 아주 크게 확대한 디테일한 사진을 생성합니다.",
    inputs: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=150", "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=150"],
    result: "https://images.unsplash.com/photo-1470114716159-e389f87b96ce?w=600"
  },
  {
    id: 606, categoryKey: 'media', badge: "",
    title: "팟캐스트/앨범 커버", desc: "오디오 콘텐츠를 위한 분위기 있는 커버 아트를 디자인합니다.",
    inputs: ["https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=150", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150", "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150"],
    result: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=600"
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