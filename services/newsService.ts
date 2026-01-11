
import { GoogleGenAI } from "@google/genai";
import { DailyReport, NewsCategory, NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getTodayStr = () => new Date().toISOString().split('T')[0];

function extractJSON(text: string) {
  try {
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1) return null;
    const jsonStr = text.substring(startIdx, endIdx + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON Extraction failed:", e);
    return null;
  }
}

/**
 * Fetches the latest AI news. 
 * Provides links to official leaderboards instead of attempting to mirror them.
 */
export const fetchDailyAINews = async (date: string): Promise<DailyReport> => {
  try {
    const prompt = `
      Today is ${date}. Access the latest global AI industry news and breakthroughs via search.
      
      Tasks:
      1. Summarize 5 major breaking AI news pieces from the last 24 hours (Models, Hardware, Industry shifts).
      2. Provide a 2-sentence market trend analysis.
      
      Return results strictly in Chinese (Simplified) as a JSON object:
      {
        "headline": "今日 AI 行业头条",
        "trendAnalysis": "趋势分析...",
        "highlights": [
          {
            "id": "news_1",
            "title": "标题",
            "summary": "详细摘要",
            "category": "大语言模型",
            "source": "来源",
            "time": "时间",
            "tags": ["AI", "Tech"],
            "impact": "High",
            "url": "原文链接"
          }
        ]
      }
      
      Valid categories: ${Object.values(NewsCategory).join(', ')}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a senior AI news analyst. Focus on verifiable facts and latest announcements. Use search grounding for accuracy.",
      },
    });

    const result = extractJSON(response.text || "{}");
    
    if (!result || !result.highlights) {
      throw new Error("Invalid news format from API");
    }

    return {
      date: date,
      headline: result.headline,
      trendAnalysis: result.trendAnalysis,
      modelRankings: [], 
      highlights: result.highlights,
      sources: ["https://artificialanalysis.ai/leaderboards/models"]
    };
  } catch (error) {
    console.error("Fetch failed:", error);
    return {
      date: date,
      headline: "AI 动态正在极速生成中",
      trendAnalysis: "由于数据源同步延迟，请点击右上角手动刷新或访问权威榜单链接。",
      modelRankings: [],
      highlights: [],
      sources: ["https://artificialanalysis.ai/"]
    };
  }
};
