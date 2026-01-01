import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI Client
// process.env.API_KEY must be set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateText = async () => {
  return "AI 기능이 활성화되었습니다.";
};

// Generate a short video script based on product name and type
export const generateSampleScript = async (productName: string, type: string): Promise<string> => {
  try {
    const prompt = `
      제품명: ${productName}
      영상 종류: ${type}
      
      위 정보를 바탕으로 15초 숏폼 영상 시나리오를 작성해주세요.
      다음 3단계 구성을 따라주세요:
      1. Scene 1 (0-3초): 시선을 사로잡는 후킹
      2. Scene 2 (3-10초): 제품의 핵심 특징과 사용 모습
      3. Scene 3 (10-15초): 브랜드 강조 및 마무리
      
      각 씬마다 [화면 설명]과 [내레이션/자막]을 명확히 구분해서 한국어로 작성해주세요.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7,
        // Removed maxOutputTokens to avoid token limits with thinking models and follow guidelines
      }
    });

    return response.text || "시나리오를 생성할 수 없습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error (generateSampleScript):", error);
    return "죄송합니다. AI 서비스 연결에 실패했습니다. (API Key 확인 필요)";
  }
};

// Generate a structural plan for the order workflow
export const generateOrderScript = async (topic: string): Promise<string> => {
  try {
    const prompt = `
      주제: ${topic}
      
      이 주제로 제작할 30초 내외의 바이럴 광고 영상 기획안을 작성해주세요.
      다음 항목을 포함해야 합니다:
      1. 타겟 오디언스
      2. 핵심 메시지 (Key Message)
      3. 구성안 (도입 - 전개 - 결말)
      
      간결하고 명확한 문체로 한국어로 작성해주세요.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.7,
        // Removed maxOutputTokens to avoid token limits with thinking models and follow guidelines
      }
    });

    return response.text || "기획안을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error (generateOrderScript):", error);
    return "AI 서비스 연결에 실패했습니다. 잠시 후 다시 시도해주세요.";
  }
};

// Create a chat session with portfolio context
export const createChatSession = (services: any[]) => {
  // Construct context from service items
  const serviceContext = services.map((s: any) => 
    `- 상품명: ${s.title}\n  설명: ${s.desc}\n  특징: ${s.badge || 'Basic'}`
  ).join('\n\n');

  const systemInstruction = `
    당신은 '9,900원 AI 영상 제작소 (9900Studio)'의 전문 AI 상담원입니다.
    
    [역할]
    고객의 질문에 친절하고 명확하게 답변하며, 우리 서비스의 장점(저렴한 가격, 빠른 속도, 고퀄리티)을 어필합니다.
    
    [서비스 핵심 정보]
    - 가격: 모든 영상 제작 9,900원 (VAT 포함)
    - 제작 기간: 주문 후 24시간 이내 완성
    - 프로세스: 주문 접수 -> 자료 업로드 -> AI 제작 -> 결과물 전달
    
    [제공 서비스 목록]
    ${serviceContext}
    
    [응대 가이드]
    1. 한국어로 대화하세요.
    2. 답변은 3~4문장 이내로 간결하게 작성하세요.
    3. 영상 제작과 관련 없는 질문에는 정중하게 답변을 거절하고 서비스 관련 대화를 유도하세요.
    4. 가격이나 제작 기간에 대한 확신을 심어주세요.
  `;

  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return {
      sendMessage: async ({ message }: { message: string }) => {
        try {
          const result = await chat.sendMessage({ message });
          return { text: result.text };
        } catch (error) {
          console.error("Chat Message Error:", error);
          return { text: "죄송합니다. 잠시 후 다시 말씀해 주시겠어요?" };
        }
      }
    };
  } catch (error) {
    console.error("Chat Session Create Error:", error);
    return {
      sendMessage: async () => ({
        text: "시스템 오류: AI 상담원을 연결할 수 없습니다. (API Key 또는 네트워크 확인 필요)"
      })
    };
  }
};