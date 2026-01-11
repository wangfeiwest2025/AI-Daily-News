
import { DailyReport, NewsCategory } from "../types";

// 这是一个扩展的本地数据库，您可以随时手动增加或通过脚本更新此列表
const NEWS_DATABASE: Record<string, DailyReport> = {
  // 默认显示今天的数据
  "default": {
    date: new Date().toISOString().split('T')[0],
    headline: "AI 2.0 时代：从“大模型”向“大应用”的全面跨越",
    trendAnalysis: "本周 AI 行业焦点已从模型底座竞争转向垂直领域应用。具身智能、AI 智能体（Agents）以及端侧芯片性能的突破，标志着 AI 正从云端实验室走向每一个真实的生活场景。",
    highlights: [
      {
        id: "2025_05_01",
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
        id: "2025_05_02",
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
        id: "2025_05_03",
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
        id: "2025_05_04",
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
        id: "2025_05_05",
        title: "全球首例：AI 辅助研发的靶向药进入三期临床试验",
        summary: "由 Insilico Medicine 利用 AI 发现并设计的特发性肺纤维化药物正式进入三期。相较于传统研发方式，AI 将临床前研究时间缩短了 3 年，成本削减了 90%，展现了 AI 对生物医药的变革力。",
        category: NewsCategory.TECHNOLOGY,
        source: "Nature Medicine",
        time: "08:00 PM",
        tags: ["AI制药", "生物技术"],
        impact: "High",
        url: "https://www.nature.com"
      },
      {
        id: "2025_05_06",
        title: "AI 程序员 Devin 在 GitHub 解决问题率突破 25%",
        summary: "最新数据显示，Cognition 开发的 AI 程序员 Devin 在真实 GitHub 问题库中的成功率稳步提升。它不仅能写代码，还能自主学习新框架并进行端到端部署。软件工程的定义正在被重写。",
        category: NewsCategory.INDUSTRY,
        source: "GitHub News",
        time: "09:15 PM",
        tags: ["Devin", "AI编程"],
        impact: "Medium",
        url: "https://github.com"
      }
    ]
  }
};

export const fetchDailyAINews = async (date: string): Promise<DailyReport> => {
  // 模拟网络延迟以保持 UX 连贯感
  await new Promise(r => setTimeout(r, 600));
  
  // 如果数据库里有该日期的新闻则返回，否则返回默认数据
  return NEWS_DATABASE[date] || NEWS_DATABASE["default"];
};
