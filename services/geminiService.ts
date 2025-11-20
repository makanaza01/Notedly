import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

// We'll proceed without the API key, but the AI features will not work.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const draftArticleWithAI = async (topic: string): Promise<{ title: string; content: string; summary: string } | null> => {
  if (!ai) {
    console.warn("Gemini API key not set. Returning mock data.");
    // Return mock data so the app can function without an API key.
    return {
      title: "AI Feature Disabled",
      content: "The AI features are currently disabled because the Gemini API key is not configured. Please set the GEMINI_API_KEY environment variable to enable this feature.",
      summary: "AI features are disabled."
    };
  }

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

    if (!response.response.text) return null;
    return JSON.parse(response.response.text());
  } catch (error) {
    console.error("Error drafting article with AI:", error);
    return null;
  }
};
