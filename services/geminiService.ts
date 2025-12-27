import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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