import { GoogleGenAI } from "@google/genai";

// API 키 직접 설정 (요청사항 반영)
const API_KEY = 'AIzaSyDbTRF-VTPya6PctBtrksXoxC5LEMQ_Sjc';

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 서비스 아이템 인터페이스 (Context 의존성 제거를 위해 내부 정의)
interface ServiceItemPartial {
  title: string;
  desc: string;
  badge?: string;
}

// --- 동적 시스템 프롬프트 생성 함수 ---
const getSystemInstruction = (services: ServiceItemPartial[]) => {
  // 서비스 목록을 텍스트로 변환
  const servicesListText = services.map((item, index) => {
    return `${index + 1}. ${item.title} ${item.badge ? `[${item.badge}]` : ''}
   - 설명: ${item.desc}`;
  }).join('\n');

  return `
당신은 '9900Studio'의 AI 전문 상담원입니다. 
방문자에게 친절하고 전문적인 태도로 응대하며, 아래 **실시간 업데이트된 서비스 정보**를 바탕으로 질문에 답변하세요.
한국어로 답변하세요.

[서비스 핵심 정보]
- 서비스명: 9900Studio (구구공공 스튜디오)
- 가격: 모든 영상 제작 단돈 9,900원 (VAT 포함)
- 제작 속도: 당일 제작 완료 (24시간 이내)
- 환불 정책: 결과물 불만족 시 100% 환불 보장
- 연락처: 010-7320-5565 / inifin@naver.com
- 위치: 서울 강서구 화곡로 129 305호

[현재 제작 가능한 영상 종류 (실시간 목록)]
${servicesListText}

[주문 프로세스]
1. 사이트에서 '영상 제작 신청' 또는 '스튜디오 시작하기' 버튼 클릭
2. 원하는 영상 종류 선택
3. 가지고 있는 사진/영상 자료 업로드
4. AI 대본 생성 (선택 사항)
5. 결제 및 신청 완료 (현재 테스트 결제 모드 지원)

[답변 가이드라인]
- 사용자가 영상 제작을 원하면 '주문하기' 페이지로 안내하거나 우측 상단의 버튼을 누르라고 안내하세요.
- 가격이나 퀄리티를 의심하면 "9,900원에 기획부터 편집까지 AI가 처리하여 비용을 낮췄음"을 강조하세요.
- 목록에 없는 서비스를 문의하면, "현재 목록에는 없지만 1:1 맞춤 제작 문의를 통해 가능합니다"라고 안내하세요.
- 인사를 할 때는 "안녕하세요! 9,900원 AI 영상 제작소입니다. 무엇을 도와드릴까요?"라고 시작하세요.
- 답변은 3문장 이내로 간결하게 작성하세요.
`;
};

export const createChatSession = (services: ServiceItemPartial[]) => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      temperature: 0.7,
      systemInstruction: getSystemInstruction(services),
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