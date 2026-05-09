import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Clock, BookOpen, Edit2, Trash2, X, Save } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { mockExams } from '../../data/mockData';
import { formatDate, getDifficultyColor, getExamStatusColor } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminExams() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState(mockExams);
  const [modalOpen, setModalOpen] = useState(false);
  const [editExam, setEditExam] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const filtered = exams.filter(e => filter === 'all' || e.status === filter);

  const handleDelete = (id) => { setExams(p => p.filter(e => e.id !== id)); toast.success('Exam removed'); };

  const handleSave = (data) => {
    if (editExam?.id) {
      setExams(p => p.map(e => e.id === editExam.id ? { ...e, ...data } : e));
      toast.success('Exam updated');
    } else {
      setExams(p => [...p, { ...data, id: `e${Date.now()}`, examLink: '#' }]);
      toast.success('Exam scheduled');
    }
    setModalOpen(false); setEditExam(null);
  };

  if (loading) return <LoadingSkeleton type="list" rows={5} />;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Exam Management</h1>
          <p className="text-base mt-1.5" style={{ color: '#71717a' }}>{exams.length} exams scheduled</p>
        </div>
        <button onClick={() => { setEditExam(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>
          <Plus size={16} /> Schedule Exam
        </button>
      </div>

      <div className="flex gap-2.5">
        {['all', 'upcoming', 'scheduled', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
            style={filter === f
              ? { background: 'rgba(249, 115, 22,0.2)', color: '#fdba74', border: '1px solid rgba(249, 115, 22,0.4)' }
              : { color: '#71717a', border: '1px solid #27272a' }
            }>{f}</button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((exam, i) => {
            const diffColor = getDifficultyColor(exam.difficulty);
            const statusColor = getExamStatusColor(exam.status);
            return (
              <motion.div key={exam.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(249, 115, 22,0.12)' }}>
                      <BookOpen size={24} style={{ color: '#fdba74' }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white">{exam.title}</h3>
                      <p className="text-sm mt-1.5" style={{ color: '#71717a' }}>{exam.subject} &middot; {exam.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm px-3 py-1.5 rounded-full font-semibold capitalize"
                      style={{ background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40` }}>
                      {exam.status}
                    </span>
                    <span className="text-sm px-3 py-1.5 rounded-full font-semibold"
                      style={{ background: `${diffColor}20`, color: diffColor }}>
                      {exam.difficulty}
                    </span>
                    <button onClick={() => { setEditExam(exam); setModalOpen(true); }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-blue-500/20 transition-all"
                      style={{ color: '#f97316' }}><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(exam.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-all"
                      style={{ color: '#ef4444' }}><Trash2 size={15} /></button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5 mt-5">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={15} style={{ color: '#71717a' }} />
                    <span className="text-sm" style={{ color: '#a1a1aa' }}>{formatDate(exam.date)}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} style={{ color: '#71717a' }} />
                    <span className="text-sm" style={{ color: '#a1a1aa' }}>{exam.time} &middot; {exam.duration}</span>
                  </div>
                  <span className="text-sm" style={{ color: '#71717a' }}>Total: {exam.totalMarks} marks</span>
                </div>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: '#475569' }}>
                  <span style={{ color: '#71717a' }}>Syllabus: </span>{exam.syllabus}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {modalOpen && <ExamModal exam={editExam} onClose={() => { setModalOpen(false); setEditExam(null); }} onSave={handleSave} />}
      </AnimatePresence>
    </div>
  );
}

function ExamModal({ exam, onClose, onSave }) {
  const [form, setForm] = useState({
    title: exam?.title || '', subject: exam?.subject || '', department: exam?.department || 'Computer Science',
    date: exam?.date || '', time: exam?.time || '', duration: exam?.duration || '2 hours',
    totalMarks: exam?.totalMarks || 100, difficulty: exam?.difficulty || 'Medium',
    status: exam?.status || 'upcoming', syllabus: exam?.syllabus || '',
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()} className="rounded-2xl p-8 w-full max-w-lg"
        style={{ background: '#121212', border: '1px solid #27272a' }}>
        <div className="flex items-center justify-between mb-7">
          <h3 className="font-bold text-lg text-white">{exam ? 'Edit Exam' : 'Schedule Exam'}</h3>
          <button onClick={onClose} style={{ color: '#71717a' }}><X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>Exam Title</label>
            <input value={form.title} onChange={set('title')} className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }} />
          </div>
          {[['Subject', 'subject'], ['Date', 'date', 'date'], ['Time', 'time', 'time'], ['Duration', 'duration'], ['Total Marks', 'totalMarks', 'number']].map(([lbl, key, type]) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>{lbl}</label>
              <input type={type || 'text'} value={form[key]} onChange={set(key)}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>Difficulty</label>
            <select value={form.difficulty} onChange={set('difficulty')} className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }}>
              {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>Syllabus Topics</label>
            <input value={form.syllabus} onChange={set('syllabus')} className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }} />
          </div>
        </div>
        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: '#1c1917', color: '#a1a1aa' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>
            <Save size={15} /> {exam ? 'Update' : 'Schedule'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
