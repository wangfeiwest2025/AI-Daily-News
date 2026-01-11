
import { DailyReport, NewsCategory } from "../types";

// 获取当前日期的字符串格式 YYYY-MM-DD
const getTodayStr = () => new Date().toISOString().split('T')[0];

const NEWS_DATABASE: Record<string, DailyReport> = {
  "default": {
    date: getTodayStr(),
    headline: "AI 2.0 时代：从对话助手到全能智能体 (Agents) 的进化",
    trendAnalysis: "今日数据表明，开发者关注度正从模型参数量转移到逻辑规划（Reasoning）与任务执行（Execution）上。具身智能与大模型的深度融合成为 ainews.com、Synced 等媒体的头版关键词。",
    highlights: [
      {
        id: "news_001",
        title: "OpenAI 'Strawberry' 项目细节曝光：通过强化学习实现自主思考",
        summary: "内部消息透露，OpenAI 正在开发的 Strawberry 模型具备极强的逻辑推理能力，能够自主解决未见过的复杂数学和科学难题。",
        category: NewsCategory.MODEL,
        source: "ainews.com",
        time: "08:15 AM",
        tags: ["OpenAI", "Strawberry"],
        impact: "High",
        url: "https://www.ainews.com"
      },
      {
        id: "news_002",
        title: "机器之心：智源研究院发布全球首个‘通用视觉’大模型",
        summary: "智源研究院（BAAI）推出的新模型突破了单一任务限制，可在自动驾驶、医疗影像和工业检测中通用。",
        category: NewsCategory.TECHNOLOGY,
        source: "Synced 机器之心",
        time: "09:30 AM",
        tags: ["通用视觉", "智源"],
        impact: "High",
        url: "https://www.jiqizhixin.com/"
      },
      {
        id: "news_003",
        title: "英伟达发布 NIMs 容器化微服务，加速企业级 AI 部署",
        summary: "NVIDIA NIMs 允许开发者在几分钟内通过容器部署预训练模型，极大简化了传统繁琐的 AI 工作流。",
        category: NewsCategory.HARDWARE,
        source: "InfoQ AI",
        time: "10:45 AM",
        tags: ["NVIDIA", "NIMs"],
        impact: "Medium",
        url: "https://www.infoq.com/ai/"
      },
      {
        id: "news_004",
        title: "Wired 深度：揭秘马斯克 xAI 如何在 19 天内建成巨型算力中心",
        summary: "位于孟菲斯的 Colossus 算力中心装备了 10 万块 H100 芯片，其建设速度打破了行业纪录。",
        category: NewsCategory.INDUSTRY,
        source: "Wired",
        time: "11:20 AM",
        tags: ["xAI", "算力中心"],
        impact: "High",
        url: "https://www.wired.com/tag/artificial-intelligence/"
      },
      {
        id: "news_005",
        title: "Reddit 热议：Llama-3.1-405B 在本地量化后的推理性能评测",
        summary: "社区开发者分享了在消费级显卡上运行 4-bit 量化版 Llama 3.1 的实测数据，其智力水平依然保持在顶级梯队。",
        category: NewsCategory.MODEL,
        source: "r/MachineLearning",
        time: "01:10 PM",
        tags: ["Llama", "开源社区"],
        impact: "Medium",
        url: "https://www.reddit.com/r/MachineLearning/"
      },
      {
        id: "news_006",
        title: "The Information：Google 计划在 12 月发布下一代模型 Gemini 2.0",
        summary: "Gemini 2.0 将在多模态原生处理和实时语音交互方面带来重大升级，旨在夺回 AI 领域的领导权。",
        category: NewsCategory.MODEL,
        source: "The Information",
        time: "03:45 PM",
        tags: ["Google", "Gemini 2.0"],
        impact: "High",
        url: "https://www.theinformation.com/"
      },
      {
        id: "news_007",
        title: "加州签署 SB 1047 AI 安全法案修订版，引发开发者激辩",
        summary: "该法案旨在对开发超大型模型的公司进行安全监管，虽然经过修订放宽了条件，但仍被部分风投机构批评。 ",
        category: NewsCategory.POLICY,
        source: "TechCrunch",
        time: "05:00 PM",
        tags: ["AI安全", "政策"],
        impact: "Medium",
        url: "https://techcrunch.com/"
      },
      {
        id: "news_008",
        title: "Perplexity 推出 Pro Search 升级版：实现长链条逻辑搜索",
        summary: "Perplexity 的新功能可以自动将复杂问题拆分为多个步骤，跨网页抓取并汇总深度报告。",
        category: NewsCategory.TECHNOLOGY,
        source: "ainews.com",
        time: "06:30 PM",
        tags: ["Perplexity", "搜索革命"],
        impact: "Medium",
        url: "https://www.ainews.com"
      },
      {
        id: "news_009",
        title: "MIT 研究成果：新型光子芯片可让 AI 计算速度提升 100 倍",
        summary: "MIT 研究团队开发的基于光干涉原理的处理器，能在极低功耗下完成大规模矩阵运算。",
        category: NewsCategory.HARDWARE,
        source: "MIT Tech Review",
        time: "08:15 PM",
        tags: ["光子芯片", "未来计算"],
        impact: "High",
        url: "https://www.technologyreview.com/"
      },
      {
        id: "news_010",
        title: "波士顿动力展示 Atlas 纯电版全自动搬运能力",
        summary: "不再依赖液压驱动的全新 Atlas 机器人展示了在复杂物流环境中的路径规划与避障能力。",
        category: NewsCategory.TECHNOLOGY,
        source: "The Verge",
        time: "09:40 PM",
        tags: ["波士顿动力", "机器人"],
        impact: "Medium",
        url: "https://www.theverge.com/"
      }
    ]
  }
};

export const fetchDailyAINews = async (date: string): Promise<DailyReport> => {
  await new Promise(r => setTimeout(r, 600));
  const today = getTodayStr();
  const baseData = NEWS_DATABASE[date] || NEWS_DATABASE["default"];
  return {
    ...baseData,
    date: date === today ? today : date
  };
};
