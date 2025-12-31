import { GoogleGenAI } from "@google/genai";

// 브라우저 환경 등에서 process가 정의되지 않았을 때를 대비한 안전한 접근
const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

// --- 시스템 프롬프트 (사이트 정보) ---
const SYSTEM_INSTRUCTION = `
당신은 '9900Studio'의 AI 전문 상담원입니다. 
방문자에게 친절하고 전문적인 태도로 응대하며, 아래 정보를 바탕으로 질문에 답변하세요.
한국어로 답변하세요.

[서비스 핵심 정보]
- 서비스명: 9900Studio (구구공공 스튜디오)
- 가격: 모든 영상 제작 단돈 9,900원 (VAT 포함)
- 제작 속도: 당일 제작 완료 (24시간 이내)
- 환불 정책: 결과물 불만족 시 100% 환불 보장
- 연락처: 010-7320-5565 / inifin@naver.com
- 위치: 서울 강서구 화곡로 129 305호

[제작 가능한 영상 종류 (서비스 메뉴)]
1. 바이럴 훅 (Viral Hook): 3초 안에 시선을 사로잡는 도입부 영상
2. 신년 스페셜: 새해 인사 및 프로모션용
3. 언박싱 (Unboxing): 제품 개봉 및 리뷰 영상
4. 구매 유도 스킷: 짧은 상황극으로 구매 욕구 자극
5. POV 시점 영상: 사용자 1인칭 시점 체험 영상
6. 데일리룩 / OOTD: 패션 스타일링 숏폼
7. ASMR: 시각/청각 자극 제품 영상
8. 코디 체인지: 음악에 맞춰 의상이 바뀌는 챌린지 영상
9. 제품 비주얼 이펙트: 화려한 효과가 들어간 고퀄리티 연출

[주문 프로세스]
1. 사이트에서 '영상 제작 신청' 또는 '스튜디오 시작하기' 버튼 클릭
2. 원하는 영상 종류 선택
3. 가지고 있는 사진/영상 자료 업로드
4. AI 대본 생성 (선택 사항)
5. 결제 및 신청 완료 (현재 테스트 결제 모드 지원)

[답변 가이드라인]
- 사용자가 영상 제작을 원하면 '주문하기' 페이지로 안내하거나 우측 상단의 버튼을 누르라고 안내하세요.
- 가격이나 퀄리티를 의심하면 "9,900원에 기획부터 편집까지 AI가 처리하여 비용을 낮췄음"을 강조하세요.
- 인사를 할 때는 "안녕하세요! 9,900원 AI 영상 제작소입니다. 무엇을 도와드릴까요?"라고 시작하세요.
- 너무 긴 답변보다는 핵심만 간결하게(3문장 이내) 답변하는 것을 선호합니다.
`;

export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      temperature: 0.7,
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });
};

export const generateSampleScript = async (productName: string, type: string): Promise<string> => {
  try {
    const prompt = `
      You are a professional video copywriter for short-form marketing videos (Reels, TikTok, Shorts).
      
      Task: Create a concise, high-converting 15-second video script for a "${type}" named "${productName}".
      
      Structure the output exactly like this:
      [Title]: catchy title
      [Scene 1]: Visual description (Audio: script line)
      [Scene 2]: Visual description (Audio: script line)
      [Scene 3]: Visual description (Audio: script line)
      [CTA]: Final call to action
      
      Tone: Professional but friendly. Korean language.
      Keep it short.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "죄송합니다. 스크립트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결 상태가 좋지 않습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateOrderScript = async (topic: string): Promise<string> => {
  try {
    const prompt = `
      You are a specialized copywriter for short-form video ads.
      Task: Create a high-impact script for "${topic}" in Korean.
      
      Constraints:
      - Total length: Around 150 Korean characters.
      - Structure: 
        1. Hook (First 3 seconds, attention grabber)
        2. Feature Description (Core benefit)
        3. Call To Action (Strong closing)
      - Format: Just the script text, separated by line breaks for each section. No "[Scene]" labels needed, just the spoken content and brief visual cues in parentheses.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "AI 스크립트 생성에 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결 상태가 좋지 않습니다.";
  }
};