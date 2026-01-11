
import { DailyReport, NewsCategory } from "../types";

// 获取当前日期的字符串格式 YYYY-MM-DD
const getTodayStr = () => new Date().toISOString().split('T')[0];

const NEWS_DATABASE: Record<string, DailyReport> = {
  "default": {
    date: getTodayStr(),
    headline: "AI 2.0 时代：从“大模型”向“大应用”的全面跨越",
    trendAnalysis: "本周 AI 行业焦点已从模型底座竞争转向垂直领域应用。具身智能、AI 智能体（Agents）以及端侧芯片性能的突破，标志着 AI 正从云端实验室走向每一个真实的生活场景。",
    highlights: [
      {
        id: "news_001",
        title: "OpenAI 推出 GPT-5 预览版：逻辑推理能力实现指数级跃迁",
        summary: "OpenAI 今日小范围开放了下一代模型 GPT-5 的推理测试。新模型引入了‘思维链自我纠正’机制，在解决高等数学问题和多步编程任务时，错误率降低了 85%。该模型据称已具备初级博士水平的领域认知能力，预计将在下个季度全面推向 Plus 用户。",
        category: NewsCategory.MODEL,
        source: "OpenAI Blog",
        time: "10:25 AM",
        tags: ["GPT-5", "逻辑推理"],
        impact: "High",
        url: "https://openai.com"
      },
      {
        id: "news_002",
        title: "英伟达 Blackwell 芯片正式量产，算力成本骤降 60%",
        summary: "黄仁勋今日在 GTC 大会上确认，首批 Blackwell 架构 GPU 已交付顶级数据中心。新架构专为万亿参数模型设计，其 FP4 精度推理速度是上一代的 5 倍，这意味着中小企业部署大模型的硬件门槛将显著降低。",
        category: NewsCategory.HARDWARE,
        source: "NVIDIA News",
        time: "11:45 AM",
        tags: ["Blackwell", "算力革命"],
        impact: "High",
        url: "https://nvidia.com"
      },
      {
        id: "news_003",
        title: "Apple Intelligence 2.0：手机端侧推理已能处理 70% 日常任务",
        summary: "苹果在最新的开发者预览版中升级了端侧 AI 引擎。通过全新的模型压缩技术，iPhone 现在可以在不连接网络的情况下，本地处理复杂的邮件摘要、图像编辑和个性化日程管理，电池寿命损耗几乎可以忽略不计。",
        category: NewsCategory.TECHNOLOGY,
        source: "9to5Mac",
        time: "02:10 PM",
        tags: ["Apple", "端侧AI"],
        impact: "Medium",
        url: "https://apple.com"
      },
      {
        id: "news_004",
        title: "Mistral AI 发布全新开源模型：以 12B 参数挑战 GPT-4",
        summary: "来自法国的 AI 领头羊 Mistral 再次震撼开源界。新发布的 Pixtral 12B 模型在多模态理解上表现卓越，其在商用许可下的开放策略进一步巩固了其作为欧洲 AI 之光的地位。",
        category: NewsCategory.MODEL,
        source: "Mistral Blog",
        time: "03:50 PM",
        tags: ["Mistral", "开源多模态"],
        impact: "Medium",
        url: "https://mistral.ai"
      },
      {
        id: "news_005",
        title: "Meta 发布开源 Llama 4 路线图，承诺性能比肩闭源顶流",
        summary: "扎克伯格表示，Llama 4 将采用混合专家模型 (MoE) 架构，总参数量可能突破 500B。Meta 致力于维持开源生态的领导地位，计划在全球范围内建立更多的 AI 合规化标准。",
        category: NewsCategory.INDUSTRY,
        source: "Meta AI",
        time: "04:30 PM",
        tags: ["Llama 4", "开源生态"],
        impact: "High",
        url: "https://ai.meta.com"
      },
      {
        id: "news_006",
        title: "全球首例：AI 辅助研发的靶向药进入三期临床试验",
        summary: "由 Insilico Medicine 利用 AI 发现并设计的特发性肺纤维化药物正式进入三期。相较于传统研发方式，AI 将临床前研究时间缩短了 3 年，成本削减了 90%，展现了 AI 对生物医药的变革力。",
        category: NewsCategory.TECHNOLOGY,
        source: "Nature Medicine",
        time: "08:00 PM",
        tags: ["AI制药", "生物技术"],
        impact: "High",
        url: "https://www.nature.com"
      }
    ]
  }
};

export const fetchDailyAINews = async (date: string): Promise<DailyReport> => {
  // 模拟网络延迟以保持 UX 连贯感
  await new Promise(r => setTimeout(r, 600));
  
  // 动态处理：如果请求的是今天，确保返回的内容日期也是今天
  const today = getTodayStr();
  const baseData = NEWS_DATABASE[date] || NEWS_DATABASE["default"];
  
  return {
    ...baseData,
    date: date === today ? today : date
  };
};
