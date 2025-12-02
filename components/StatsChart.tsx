import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatsChart: React.FC = () => {
  // Simulate real-time data
  const [data, setData] = useState([
    { time: '9:00', productivity: 40 },
    { time: '10:00', productivity: 60 },
    { time: '11:00', productivity: 75 },
    { time: '12:00', productivity: 50 },
    { time: '13:00', productivity: 80 },
    { time: '14:00', productivity: 85 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(currentData => {
        const lastTime = parseInt(currentData[currentData.length - 1].time.split(':')[0]);
        const nextTime = (lastTime + 1) % 24;
        const newPoint = {
          time: `${nextTime}:00`,
          productivity: Math.floor(Math.random() * 40) + 50 // Random value between 50-90
        };
        const newData = [...currentData.slice(1), newPoint];
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-dark-lighter p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Team Productivity</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time velocity tracking</p>
        </div>
        <select className="bg-gray-50 dark:bg-gray-800 border-none text-xs rounded-lg px-3 py-2 text-gray-600 dark:text-gray-300 outline-none">
          <option>Today</option>
          <option>This Week</option>
        </select>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="productivity" 
              stroke="#4f46e5" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProd)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsChart;