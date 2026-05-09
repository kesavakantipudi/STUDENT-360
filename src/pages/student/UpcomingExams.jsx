import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, ExternalLink, ChevronRight, AlertCircle } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { mockExams } from '../../data/mockData';
import { formatDate, getDaysUntil, getDifficultyColor } from '../../utils/helpers';

const CountdownBadge = ({ days }) => {
  const color = days <= 3 ? '#ef4444' : days <= 7 ? '#f59e0b' : '#f97316';
  const label = days < 0 ? 'Past' : days === 0 ? 'Today!' : `${days}d left`;
  return (
    <span className="text-sm px-3 py-1.5 rounded-full font-semibold" style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
      {label}
    </span>
  );
};

export default function UpcomingExamsPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const upcomingExams = mockExams.filter(e => e.status === 'upcoming' || e.status === 'scheduled');
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);
  if (loading) return <LoadingSkeleton type="list" rows={5} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Upcoming Exams</h1>
          <p className="text-base mt-1.5" style={{ color: '#71717a' }}>Scheduled examinations and important dates</p>
        </div>
        <div className="flex items-center gap-2">
          {['all', 'upcoming', 'scheduled'].map(f => (
            <button
              key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={filter === f
                ? { background: 'rgba(249, 115, 22,0.18)', color: '#fdba74', border: '1px solid rgba(249, 115, 22,0.4)' }
                : { color: '#71717a', border: '1px solid #27272a' }
              }
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Alert */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex items-start gap-4 px-6 py-5 rounded-2xl"
        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)' }}>
        <AlertCircle size={18} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="font-semibold text-sm" style={{ color: '#f59e0b' }}>Exam Season Approaching</p>
          <p className="text-sm mt-1" style={{ color: '#b45309' }}>You have {upcomingExams.length} exams in the next 30 days. Stay prepared!</p>
        </div>
      </motion.div>

      {/* Exam cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {upcomingExams
          .filter(e => filter === 'all' || e.status === filter)
          .map((exam, i) => {
            const days = getDaysUntil(exam.date);
            const diffColor = getDifficultyColor(exam.difficulty);
            return (
              <motion.div
                key={exam.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -2 }}
                className="rounded-2xl p-7 cursor-pointer transition-all"
                style={{ background: '#121212', border: '1px solid #27272a' }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(249, 115, 22,0.15)' }}>
                      <BookOpen size={22} style={{ color: '#fdba74' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{exam.title}</h3>
                      <p className="text-sm mt-1" style={{ color: '#71717a' }}>{exam.subject} &middot; {exam.department}</p>
                    </div>
                  </div>
                  <CountdownBadge days={days} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={15} style={{ color: '#71717a' }} />
                    <span className="text-sm" style={{ color: '#a1a1aa' }}>{formatDate(exam.date)}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} style={{ color: '#71717a' }} />
                    <span className="text-sm" style={{ color: '#a1a1aa' }}>{exam.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 mb-5">
                  <span className="text-sm px-3 py-1 rounded-full" style={{ background: `${diffColor}20`, color: diffColor }}>{exam.difficulty}</span>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#a1a1aa' }}>{exam.totalMarks} marks</span>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#a1a1aa' }}>{exam.duration}</span>
                </div>

                <div className="pt-4" style={{ borderTop: '1px solid #27272a' }}>
                  <p className="text-sm mb-2.5" style={{ color: '#71717a' }}>Syllabus: <span style={{ color: '#a1a1aa' }}>{exam.syllabus}</span></p>
                  <a href={exam.examLink} className="flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: '#f97316' }}>
                    <ExternalLink size={14} /> Access Exam Portal
                  </a>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Tips */}
      <div className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
        <h3 className="font-semibold text-base text-white mb-5">📚 Preparation Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { tip: 'Start revisions at least 2 weeks before the exam date', color: '#f97316' },
            { tip: 'Practice previous year papers for better performance', color: '#10b981' },
            { tip: 'Focus on high-weight topics from the syllabus', color: '#f59e0b' },
          ].map((t, i) => (
            <div key={i} className="p-5 rounded-xl flex items-start gap-3" style={{ background: `${t.color}0d`, border: `1px solid ${t.color}28` }}>
              <ChevronRight size={15} style={{ color: t.color, flexShrink: 0, marginTop: 2 }} />
              <p className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>{t.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
