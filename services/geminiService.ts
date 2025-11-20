import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const draftArticleWithAI = async (topic: string): Promise<{ title: string; content: string; summary: string } | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a school newspaper article about the following topic: "${topic}". 
      The tone should be engaging, appropriate for a high school audience, and factual but creative.
      Provide a catchy title, the full article content (approx 3 paragraphs), and a one-sentence summary.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["title", "content", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Error drafting article:", error);
    return null;
  }
};

export const polishContentWithAI = async (text: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Proofread and improve the flow of the following school news article content. 
      Keep the original meaning but make it more professional and exciting. 
      \n\nContent:\n${text}`,
    });
    return response.text || null;
  } catch (error) {
    console.error("Error polishing content:", error);
    return null;
  }
};
