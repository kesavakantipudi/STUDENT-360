import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Award, BookOpen } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { mockScoreData, mockPerformanceData } from '../../data/mockData';
import { getGradeColor } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-4 text-sm" style={{ background: '#1c1917', border: '1px solid #3f3f46' }}>
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

const semesterComparison = [
  { subject: 'DSA', sem5: 80, sem6: 88 },
  { subject: 'DBMS', sem5: 70, sem6: 78 },
  { subject: 'OS', sem5: 75, sem6: 88 },
  { subject: 'CN', sem5: 60, sem6: 87 },
  { subject: 'ML', sem5: 78, sem6: 84 },
  { subject: 'WT', sem5: 65, sem6: 91 },
];

export default function ScoresPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);
  if (loading) return <LoadingSkeleton type="table" rows={6} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Scores</h1>
        <p className="text-base mt-1.5" style={{ color: '#71717a' }}>Detailed subject-wise performance breakdown</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Current CGPA', value: '9.2', icon: TrendingUp, color: '#f97316', sub: 'Semester 6' },
          { label: 'Highest Score', value: '91%', icon: Award, color: '#10b981', sub: 'Web Technologies' },
          { label: 'Subjects', value: '6', icon: BookOpen, color: '#f59e0b', sub: 'This semester' },
        ].map((item, i) => (
          <motion.div
            key={item.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${item.color}20` }}>
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#71717a' }}>{item.label}</p>
                <p className="text-2xl font-bold text-white mt-0.5">{item.value}</p>
                <p className="text-xs mt-1" style={{ color: '#475569' }}>{item.sub}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Score bars */}
      <div className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
        <h3 className="font-semibold text-base text-white mb-7">Subject Performance</h3>
        <div className="space-y-6">
          {mockScoreData.map((s, i) => {
            const pct = Math.round((s.marks / s.total) * 100);
            const color = getGradeColor(s.grade);
            return (
              <motion.div key={s.subject} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-white">{s.subject}</span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold" style={{ background: `${color}20`, color }}>{s.grade}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {s.marks}/{s.total} <span className="font-normal" style={{ color: '#71717a' }}>({pct}%)</span>
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1c1917' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
          <h3 className="font-semibold text-base text-white mb-5">Semester Comparison</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={semesterComparison} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="subject" stroke="#475569" tick={{ fontSize: 12 }} tickMargin={8} />
              <YAxis domain={[50, 100]} stroke="#475569" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 13, color: '#a1a1aa', paddingTop: 16 }} />
              <Bar dataKey="sem5" name="Sem 5" fill="#27272a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sem6" name="Sem 6" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
          <h3 className="font-semibold text-base text-white mb-5">CGPA Trend (This Year)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 12 }} tickMargin={8} />
              <YAxis domain={[8, 10]} stroke="#475569" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="cgpa" name="CGPA" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#121212', border: '1px solid #27272a' }}>
        <div className="px-7 py-5" style={{ borderBottom: '1px solid #27272a' }}>
          <h3 className="font-semibold text-base text-white">Score Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#0a0a0a' }}>
                {['Subject', 'Marks Obtained', 'Total Marks', 'Percentage', 'Grade', 'Status'].map(h => (
                  <th key={h} className="text-left px-7 py-4 text-sm font-semibold" style={{ color: '#71717a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockScoreData.map((s, i) => {
                const pct = Math.round((s.marks / s.total) * 100);
                const color = getGradeColor(s.grade);
                return (
                  <tr key={s.subject} className="hover:bg-white/5 transition-all" style={{ borderBottom: i < mockScoreData.length - 1 ? '1px solid #27272a' : 'none' }}>
                    <td className="px-7 py-4 text-sm font-semibold text-white">{s.subject}</td>
                    <td className="px-7 py-4 text-sm text-white">{s.marks}</td>
                    <td className="px-7 py-4 text-sm" style={{ color: '#71717a' }}>{s.total}</td>
                    <td className="px-7 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: '#1c1917' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                        <span className="text-sm text-white">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-7 py-4">
                      <span className="text-xs px-3 py-1.5 rounded-full font-bold" style={{ background: `${color}20`, color }}>{s.grade}</span>
                    </td>
                    <td className="px-7 py-4">
                      <span className="text-xs px-3 py-1.5 rounded-full font-medium status-active">Passed</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
