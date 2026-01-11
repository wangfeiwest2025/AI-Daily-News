
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TRAFFIC_KEY = 'ai_portal_daily_traffic';

const TrafficChart: React.FC = () => {
  // 从 localStorage 获取真实浏览历史，如果没有则初始化为空
  const data = useMemo(() => {
    const savedTraffic = localStorage.getItem(TRAFFIC_KEY);
    const trafficMap = savedTraffic ? JSON.parse(savedTraffic) : {};
    
    // 生成过去 7 天的列表，确保即便没数据也显示 0
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      
      return {
        name: label,
        fullDate: dateStr,
        views: trafficMap[dateStr] || 0, // 真实数据，缺失则为0
      };
    });
  }, []);

  return (
    <div className="h-48 w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} 
          />
          <YAxis hide domain={[0, 'auto']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: 'none', 
              borderRadius: '12px',
              fontSize: '12px',
              color: '#fff' 
            }}
            itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
            cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
            formatter={(value: number) => [`${value} 次浏览`, '浏览量']}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke="#4f46e5" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorViews)" 
            animationDuration={1000}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;
