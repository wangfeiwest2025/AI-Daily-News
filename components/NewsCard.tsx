
import React from 'react';
import { NewsItem } from '../types';
import { ChevronRight, ExternalLink, Clock, Sparkles } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onClick?: (news: NewsItem) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  // 计算大概阅读时长
  const readingTime = Math.ceil(news.summary.length / 100);

  const handleExternalClick = (e: React.MouseEvent) => {
    if (news.url) {
      e.stopPropagation();
      window.open(news.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={() => onClick?.(news)}
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-500 group flex flex-col h-full cursor-pointer relative shadow-sm hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-none"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            {news.category}
          </span>
          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock className="w-3 h-3" /> {readingTime} 分钟阅读
          </span>
        </div>
        {news.impact === 'High' && (
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black animate-pulse">
            <Sparkles className="w-3 h-3" /> 重大突发
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {news.title}
      </h3>
      
      {/* 允许全文展示，不再限制行数 */}
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 whitespace-pre-wrap">
        {news.summary}
      </p>
      
      <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-white border border-slate-700">
            {news.source.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-800 dark:text-slate-200 font-black">{news.source}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{news.time}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {news.url && (
            <button 
              onClick={handleExternalClick}
              className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="阅读原文链接"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
