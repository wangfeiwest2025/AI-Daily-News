
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyReport, NewsCategory, NewsItem } from './types';
import { generateDailyNews } from './services/newsEngine';
import NewsCard from './components/NewsCard';
import TrafficChart from './components/TrafficChart';
import { HeroSkeleton } from './components/Skeleton';
import { 
  RefreshCw, Sparkles, X, 
  Search as SearchIcon,
  BarChart3, Eye, Zap, Newspaper, Calendar, Activity,
  ArrowUpRight, Bookmark, Trophy, ExternalLink
} from 'lucide-react';

const STORAGE_KEY = 'ai_portal_engagement_stats';
const TRAFFIC_KEY = 'ai_portal_daily_traffic';

interface EngagementStats {
  [key: string]: {
    views: number;
  };
}

const categories = ['全部', ...Object.values(NewsCategory)];

const App: React.FC = () => {
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [detailItem, setDetailItem] = useState<NewsItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  
  const [stats, setStats] = useState<EngagementStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const loadData = useCallback(() => {
    setLoading(true);
    const today = new Date().toLocaleDateString('zh-CN', { 
      year: 'numeric', month: '2-digit', day: '2-digit' 
    }).replace(/\//g, '-');
    
    setSelectedDate(today);
    
    // Minimal artificial delay for polish
    setTimeout(() => {
      const data = generateDailyNews(today);
      setReport(data);
      setLoading(false);
    }, 450);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, refreshTrigger]);

  const handleNewsClick = (item: NewsItem) => {
    setDetailItem(item);
    
    setStats(prev => {
      const currentItemStats = prev[item.id] || { views: 0 };
      const newStats = {
        ...prev,
        [item.id]: { ...currentItemStats, views: currentItemStats.views + 1 }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      return newStats;
    });

    const savedTraffic = localStorage.getItem(TRAFFIC_KEY);
    const trafficData = savedTraffic ? JSON.parse(savedTraffic) : {};
    trafficData[selectedDate] = (trafficData[selectedDate] || 0) + 1;
    localStorage.setItem(TRAFFIC_KEY, JSON.stringify(trafficData));
  };

  const filteredNews = useMemo(() => {
    if (!report) return [];
    return report.highlights.filter(item => {
      return activeCategory === '全部' || item.category === activeCategory;
    });
  }, [report, activeCategory]);

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
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
      {detailItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-slate-900/60 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
            <header className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full tracking-widest">{detailItem.category}</span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{detailItem.source}</span>
              </div>
              <button onClick={() => setDetailItem(null)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                <X className="w-5 h-5"/>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-10 space-y-8">
              <div>
                <div className="flex items-center gap-2 text-indigo-500 mb-4">
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">深度解析</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-6 leading-tight text-slate-900 dark:text-white">{detailItem.title}</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {detailItem.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold text-slate-500">#{tag}</span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 rounded-[2.5rem] border border-indigo-100/50 dark:border-slate-800">
                <h4 className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">内容简报</h4>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{detailItem.summary}</p>
              </div>

              <div className="flex items-center gap-4 py-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  点击量: {stats[detailItem.id]?.views || 0}
                </div>
              </div>

              <button onClick={() => setDetailItem(null)} className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl group">
                <Newspaper className="w-5 h-5"/> 本地引擎实时生成 <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-3xl border-b border-slate-100 dark:border-slate-800 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-slate-900 dark:bg-indigo-600 p-2 rounded-xl group-hover:rotate-6 transition-transform">
              <Sparkles className="text-white w-5 h-5"/>
            </div>
            <h1 className="text-lg font-black tracking-tighter uppercase">AI DAILY <span className="text-indigo-600">PULSE</span></h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <Calendar className="w-3 h-3 text-indigo-600" />
              <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 tracking-widest">{selectedDate}</span>
            </div>
            <button onClick={() => setRefreshTrigger(t => t + 1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group">
              <RefreshCw className={`w-4 h-4 text-slate-500 group-active:rotate-180 transition-transform ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <HeroSkeleton />
        ) : report && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 bg-slate-900 text-white rounded-[3rem] p-10 md:p-12 relative overflow-hidden flex flex-col justify-center min-h-[300px] shadow-2xl">
                <BarChart3 className="absolute -bottom-10 -right-10 opacity-5 w-64 h-64" />
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                    <Zap className="w-3 h-3 fill-current" /> 本地引擎 · 离线可用
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black leading-tight max-w-4xl tracking-tight">{report.headline}</h3>
                  <p className="text-slate-400 text-sm max-w-xl font-medium leading-relaxed">{report.trendAnalysis}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-[10px] font-black mb-6 text-slate-400 tracking-widest uppercase flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" /> 近 7 天阅读活跃度
                </h3>
                <TrafficChart />
                <div className="mt-6 space-y-3">
                   {categoryHeat.slice(0, 4).map(cat => (
                    <div key={cat.name} className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-500 dark:text-slate-400">{cat.name}</span>
                       <div className="flex-1 h-1 mx-3 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${cat.percentage}%` }}></div>
                       </div>
                       <span className="text-[9px] font-bold text-slate-400 tabular-nums">{cat.totalViews}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-12 pt-6">
              <aside className="lg:w-48 shrink-0">
                <div className="sticky top-32 space-y-2">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">快速导航</div>
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
                  {filteredNews.map((item) => (
                    <NewsCard key={item.id} news={item} onClick={handleNewsClick} />
                  ))}
                </div>
                {filteredNews.length === 0 && (
                   <div className="py-24 text-center">
                    <SearchIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">该分类暂无今日资讯</p>
                    <button onClick={() => setActiveCategory('全部')} className="mt-4 text-xs font-black text-indigo-600 underline">返回全部频道</button>
                  </div>
                )}
              </div>

              <aside className="lg:w-80 shrink-0 space-y-8">
                <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-xl">
                  <Trophy className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 rotate-12" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[9px] font-black tracking-widest mb-6">
                      <ExternalLink className="w-3 h-3" /> 数据洞察
                    </div>
                    <h3 className="text-xl font-black mb-4 leading-tight">每日 AI 脉动分析</h3>
                    <p className="text-xs font-bold leading-relaxed mb-8 opacity-90">系统通过本地预置引擎模拟全球热点，为您展示最具价值的行业走向。</p>
                    <button onClick={() => setRefreshTrigger(t => t + 1)} className="inline-flex items-center justify-center w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all shadow-xl">
                      强制刷新引擎 <ArrowUpRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white border border-slate-800 shadow-sm relative overflow-hidden">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Activity className="w-3 h-3 text-indigo-400" /> 用户交互汇总
                   </h4>
                   <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                      <div className="bg-slate-800/50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">总浏览量</p>
                        <p className="text-xl font-black text-white tabular-nums">
                          {(Object.values(stats) as {views: number}[]).reduce((acc, curr) => acc + curr.views, 0)}
                        </p>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-2xl">
                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">资讯热度</p>
                        <p className="text-xl font-black text-indigo-400 tabular-nums">
                          {report?.highlights.length ? Math.round((Object.values(stats) as {views: number}[]).reduce((acc, curr) => acc + curr.views, 0) / report.highlights.length) : 0}
                        </p>
                      </div>
                   </div>
                   <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black transition-colors uppercase tracking-widest shadow-lg shadow-indigo-600/20">
                     订阅技术快报
                   </button>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 dark:border-slate-900 mt-20 text-center text-slate-400">
         <span className="text-[10px] font-black tracking-widest uppercase">AI DAILY PULSE &copy; {new Date().getFullYear()} · 离线新闻门户</span>
      </footer>
    </div>
  );
};

export default App;
