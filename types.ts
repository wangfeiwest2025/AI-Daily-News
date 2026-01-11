
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  time: string;
  tags: string[];
  impact: 'High' | 'Medium' | 'Low';
  url?: string; // 新增：外部原文链接
}

export interface DailyReport {
  date: string;
  headline: string;
  highlights: NewsItem[];
  trendAnalysis: string;
}

export enum NewsCategory {
  TECHNOLOGY = '前沿技术',
  INDUSTRY = '行业动态',
  MODEL = '大语言模型',
  HARDWARE = '硬件/算力',
  POLICY = '政策法规'
}
