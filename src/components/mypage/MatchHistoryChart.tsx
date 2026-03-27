'use client';

import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, Target } from 'lucide-react';

// Mock data - In real implementation, this would come from an API
const MOCK_MATCH_HISTORY = [
  { date: '2024-03-15', elo: 1200, win: true },
  { date: '2024-03-16', elo: 1225, win: true },
  { date: '2024-03-17', elo: 1210, win: false },
  { date: '2024-03-18', elo: 1240, win: true },
  { date: '2024-03-19', elo: 1265, win: true },
  { date: '2024-03-20', elo: 1250, win: false },
  { date: '2024-03-21', elo: 1280, win: true },
  { date: '2024-03-22', elo: 1310, win: true },
  { date: '2024-03-23', elo: 1300, win: false },
  { date: '2024-03-24', elo: 1330, win: true },
];

export default function MatchHistoryChart() {
  const { t } = useTranslation();

  const chartData = useMemo(() => {
    return MOCK_MATCH_HISTORY.map(item => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    }));
  }, []);

  const stats = useMemo(() => {
    const total = MOCK_MATCH_HISTORY.length;
    const wins = MOCK_MATCH_HISTORY.filter(m => m.win).length;
    const winRate = ((wins / total) * 100).toFixed(1);
    const currentElo = MOCK_MATCH_HISTORY[MOCK_MATCH_HISTORY.length - 1].elo;
    const startElo = MOCK_MATCH_HISTORY[0].elo;
    const eloChange = currentElo - startElo;

    return { total, wins, winRate, currentElo, eloChange };
  }, []);

  return (
    <div className="w-full glass-card p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neon-cyan/10 rounded-xl neon-glow-cyan">
            <TrendingUp className="text-neon-cyan" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{t("mypage.chart.title") || "Performance Trends"}</h2>
            <p className="text-sm text-white/50 font-medium">{t("mypage.chart.subtitle") || "Match record and ELO progress"}</p>
          </div>
        </div>

        <div className="flex gap-8 items-center bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">{t("mypage.chart.winRate") || "Win Rate"}</p>
                <p className="text-2xl font-black text-white">{stats.winRate}%</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">{t("mypage.chart.currentElo") || "Current ELO"}</p>
                <p className="text-2xl font-black text-neon-cyan text-glow">
                    {stats.currentElo}
                    <span className={stats.eloChange >= 0 ? "text-green-400 text-xs ml-2 font-bold" : "text-red-400 text-xs ml-2 font-bold"}>
                        {stats.eloChange >= 0 ? `+${stats.eloChange}` : stats.eloChange}
                    </span>
                </p>
            </div>
        </div>
      </div>

      <div className="h-[320px] w-full pt-4 relative">
        {/* Subtle Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-neon-cyan/5 blur-[100px] -z-10" />
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis 
              dataKey="displayDate" 
              stroke="#ffffff30" 
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
              dy={15}
            />
            <YAxis 
              stroke="#ffffff30" 
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 30', 'dataMax + 30']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#050506', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                color: '#fff'
              }}
              itemStyle={{ color: '#00f3ff', fontWeight: 900 }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="elo" 
              stroke="#00f3ff" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorElo)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="glass-morphism rounded-2xl p-5 flex items-center gap-5 hover:border-white/20 hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                  <Award size={24} />
              </div>
              <div>
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.chart.totalWins") || "Total Wins"}</p>
                  <p className="text-xl font-black text-white">{stats.wins}</p>
              </div>
          </div>
          <div className="glass-morphism rounded-2xl p-5 flex items-center gap-5 hover:border-white/20 hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <Target size={24} />
              </div>
              <div>
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.chart.totalMatches") || "Total Matches"}</p>
                  <p className="text-xl font-black text-white">{stats.total}</p>
              </div>
          </div>
          <div className="glass-morphism rounded-2xl p-5 flex items-center gap-5 hover:border-white/20 hover:scale-105 transition-all">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center text-neon-purple border border-neon-purple/20 shadow-[0_0_15px_rgba(178,58,255,0.2)]">
                  <TrendingUp size={24} />
              </div>
              <div>
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{t("mypage.chart.peakPerformance") || "Peak ELO"}</p>
                  <p className="text-xl font-black text-white">{Math.max(...MOCK_MATCH_HISTORY.map(m => m.elo))}</p>
              </div>
          </div>
      </div>
    </div>
  );
}
