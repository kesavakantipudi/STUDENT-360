import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/shared/StatCard';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { mockStudents, mockExams, mockViolations, mockDepartmentData } from '../../data/mockData';
import { generateInitials, getAvatarColor } from '../../utils/helpers';

const ChartTip = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div style={{ background: '#1c1917', border: '1px solid #3f3f46', borderRadius: '0.625rem', padding: '0.625rem 0.875rem', fontSize: '0.8125rem' }}>
      <p style={{ fontWeight: 600, color: '#fafafa', marginBottom: 4 }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  ) : null;

const DEPT_COLORS = ['#f97316', '#f59e0b', '#06b6d4', '#10b981', '#f59e0b'];

const recentActivity = [
  { text: 'OS Exam results published for CS dept', time: '10m ago', color: '#10b981' },
  { text: 'Rohan Mehta joined Computer Science', time: '2h ago', color: '#f97316' },
  { text: 'Violation reported — Vikram Gupta', time: '5h ago', color: '#ef4444' },
  { text: 'Meera Pillai earned Algorithm Champion', time: '1d ago', color: '#f59e0b' },
  { text: 'Web Technologies exam scheduled June 1', time: '2d ago', color: '#06b6d4' },
];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const topStudents = [...mockStudents].sort((a, b) => b.cgpa - a.cgpa).slice(0, 5);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <LoadingSkeleton type="card" />
      <LoadingSkeleton type="table" rows={5} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Institution-wide analytics and overview</p>
        </div>
        <span className="badge badge-violet" style={{ padding: '0.375rem 0.875rem', fontSize: '0.8125rem' }}>⚙️ Admin Mode</span>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard title="Total Students"  value={mockStudents.length}                              subtitle="All departments"  icon={Users}         color="#f97316" trend="up"   trendValue="+12"   delay={0}    />
        <StatCard title="Active Exams"    value={mockExams.filter(e=>e.status==='upcoming').length} subtitle="This week"       icon={BookOpen}      color="#10b981" trend="up"   trendValue="3 due" delay={0.08} />
        <StatCard title="Violations"      value={mockViolations.length}                            subtitle="2 high severity"  icon={AlertTriangle} color="#ef4444" trend="down" trendValue="-2"    delay={0.16} />
        <StatCard title="Avg CGPA"        value="8.48"                                             subtitle="All departments"  icon={TrendingUp}    color="#f59e0b" trend="up"   trendValue="+0.2"  delay={0.24} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Department Overview</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockDepartmentData} barGap={4} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="department" stroke="#334155" tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis stroke="#334155" tick={{ fontSize: 11, fill: '#71717a' }} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="students" name="Students" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="placed"   name="Placed"   fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <span className="chart-title">Distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={mockDepartmentData} dataKey="students" nameKey="department" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
                {mockDepartmentData.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<ChartTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.875rem' }}>
            {mockDepartmentData.map((d, i) => (
              <div key={d.department} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: DEPT_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{d.department}</span>
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fafafa' }}>{d.students}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Top performers */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.125rem' }}>
            <span className="card-title">Top Performers</span>
            <button style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topStudents.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, width: 20, textAlign: 'center', color: i === 0 ? '#f59e0b' : '#475569', flexShrink: 0 }}>#{i+1}</span>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: getAvatarColor(s.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {generateInitials(s.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fafafa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#71717a' }}>{s.department}</p>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981', flexShrink: 0 }}>{s.cgpa}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="card">
          <span className="card-title" style={{ display: 'block', marginBottom: '1.125rem' }}>Recent Activity</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, marginTop: 5, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8125rem', color: '#fafafa', lineHeight: 1.4 }}>{item.text}</p>
                  <p style={{ fontSize: '0.6875rem', color: '#475569', marginTop: 2 }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
