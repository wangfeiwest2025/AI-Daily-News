
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyReport, NewsCategory, NewsItem } from './types';
import { fetchDailyAINews } from './services/newsService';
import NewsCard from './components/NewsCard';
import TrafficChart from './components/TrafficChart';
import { HeroSkeleton } from './components/Skeleton';
import { 
  RefreshCw, TrendingUp, Sparkles, X, 
  MessageSquareQuote, Share2, Search as SearchIcon,
  Globe, BarChart3, Eye, Zap, Newspaper, Calendar, Filter, Activity,
  ArrowUpRight, Bookmark
} from 'lucide-react';

const STORAGE_KEY = 'ai_portal_engagement_stats';
const TRAFFIC_KEY = 'ai_portal_daily_traffic';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  
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
    const today = new Date().toISOString().split('T')[0];
    
    setStats(prev => {
      const newStats = {
        ...prev,
        [item.id]: { views: (prev[item.id]?.views || 0) + 1, shares: prev[item.id]?.shares || 0 }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      return newStats;
    });

    const savedTraffic = localStorage.getItem(TRAFFIC_KEY);
    const trafficData = savedTraffic ? JSON.parse(savedTraffic) : {};
    trafficData[today] = (trafficData[today] || 0) + 1;
    localStorage.setItem(TRAFFIC_KEY, JSON.stringify(trafficData));
    setRefreshTrigger(prev => prev + 1);
  };

  const filteredNews = useMemo(() => {
    if (!report) return [];
    return report.highlights.filter(item => {
      const matchesCategory = activeCategory === '全部' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [report, activeCategory, searchQuery]);

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
      
      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-slate-900/60 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            <header className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{detailItem.category}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{detailItem.source}</span>
              </div>
              <button onClick={() => setDetailItem(null)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <X className="w-5 h-5"/>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-10 space-y-8">
              <div>
                <div className="flex items-center gap-2 text-indigo-500 mb-4">
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">深度速递</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-6 leading-tight text-slate-900 dark:text-white">{detailItem.title}</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {detailItem.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-500">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 rounded-[2.5rem] border border-indigo-100/50 dark:border-slate-800">
                <h4 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">内容精要</h4>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                  {detailItem.summary}
                </p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    <p>该消息首发于 {detailItem.source}，于今日 {detailItem.time} 更新。</p>
                  </div>
                </div>
              </div>

              {detailItem.url && (
                <div className="space-y-4">
                   <a href={detailItem.url} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-200/20 dark:shadow-none group">
                    <Newspaper className="w-5 h-5"/> 阅读原文完整报道 <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                  <p className="text-center text-[10px] text-slate-400 font-medium italic">跳转至原文链接以获取图表及更多多媒体信息</p>
                </div>
              )}
            </div>
            
            <footer className="px-8 py-6 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <button onClick={() => {
                 navigator.clipboard.writeText(`${detailItem.title}\n\n${detailItem.summary}\n\n来自: AI DAILY PULSE`);
                 alert('已复制分享摘要');
               }} className="px-6 py-4 bg-white dark:bg-slate-900 text-slate-500 rounded-xl font-black text-[10px] flex items-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors">
                 <Share2 className="w-3.5 h-3.5" /> 复制分享摘要
               </button>
               <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
                   <Eye className="w-3.5 h-3.5 text-indigo-500" /> {stats[detailItem.id]?.views || 0}
                 </div>
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">PULSE ID: {detailItem.id}</div>
               </div>
            </footer>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl border-b border-slate-100 dark:border-slate-800 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-slate-900 dark:bg-indigo-600 p-2 rounded-xl group-hover:rotate-6 transition-transform">
              <Sparkles className="text-white w-5 h-5"/>
            </div>
            <h1 className="text-lg font-black tracking-tighter">AI DAILY <span className="text-indigo-600">PULSE</span></h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text"
                placeholder="极简搜索标题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl py-2 pl-9 pr-4 text-[11px] font-medium outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{selectedDate}</span>
            </div>
            <button onClick={() => loadNews(selectedDate)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? <HeroSkeleton /> : report && (
          <div className="space-y-12">
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 bg-slate-900 text-white rounded-[3rem] p-10 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[300px] shadow-2xl">
                <BarChart3 className="absolute -bottom-10 -right-10 opacity-5 w-64 h-64" />
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-widest text-indigo-400">
                    <Zap className="w-3 h-3 fill-current" /> 全球行业观察
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black leading-tight max-w-4xl tracking-tight">{report.headline}</h3>
                  <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">{report.trendAnalysis}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
                <h3 className="text-[10px] font-black mb-6 text-slate-400 tracking-widest uppercase flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" /> 浏览情况趋势 (7D)
                </h3>
                <TrafficChart key={refreshTrigger} />
                <div className="mt-auto pt-6 space-y-4">
                  <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">活跃分类分布</h4>
                  {categoryHeat.slice(0, 3).map(cat => (
                    <div key={cat.name} className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-500 dark:text-slate-400">{cat.name}</span>
                       <div className="flex-1 h-1 mx-3 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${cat.percentage}%` }}></div>
                       </div>
                       <span className="text-[9px] font-bold text-slate-400">{cat.totalViews}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-12 pt-6">
              <aside className="lg:w-48 shrink-0">
                <div className="sticky top-32 space-y-2">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4 flex items-center gap-2">
                    <Filter className="w-3 h-3" /> 分类筛选
                  </div>
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)} 
                      className={`w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg translate-x-1' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-indigo-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </aside>

              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNews.map((item, idx) => (
                    <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 50}ms` }}>
                      <NewsCard news={item} onClick={handleNewsClick} />
                    </div>
                  ))}
                </div>
                {filteredNews.length === 0 && (
                  <div className="py-32 flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full mb-4">
                      <SearchIcon className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">暂无匹配资讯</p>
                  </div>
                )}
                
                {filteredNews.length > 0 && (
                  <div className="mt-16 flex flex-col items-center gap-4 text-center">
                    <div className="w-12 h-1 bg-indigo-100 dark:bg-slate-800 rounded-full" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">今日内容已加载完毕</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 dark:border-slate-900 mt-20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400">
           <div className="bg-slate-200 dark:bg-slate-800 p-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5" />
           </div>
           <span className="text-[10px] font-black tracking-widest uppercase">AI DAILY PULSE &copy; 2024</span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">关于我们</a>
          <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">新闻提交</a>
          <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">API 文档</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
