
import { GoogleGenAI, Type } from "@google/genai";
import { DailyReport, NewsCategory } from "../types";

export const fetchDailyAINews = async (date: string): Promise<DailyReport & { sources?: any[] }> => {
  // Always use { apiKey: process.env.API_KEY } named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `你是一个资深的科技日报主编。请检索并总结 ${date} 当天全球 AI 领域的重大新闻。
  要求：
  1. 必须包含至少 5 条具有行业影响力的真实新闻。
  2. 每条新闻需包含：ID、标题、核心摘要、所属分类、行业影响(High/Medium/Low)、媒体来源(如 Reuters, The Verge, 机器之心等)、发布时间、相关标签、以及一个对应的外部参考链接 URL。
  3. 提供今日 AI 行业整体趋势的深度观察。
  4. 术语使用中文专业表达。
  5. 分类范围：${Object.values(NewsCategory).join(', ')}。
  6. 请务必通过搜索工具确保 URL 的真实性和时效性。
  
  请以 JSON 格式返回结果，结构如下：
  {
    "date": "${date}",
    "headline": "日报标题",
    "highlights": [
      {
        "id": "unique_id",
        "title": "新闻标题",
        "summary": "摘要",
        "category": "分类",
        "source": "来源",
        "time": "时间",
        "tags": ["标签"],
        "impact": "High/Medium/Low",
        "url": "原文链接"
      }
    ],
    "trendAnalysis": "趋势分析"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        // googleSearch cannot be used with responseMimeType: "application/json"
        tools: [{ googleSearch: {} }],
      }
    });

    // response.text is a property, not a method
    const text = response.text || '{}';
    // Use a regex or simple cleanup to ensure we parse the JSON if the model wrapped it in markdown code blocks
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { ...data, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
