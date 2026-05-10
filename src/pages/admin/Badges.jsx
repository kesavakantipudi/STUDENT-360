import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateInitials, getAvatarColor } from '../../utils/helpers';
import { Trophy, Star, Plus } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import toast from 'react-hot-toast';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const BADGES = [
  { id: 'b1', name: 'Algorithm Pro', icon: '🧠', color: '#f59e0b' },
  { id: 'b2', name: 'Code Ninja', icon: '🥷', color: '#10b981' },
  { id: 'b3', name: 'Top Performer', icon: '⭐', color: '#f97316' },
  { id: 'b4', name: 'Database Guru', icon: '🗄️', color: '#06b6d4' },
  { id: 'b5', name: 'Web Master', icon: '🌐', color: '#8b5cf6' },
];

export default function AdminBadges() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [awardedList, setAwardedList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studSnap = await getDocs(collection(db, 'students'));
        setStudents(studSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
        const awSnap = await getDocs(collection(db, 'awardedBadges'));
        setAwardedList(awSnap.docs.map(d => d.data()));
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const awardBadge = async (studentId, badgeId) => {
    const already = awardedList.find(a => a.studentId === studentId && a.badgeId === badgeId);
    if (already) { toast.error('Badge already awarded'); return; }
    try {
      const id = `${studentId}_${badgeId}`;
      const payload = { studentId, badgeId, awardedDate: new Date().toISOString().slice(0, 10) };
      await setDoc(doc(db, 'awardedBadges', id), payload);
      setAwardedList(p => [...p, payload]);
      const badge = BADGES.find(b => b.id === badgeId);
      toast.success(`${badge?.name} awarded!`);
    } catch (e) {
      toast.error('Error awarding badge');
    }
  };

  if (loading) return <LoadingSkeleton type="card" />;

  const eligibleStudents = students.filter(s => (parseFloat(s.btech) || 0) >= 80);

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
          {BADGES.map((badge, i) => (
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
          {students.slice(0, 10).map((student, i) => {
            const studentAwards = awardedList.filter(a => a.studentId === student.id);
            const studentBadges = studentAwards.map(a => BADGES.find(b => b.id === a.badgeId)).filter(Boolean);
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
                  <p className="font-medium text-white text-sm">{student.name || student.rollNo || 'Student'}</p>
                  <p className="text-xs" style={{ color: '#71717a' }}>{student.rollNo} · B.Tech: {student.btech || 0}%</p>
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
                      {BADGES.map(b => (
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
