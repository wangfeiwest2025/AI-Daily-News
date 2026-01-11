
import React from 'react';
import { NewsItem } from '../types';
import { ChevronRight, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onClick?: (news: NewsItem) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  const handleExternalClick = (e: React.MouseEvent) => {
    if (news.url) {
      e.stopPropagation();
      window.open(news.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      onClick={() => onClick?.(news)}
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-500 group flex flex-col h-full cursor-pointer relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest transition-colors">
          {news.category}
        </span>
        {news.url && (
          <button 
            onClick={handleExternalClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-900/30"
            title="阅读原文"
          >
            <ExternalLink className="w-3 h-3" />
            原文
          </button>
        )}
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors relative z-10">
        {news.title}
      </h3>
      
      {/* 移除 line-clamp-3，允许全文展示 */}
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow relative z-10">
        {news.summary}
      </p>
      
      <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
            {news.source.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-800 dark:text-slate-200 font-black">{news.source}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{news.time}</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
