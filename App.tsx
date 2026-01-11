
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyReport, NewsCategory, NewsItem } from './types';
import { fetchDailyAINews } from './services/newsService';
import NewsCard from './components/NewsCard';
import { NewsSkeleton, HeroSkeleton } from './components/Skeleton';
import { 
  RefreshCw, TrendingUp, Sparkles, X, 
  MessageSquareQuote, Share2, Search,
  Globe, BarChart3, Eye, Zap, Newspaper
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
  const [report, setReport] = useState<(DailyReport & { sources?: any[] }) | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [detailItem, setDetailItem] = useState<NewsItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [stats, setStats] = useState<EngagementStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // SEO & 结构化数据
  useEffect(() => {
    if (report) {
      const title = `${report.headline} | ${selectedDate} AI 每日新闻`;
      const description = `${report.trendAnalysis.substring(0, 150)}...`;
      document.title = title;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [report, selectedDate]);

  const loadNews = useCallback(async (dateToLoad: string) => {
    setLoading(true);
    try {
      const data = await fetchDailyAINews(dateToLoad);
      setReport(data);
      setStats(prev => {
        const newStats = { ...prev };
        data.highlights.forEach(item => {
          if (!newStats[item.id]) newStats[item.id] = { views: 0, shares: 0 };
        });
        return newStats;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNews(selectedDate); }, [selectedDate, loadNews]);

  const handleNewsClick = (item: NewsItem) => {
    setDetailItem(item);
    setStats(prev => {
      const newStats = {
        ...prev,
        [item.id]: { views: (prev[item.id]?.views || 0) + 1, shares: prev[item.id]?.shares || 0 }
      };
      // 持久化存储
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
    <div className="min-h-screen bg-[#FAFBFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 详情页弹窗 */}
      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/60 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
            
            <header className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{detailItem.category}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {stats[detailItem.id]?.views || 0} 阅读量
                </span>
              </div>
              <button 
                onClick={() => setDetailItem(null)} 
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-rose-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5"/>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-10 md:p-14">
              <h2 className="text-3xl md:text-4xl font-black mb-10 leading-tight tracking-tight text-slate-900 dark:text-white">
                {detailItem.title}
              </h2>
              
              <div className="bg-slate-50 dark:bg-slate-800/40 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 mb-12 relative leading-relaxed">
                <MessageSquareQuote className="w-10 h-10 text-indigo-100 dark:text-indigo-900/50 mb-6" />
                <p className="text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  {detailItem.summary}
                </p>
              </div>

              <div className="space-y-6 mb-12">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">扩展探索</h4>
                <div className="grid grid-cols-2 gap-4">
                  <a href={`https://www.baidu.com/s?wd=${encodeURIComponent(detailItem.title)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                    <Globe className="w-4 h-4 text-blue-500" /> 百度搜索
                  </a>
                  <a href={`https://www.google.com/search?q=${encodeURIComponent(detailItem.title)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-xs font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm">
                    <Search className="w-4 h-4 text-indigo-500" /> Google 搜索
                  </a>
                </div>
              </div>

              {/* 将阅读原文移至扩展探索下方 */}
              {detailItem.url && (
                <div className="pt-6">
                  <a 
                    href={detailItem.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full flex items-center justify-center gap-3 px-8 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-base hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
                  >
                    <Newspaper className="w-6 h-6"/> 前往原文报道阅读全文
                  </a>
                </div>
              )}
            </div>

            <footer className="px-10 py-8 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={() => {
                  const text = `${detailItem.title}\n\n${detailItem.summary}\n\n来源: ${detailItem.source}\n原文: ${detailItem.url || '暂无'}`;
                  navigator.clipboard.writeText(text);
                  alert('资讯摘要已复制！');
                }}
                className="w-full py-5 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                <Share2 className="w-4 h-4" /> 复制并分享给好友
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl">
              <Sparkles className="text-white w-6 h-6"/>
            </div>
            <h1 className="text-xl font-black tracking-tighter">AI DAILY <span className="text-indigo-600">NEWS</span></h1>
          </div>
          <nav className="flex items-center gap-3">
            <time className="hidden md:block text-xs font-black px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl">{selectedDate}</time>
            <button onClick={() => loadNews(selectedDate)} className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-90">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32">
        {loading ? <HeroSkeleton /> : report && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 bg-slate-900 text-white rounded-[3rem] p-10 md:p-14 relative overflow-hidden group shadow-2xl">
                <BarChart3 className="absolute top-0 right-0 p-10 opacity-10 w-48 h-48" />
                <div className="relative z-10 space-y-6">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">Global AI Pulse Analysis</span>
                  <h3 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight">{report.headline}</h3>
                  <p className="text-slate-400 max-w-2xl text-sm leading-relaxed font-medium">{report.trendAnalysis}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col">
                <h3 className="text-sm font-black mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-600" /> 分类累计点击</h3>
                <div className="space-y-5 flex-grow">
                  {categoryHeat.map((cat) => (
                    <div key={cat.name} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                        <span>{cat.name}</span>
                        <span className="text-indigo-600">{cat.totalViews} 次点击</span>
                      </div>
                      <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700 ease-out" 
                          style={{ width: `${cat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">实时更新关注热点</p>
              </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-12 pt-8">
              <aside className="lg:w-64">
                <nav className="sticky top-32 space-y-2">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">分类浏览</div>
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)} 
                      className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-indigo-400'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </nav>
              </aside>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                {report.highlights.filter(h => activeCategory === '全部' || h.category === activeCategory).map(item => (
                  <div key={item.id} className="relative group">
                    <NewsCard news={item} onClick={handleNewsClick} />
                    <div className={`absolute top-6 right-6 flex items-center gap-1.5 backdrop-blur px-3 py-1.5 rounded-xl border text-[10px] font-black pointer-events-none transition-all ${stats[item.id]?.views > 0 ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg scale-105' : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 border-slate-200 dark:border-slate-800'}`}>
                      <Zap className={`w-3 h-3 ${stats[item.id]?.views > 0 ? 'fill-white animate-pulse' : 'text-slate-300'}`} />
                      {stats[item.id]?.views || 0} READS
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
