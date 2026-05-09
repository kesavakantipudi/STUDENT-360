import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, GitFork, Code, TrendingUp, Activity, ExternalLink, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { mockGitHubProfiles } from '../../data/mockData';
import toast from 'react-hot-toast';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Generate fake contribution data
function generateContributions(filter) {
  const data = [];
  const weeks = filter === 'Past Week' ? 1 : filter === 'Past Month' ? 4 : 52;
  
  const currentWeek = Math.floor(weeks * 0.7);
  const currentDay = 3;

  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (w > currentWeek || (w === currentWeek && d > currentDay)) {
        week.push(-1); // Future
      } else {
        const val = Math.random();
        const count = val < 0.4 ? 0 : val < 0.6 ? 1 : val < 0.8 ? 2 : val < 0.9 ? 3 : 4;
        week.push(count);
      }
    }
    data.push(week);
  }
  return data;
}
const contribColors = ['#0a0a0a', '#1e3a5f', '#2563eb', '#3b82f6', '#60a5fa'];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-2.5 text-xs" style={{ background: '#1c1917', border: '1px solid #3f3f46' }}>
        <p className="font-medium text-white">{payload[0].name}: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function GitHubAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Yearly');
  const profile = mockGitHubProfiles['s001'];

  const heatmapData = useMemo(() => generateContributions(timeFilter), [timeFilter]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
    toast.success('GitHub data refreshed!');
  };

  const weeklyData = profile.weeklyCommits.map((v, i) => ({ day: DAYS[i], commits: v }));

  if (loading) return <LoadingSkeleton type="card" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">GitHub Analysis</h1>
          <p className="text-sm mt-1" style={{ color: '#71717a' }}>Repository insights and contribution metrics</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-60"
          style={{ background: 'rgba(249, 115, 22,0.15)', color: '#fdba74', border: '1px solid rgba(249, 115, 22,0.3)' }}
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* GitHub Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(36,36,36,0.8), rgba(18, 18, 18,0.9))', border: '1px solid #3f3f46' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#24292e' }}>
            <GitBranch size={28} color="white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">@{profile.username}</h2>
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank" rel="noreferrer"
              className="text-xs flex items-center gap-1 hover:underline mt-0.5"
              style={{ color: '#f97316' }}
            >
              <ExternalLink size={11} /> View on GitHub
            </a>
          </div>
          <div className="ml-auto grid grid-cols-3 gap-6 text-center hidden sm:grid">
            {[
              { label: 'Repos', value: profile.publicRepos },
              { label: 'Followers', value: profile.followers },
              { label: 'Following', value: profile.following },
            ].map(s => (
              <div key={s.label}>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs" style={{ color: '#71717a' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Commits', value: profile.totalCommits.toLocaleString(), color: '#f97316', icon: Activity },
          { label: 'Contribution Score', value: `${profile.contributionScore}/100`, color: '#10b981', icon: TrendingUp },
          { label: 'Public Repos', value: profile.publicRepos, color: '#f59e0b', icon: GitBranch },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-5"
            style={{ background: '#121212', border: '1px solid #27272a' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: '#71717a' }}>{s.label}</p>
                <p className="text-xl font-bold text-white">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language distribution */}
        <div className="rounded-2xl p-6 flex flex-col" style={{ background: '#121212', border: '1px solid #27272a', minHeight: '320px' }}>
          <h3 className="font-semibold text-white mb-2">Language Distribution</h3>
          <div className="flex-1 mt-2">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie 
                  data={profile.languages} 
                  dataKey="percentage" 
                  nameKey="name" 
                  cx="50%" 
                  cy="45%" 
                  outerRadius={75} 
                  innerRadius={40}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, name, percentage }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius * 1.25;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="#fafafa" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight={500}>
                        {percentage}%
                      </text>
                    );
                  }}
                  labelLine={{ stroke: '#475569', strokeWidth: 1 }}
                >
                  {profile.languages.map((l, i) => <Cell key={i} fill={l.color} />)}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span style={{ color: '#fafafa', fontSize: '11px', fontWeight: 500 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly commits */}
        <div className="lg:col-span-2 rounded-2xl p-6 flex flex-col" style={{ background: '#121212', border: '1px solid #27272a', minHeight: '320px' }}>
          <h3 className="font-semibold text-white mb-6">Weekly Commit Activity</h3>
          <div className="flex-1 mt-2">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" stroke="#475569" tick={{ fontSize: 12 }} tickMargin={8} />
                <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                <Bar dataKey="commits" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Contribution heatmap */}
      <div className="rounded-2xl p-6" style={{ background: '#121212', border: '1px solid #27272a' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-white">Contribution Activity</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs hidden sm:inline" style={{ color: '#71717a' }}>{profile.totalCommits} contributions this year</span>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded outline-none cursor-pointer"
              style={{ background: '#0a0a0a', color: '#fafafa', border: '1px solid #27272a' }}
            >
              <option value="Past Week">Past Week</option>
              <option value="Past Month">Past Month</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-max">
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">
                {week.map((day, di) => (
                  <motion.div
                    key={di}
                    title={day === -1 ? 'Future' : `${day} contributions`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.001 }}
                    className="w-3 h-3 rounded-sm transition-opacity"
                    style={{ 
                      background: day === -1 ? 'transparent' : contribColors[day],
                      border: day === -1 ? '1px solid rgba(71, 85, 105, 0.4)' : '1px solid transparent',
                      cursor: day === -1 ? 'default' : 'pointer'
                    }}
                    whileHover={day !== -1 ? { scale: 1.2 } : {}}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-xs" style={{ color: '#71717a' }}>Less</span>
            {contribColors.map((c, i) => <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />)}
            <span className="text-xs" style={{ color: '#71717a' }}>More</span>
          </div>
        </div>
      </div>

      {/* Top repos */}
      <div>
        <h3 className="font-semibold text-white mb-3">Top Repositories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.topRepos.map((repo, i) => (
            <motion.div
              key={repo.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -2 }}
              className="rounded-xl p-4 cursor-pointer transition-all"
              style={{ background: '#121212', border: '1px solid #27272a' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Code size={15} style={{ color: '#f97316' }} />
                  <span className="font-medium text-sm text-white">{repo.name}</span>
                </div>
                <a href={`https://github.com/${profile.username}/${repo.name}`} target="_blank" rel="noreferrer">
                  <ExternalLink size={13} style={{ color: '#71717a' }} />
                </a>
              </div>
              <p className="text-xs mt-2" style={{ color: '#71717a' }}>{repo.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: repo.language === 'JavaScript' ? '#f1e05a' : repo.language === 'Python' ? '#3572A5' : '#2b7489' }} />
                  <span className="text-xs" style={{ color: '#a1a1aa' }}>{repo.language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} style={{ color: '#f59e0b' }} />
                  <span className="text-xs" style={{ color: '#a1a1aa' }}>{repo.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork size={12} style={{ color: '#71717a' }} />
                  <span className="text-xs" style={{ color: '#a1a1aa' }}>{repo.forks}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
