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
    <div className="w-full bg-deep-black/50 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neon-cyan/10 rounded-lg">
            <TrendingUp className="text-neon-cyan" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t("mypage.chart.title") || "Performance Trends"}</h2>
            <p className="text-sm text-muted-foreground">{t("mypage.chart.subtitle") || "Match record and ELO progress"}</p>
          </div>
        </div>

        <div className="flex gap-6 items-center">
            <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("mypage.chart.winRate") || "Win Rate"}</p>
                <p className="text-xl font-black text-white">{stats.winRate}%</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("mypage.chart.currentElo") || "Current ELO"}</p>
                <p className="text-xl font-black text-neon-cyan">
                    {stats.currentElo}
                    <span className={stats.eloChange >= 0 ? "text-green-500 text-xs ml-1" : "text-red-500 text-xs ml-1"}>
                        {stats.eloChange >= 0 ? `+${stats.eloChange}` : stats.eloChange}
                    </span>
                </p>
            </div>
        </div>
      </div>

      <div className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorElo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="displayDate" 
              stroke="#ffffff40" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#ffffff40" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0a0a0a', 
                border: '1px solid #ffffff20',
                borderRadius: '12px',
                color: '#fff'
              }}
              itemStyle={{ color: '#00f3ff' }}
            />
            <Area 
              type="monotone" 
              dataKey="elo" 
              stroke="#00f3ff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorElo)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <Award size={20} />
              </div>
              <div>
                  <p className="text-xs text-muted-foreground">{t("mypage.chart.totalWins") || "Total Wins"}</p>
                  <p className="text-lg font-bold text-white">{stats.wins}</p>
              </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                  <Target size={20} />
              </div>
              <div>
                  <p className="text-xs text-muted-foreground">{t("mypage.chart.totalMatches") || "Total Matches"}</p>
                  <p className="text-lg font-bold text-white">{stats.total}</p>
              </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <TrendingUp size={20} />
              </div>
              <div>
                  <p className="text-xs text-muted-foreground">{t("mypage.chart.peakPerformance") || "Peak ELO"}</p>
                  <p className="text-lg font-bold text-white">{Math.max(...MOCK_MATCH_HISTORY.map(m => m.elo))}</p>
              </div>
          </div>
      </div>
    </div>
  );
}
