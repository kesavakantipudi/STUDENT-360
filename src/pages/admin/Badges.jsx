import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockStudents, mockResults, mockBadges, mockStudentBadges } from '../../data/mockData';
import { generateInitials, getAvatarColor, formatDate } from '../../utils/helpers';
import { Trophy, Star, Plus } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function AdminBadges() {
  const [loading, setLoading] = useState(true);
  const [awardedList, setAwardedList] = useState(mockStudentBadges);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const awardBadge = (studentId, badgeId) => {
    const already = awardedList.find(a => a.studentId === studentId && a.badgeId === badgeId);
    if (already) { toast.error('Badge already awarded'); return; }
    setAwardedList(p => [...p, { studentId, badgeId, awardedDate: new Date().toISOString().slice(0, 10), examScore: 85 }]);
    const badge = mockBadges.find(b => b.id === badgeId);
    toast.success(`${badge?.name} awarded!`);
  };

  if (loading) return <LoadingSkeleton type="card" />;

  const eligibleStudents = mockStudents.filter(s => {
    const results = mockResults.filter(r => r.studentId === s.id && parseFloat(r.percentage) >= 80);
    return results.length > 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Badge Management</h1>
        <p className="text-sm mt-1" style={{ color: '#71717a' }}>Auto-award and manage student achievement badges</p>
      </div>

      {/* Rule card */}
      <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
        <Star size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Auto-Award Rule</p>
          <p className="text-xs mt-0.5" style={{ color: '#92400e' }}>Students who score 80% or more in any exam are automatically eligible for the corresponding badge.</p>
        </div>
      </div>

      {/* Badge catalog */}
      <div>
        <h3 className="font-semibold text-white mb-3">Badge Catalog</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {mockBadges.map((badge, i) => (
            <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-4 text-center"
              style={{ background: `${badge.color}10`, border: `1px solid ${badge.color}30` }}>
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-xs font-semibold text-white">{badge.name}</p>
              <p className="text-xs mt-1" style={{ color: '#71717a' }}>{awardedList.filter(a => a.badgeId === badge.id).length} awarded</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Student badge assignments */}
      <div>
        <h3 className="font-semibold text-white mb-3">Student Badge Assignments</h3>
        <div className="space-y-3">
          {mockStudents.slice(0, 6).map((student, i) => {
            const studentAwards = awardedList.filter(a => a.studentId === student.id);
            const studentBadges = studentAwards.map(a => mockBadges.find(b => b.id === a.badgeId)).filter(Boolean);
            const isEligible = eligibleStudents.find(e => e.id === student.id);

            return (
              <motion.div key={student.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: '#121212', border: '1px solid #27272a' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: getAvatarColor(student.name) }}>
                  {generateInitials(student.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{student.name}</p>
                  <p className="text-xs" style={{ color: '#71717a' }}>{student.rollNumber} · CGPA: {student.cgpa}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {studentBadges.map(b => (
                    <span key={b.id} title={b.name} className="text-lg cursor-default" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                      {b.icon}
                    </span>
                  ))}
                  {studentBadges.length === 0 && (
                    <span className="text-xs" style={{ color: '#475569' }}>No badges yet</span>
                  )}
                </div>
                {isEligible && (
                  <div className="relative group">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <Plus size={12} /> Award Badge
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-44 rounded-xl overflow-hidden z-10 hidden group-hover:block"
                      style={{ background: '#1c1917', border: '1px solid #3f3f46', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                      {mockBadges.slice(0, 5).map(b => (
                        <button key={b.id} onClick={() => awardBadge(student.id, b.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-all text-left">
                          <span>{b.icon}</span>
                          <span className="text-xs text-white">{b.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
