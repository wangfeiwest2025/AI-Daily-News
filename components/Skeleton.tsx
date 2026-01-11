
import React from 'react';

export const NewsSkeleton = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 animate-pulse">
    <div className="flex justify-between">
      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-4 w-12 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
    </div>
    <div className="h-7 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-slate-100 dark:bg-slate-700 rounded"></div>
      <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-700 rounded"></div>
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-4 w-10 bg-slate-50 dark:bg-slate-700 rounded"></div>
      <div className="h-4 w-10 bg-slate-50 dark:bg-slate-700 rounded"></div>
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="w-full h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse flex flex-col justify-end p-12 space-y-4">
    <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded"></div>
    <div className="h-12 w-2/3 bg-slate-300 dark:bg-slate-700 rounded"></div>
    <div className="h-20 w-full bg-white/10 rounded-2xl"></div>
  </div>
);
