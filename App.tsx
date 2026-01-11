
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyReport, NewsCategory, NewsItem } from './types';
import { fetchDailyAINews } from './services/newsService';
import NewsCard from './components/NewsCard';
import { NewsSkeleton, HeroSkeleton } from './components/Skeleton';
import { 
  RefreshCw, TrendingUp, Sparkles, X, 
  MessageSquareQuote, Share2, Search,
  Globe, BarChart3, Eye, Zap, Newspaper, Calendar
} from 'lucide-react';

const STORAGE_KEY = 'ai_portal_engagement_stats';

interface EngagementStats {
  [key: string]: {
    views: number;
    shares: number;
  };
}

const categories = ['全部', ...Object.values(NewsCategory)];

const App: React.FC = () => {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [detailItem, setDetailItem] = useState<NewsItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [stats, setStats] = useState<EngagementStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const loadNews = useCallback(async (dateToLoad: string) => {
    setLoading(true);
    const data = await fetchDailyAINews(dateToLoad);
    setReport(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadNews(selectedDate); }, [selectedDate, loadNews]);

  const handleNewsClick = (item: NewsItem) => {
    setDetailItem(item);
    setStats(prev => {
      const newStats = {
        ...prev,
        [item.id]: { views: (prev[item.id]?.views || 0) + 1, shares: prev[item.id]?.shares || 0 }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      return newStats;
    });
  };

  const categoryHeat = useMemo(() => {
    if (!report) return [];
    const data = Object.values(NewsCategory).map(cat => {
      const itemsInCategory = report.highlights.filter(n => n.category === cat);
      const totalViews = itemsInCategory.reduce((acc, n) => acc + (stats[n.id]?.views || 0), 0);
      return { name: cat, totalViews };
    });
    const maxViews = Math.max(...data.map(d => d.totalViews), 1);
    return data.map(d => ({ 
      ...d, 
      percentage: (d.totalViews / maxViews) * 100 
    })).sort((a,b) => b.totalViews - a.totalViews);
  }, [report, stats]);

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 详情页弹窗 */}
      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-slate-900/60 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
            <header className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{detailItem.category}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {stats[detailItem.id]?.views || 0} 已读
                </span>
              </div>
              <button onClick={() => setDetailItem(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <X className="w-5 h-5"/>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-10 md:p-14">
              <h2 className="text-3xl md:text-4xl font-black mb-10 leading-tight tracking-tight text-slate-900 dark:text-white">
                {detailItem.title}
              </h2>
              
              <div className="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 mb-12 relative leading-relaxed">
                <MessageSquareQuote className="w-12 h-12 text-indigo-100 dark:text-indigo-900/50 mb-6" />
                <p className="text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic whitespace-pre-wrap">
                  {detailItem.summary}
                </p>
              </div>

              <div className="space-y-6 mb-12">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">扩展阅读</h4>
                <div className="grid grid-cols-2 gap-4">
                  <a href={`https://www.baidu.com/s?wd=${encodeURIComponent(detailItem.title)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                    <Globe className="w-4 h-4 text-blue-500" /> 百度搜索
                  </a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(detailItem.title)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                    <Search className="w-4 h-4 text-indigo-500" /> Google 搜索
                  </a>
                </div>
              </div>

              {detailItem.url && (
                <div className="pt-6">
                  <a 
                    href={detailItem.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full flex items-center justify-center gap-3 px-8 py-7 bg-slate-900 dark:bg-indigo-600 text-white rounded-[2rem] font-black text-base hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100/50 dark:shadow-none"
                  >
                    <Newspaper className="w-6 h-6"/> 阅读原文完整报道
                  </a>
                </div>
              )}
            </div>

            <footer className="px-10 py-8 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={() => {
                  const text = `${detailItem.title}\n\n${detailItem.summary}\n\n来源: ${detailItem.source}\n查看全文: ${window.location.href}`;
                  navigator.clipboard.writeText(text);
                  alert('分享摘要已复制到剪贴板！');
                }}
                className="w-full py-5 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Share2 className="w-4 h-4" /> 生成分享卡片
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl border-b border-slate-100 dark:border-slate-800 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-slate-900 dark:bg-indigo-600 p-2.5 rounded-xl group-hover:rotate-12 transition-transform">
              <Sparkles className="text-white w-6 h-6"/>
            </div>
            <h1 className="text-xl font-black tracking-tighter">AI DAILY <span className="text-indigo-600">PULSE</span></h1>
          </div>
          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-black text-slate-600 dark:text-slate-300">{selectedDate}</span>
            </div>
            <button onClick={() => loadNews(selectedDate)} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all active:scale-95 hover:bg-slate-50">
              <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32">
        {loading ? <HeroSkeleton /> : report && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 bg-slate-900 text-white rounded-[3.5rem] p-10 md:p-14 relative overflow-hidden group shadow-2xl">
                <BarChart3 className="absolute -bottom-10 -right-10 opacity-5 w-80 h-80" />
                <div className="relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    <Zap className="w-3 h-3 fill-indigo-400" /> 今日核心趋势
                  </div>
                  <h3 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">{report.headline}</h3>
                  <p className="text-slate-400 max-w-2xl text-base leading-relaxed font-medium">{report.trendAnalysis}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col">
                <h3 className="text-sm font-black mb-8 flex items-center gap-2 text-slate-400 tracking-widest uppercase">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> 热度趋势统计
                </h3>
                <div className="space-y-6 flex-grow">
                  {categoryHeat.map((cat) => (
                    <div key={cat.name} className="space-y-3">
                      <div className="flex justify-between text-[11px] font-black uppercase text-slate-500">
                        <span>{cat.name}</span>
                        <span className="text-indigo-600">{cat.totalViews} 次阅读</span>
                      </div>
                      <div className="h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-900 dark:bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-6 border-t border-slate-50 dark:border-slate-800 text-center">
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">由本地引擎驱动</p>
                </div>
              </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-16 pt-8">
              <aside className="lg:w-64">
                <nav className="sticky top-32 space-y-3">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 px-6">筛选内容</div>
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)} 
                      className={`w-full text-left px-8 py-5 rounded-3xl text-xs font-black transition-all ${activeCategory === cat ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-2xl shadow-indigo-200 dark:shadow-none translate-x-2' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-indigo-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                {report.highlights.filter(h => activeCategory === '全部' || h.category === activeCategory).map(item => (
                  <NewsCard key={item.id} news={item} onClick={handleNewsClick} />
                ))}
                
                {/* 底部占位卡片：提示更多 */}
                <div className="md:col-span-2 py-16 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">今日资讯已呈现完毕</p>
                  <p className="text-slate-300 text-[10px] font-medium max-w-xs leading-relaxed">我们每天清晨会自动整理全球 AI 行业的最新动态，欢迎明日再来。</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
