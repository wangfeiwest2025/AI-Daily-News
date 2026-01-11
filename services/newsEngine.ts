
import { DailyReport, NewsCategory, NewsItem } from "../types";

// A library of news templates to ensure realistic content
const newsPool = [
  {
    title: "下一代超大规模推理模型发布，推理效率提升 400%",
    summary: "全新发布的推理架构采用了动态稀疏化技术，能够在保持逻辑推理能力的同时，大幅降低算力开销。多项基准测试显示，其在数学竞赛和代码生成任务中均刷新了纪录。",
    category: NewsCategory.MODEL,
    source: "AI Frontiers",
    tags: ["LLM", "推理优化", "SOTA"],
    impact: 'High'
  },
  {
    title: "全球首个 AI 治理框架协议在苏黎世签署",
    summary: "来自 30 多个国家的代表共同签署了该协议，旨在规范大模型的透明度、安全边界以及训练数据的合规性。这被视为全球 AI 监管迈出的里程碑式一步。",
    category: NewsCategory.POLICY,
    source: "Global Tech Watch",
    tags: ["政策", "监管", "治理"],
    impact: 'Medium'
  },
  {
    title: "新型光子 AI 芯片突破散热瓶颈，单卡算力倍增",
    summary: "科研团队通过新型光子集成电路设计，成功解决了超大规模并行计算中的功耗与散热难题。该技术预计在明年下半年进入商用阶段，将重塑数据中心布局。",
    category: NewsCategory.HARDWARE,
    source: "Silicon Insider",
    tags: ["芯片", "光子计算", "硬件"],
    impact: 'High'
  },
  {
    title: "某顶尖实验室宣布实现多模态情感对齐技术",
    summary: "该技术能够让 AI 更加精准地识别并反馈人类的情绪波动，显著提升了人机交互的自然度。测试者表示，该模型表现出了前所未有的共情能力。",
    category: NewsCategory.TECHNOLOGY,
    source: "Neural Daily",
    tags: ["多模态", "人机交互", "情感计算"],
    impact: 'Medium'
  },
  {
    title: "AI 算力租凭市场价格出现大幅波动，需求转向端侧",
    summary: "随着移动端大模型优化技术的普及，开发者对云端昂贵算力的依赖有所降低。分析师预测，未来 12 个月内，端侧 AI 算力将占据 60% 的市场份额。",
    category: NewsCategory.INDUSTRY,
    source: "Market Pulse",
    tags: ["算力", "市场分析", "端侧AI"],
    impact: 'Medium'
  },
  {
    title: "开源模型社区下载量突破新高，开发者生态持续繁荣",
    summary: "最新数据显示，全球最大的 AI 社区日均活跃用户数增长了 150%。多个轻量化开源模型正成为中小企业部署 AI 应用的首选方案。",
    category: NewsCategory.INDUSTRY,
    source: "OpenDev",
    tags: ["开源", "社区", "生态"],
    impact: 'Low'
  }
];

const trendPool = [
  "随着推理模型成本的骤降，AI 应用正从单次对话向长时推理代理转变。",
  "端侧 AI 硬件的成熟正在重塑个人计算体验，隐私保护成为核心卖点。",
  "全球监管框架的逐步落地，标志着 AI 行业从野蛮生长进入规范化发展阶段。",
  "多模态技术的爆发使得视频生成与 3D 建模成为今年最炙手可热的技术高地。"
];

// Helper to generate deterministic items based on a date string
export const generateDailyNews = (dateStr: string): DailyReport => {
  // Use a simple hash of the date string to select items deterministically
  const seed = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const shuffled = [...newsPool].sort((a, b) => {
    const hashA = (a.title.length + seed) % 100;
    const hashB = (b.title.length + seed) % 100;
    return hashA - hashB;
  });

  const highlights: NewsItem[] = shuffled.slice(0, 5).map((item, idx) => ({
    ...item,
    id: `sim-news-${dateStr}-${idx}`,
    time: `${(seed + idx) % 12 + 1} 小时前`,
    impact: (idx === 0) ? 'High' : (idx < 3 ? 'Medium' : 'Low') as any
  }));

  const trendIdx = seed % trendPool.length;

  return {
    date: dateStr,
    headline: highlights[0].title,
    trendAnalysis: trendPool[trendIdx],
    highlights: highlights,
    sources: ["https://artificialanalysis.ai/"]
  };
};
