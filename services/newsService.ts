
import { GoogleGenAI } from "@google/genai";
import { DailyReport, NewsCategory, NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function extractJSON(text: string) {
  try {
    // Improved extraction to handle potential markdown wrappers or extra text
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1) return null;
    const jsonStr = text.substring(startIdx, endIdx + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Extraction failed. Raw text snippet:", text.substring(0, 100));
    return null;
  }
}

export const fetchDailyAINews = async (date: string): Promise<DailyReport> => {
  try {
    const prompt = `
      Current Date: ${date}. 
      Task: Search for the 5 most significant global AI news stories from the last 24 hours (Models, GPUs, Policy, Big Tech).
      
      Requirements:
      1. Use Simplified Chinese for all text.
      2. Categorize into: ${Object.values(NewsCategory).join(', ')}.
      3. Return ONLY a valid JSON object.
      
      Format:
      {
        "headline": "Main Headline for the day",
        "trendAnalysis": "2-sentence analysis of current market direction",
        "highlights": [
          {
            "id": "unique_string",
            "title": "Clear News Title",
            "summary": "2-3 sentence summary",
            "category": "One of categories listed above",
            "source": "TechCrunch, Reuters, etc.",
            "time": "Relative time (e.g. 3小时前)",
            "tags": ["AI", "Tech"],
            "impact": "High",
            "url": "Valid news link"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a world-class AI news editor. Accuracy is paramount. Always provide exactly 5 items. Output JSON ONLY.",
      },
    });

    const result = extractJSON(response.text || "{}");
    
    if (!result || !result.highlights || !Array.isArray(result.highlights)) {
      throw new Error("Invalid structure from AI");
    }

    return {
      date: date,
      headline: result.headline || "AI 行业今日动态汇总",
      trendAnalysis: result.trendAnalysis || "全球 AI 领域正处于高速迭代期。",
      highlights: result.highlights.map((h: any, idx: number) => ({
        ...h,
        id: h.id || `news-${date}-${idx}`
      })),
      sources: ["https://artificialanalysis.ai/leaderboards/models"]
    };
  } catch (error) {
    console.warn("AI Fetch failed, returning empty state trigger:", error);
    throw error; // Let App.tsx handle the fallback
  }
};
