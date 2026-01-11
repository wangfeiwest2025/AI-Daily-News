
import React from 'react';
import { NewsItem } from '../types';
import { ChevronRight, Clock, Sparkles } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onClick?: (news: NewsItem) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  return (
    <div 
      onClick={() => onClick?.(news)}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 group flex items-start gap-4 cursor-pointer relative shadow-sm hover:shadow-xl"
    >
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[9px] font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {news.category}
          </span>
          {news.impact === 'High' && (
            <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 px-2 py-0.5 rounded-full text-[8px] font-black">
              <Sparkles className="w-2.5 h-2.5" /> 核心
            </span>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {news.title}
        </h3>
        
        <div className="mt-4 flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> {news.source}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {news.time}</span>
        </div>
      </div>
      
      <div className="flex-shrink-0 self-center">
        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
