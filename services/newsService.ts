
import { GoogleGenAI } from "@google/genai";
import { DailyReport, NewsCategory, NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function extractJSON(text: string) {
  try {
    // Look for the first occurrence of { and the last occurrence of }
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("JSON Extraction failed:", e);
    return null;
  }
}

/**
 * Fetches the latest AI news. 
 */
export const fetchDailyAINews = async (date: string): Promise<DailyReport> => {
  try {
    const prompt = `
      今天是 ${date}。请搜索并汇总过去 24 小时内全球 AI 行业的 5 条重大新闻。
      
      任务：
      1. 总结 5 条突发新闻（包括大模型发布、硬件突破、行业动态）。
      2. 提供 2 句关于当前 AI 市场的趋势分析。
      
      请严格按照以下 JSON 格式返回结果（简体中文）：
      {
        "headline": "今日 AI 行业头条标题",
        "trendAnalysis": "简短的趋势分析文字",
        "highlights": [
          {
            "id": "news_unique_id_1",
            "title": "新闻标题",
            "summary": "详细摘要内容",
            "category": "大语言模型",
            "source": "来源媒体名称",
            "time": "时间（如：2小时前）",
            "tags": ["AI", "科技"],
            "impact": "High",
            "url": "https://example.com"
          }
        ]
      }
      
      可选分类必须是以下之一: ${Object.values(NewsCategory).join(', ')}。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "你是一个专业的 AI 新闻分析师。你必须只输出有效的 JSON 格式。确保 highlights 数组中至少包含 5 个条目。",
      },
    });

    const result = extractJSON(response.text || "{}");
    
    if (!result || !result.highlights || result.highlights.length === 0) {
      throw new Error("AI returned empty or invalid data");
    }

    return {
      date: date,
      headline: result.headline || "今日 AI 行业动态",
      trendAnalysis: result.trendAnalysis || "行业正在稳步推进。",
      modelRankings: [], 
      highlights: result.highlights,
      sources: ["https://artificialanalysis.ai/leaderboards/models"]
    };
  } catch (error) {
    console.error("Fetch failed:", error);
    // Return a fallback so the app doesn't crash but shows "update" state
    return {
      date: date,
      headline: "AI 动态正在更新中...",
      trendAnalysis: "由于数据源访问频率限制，请尝试刷新页面或检查网络连接。",
      modelRankings: [],
      highlights: [],
      sources: ["https://artificialanalysis.ai/"]
    };
  }
};
