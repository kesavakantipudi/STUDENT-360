import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { mockResults, mockStudents } from '../../data/mockData';
import { formatDate, getGradeColor } from '../../utils/helpers';
import { generateInitials, getAvatarColor } from '../../utils/helpers';
import { Download, CheckCircle } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { exportToCSV } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function AdminResults() {
  const [loading, setLoading] = useState(true);
  const [results] = useState(mockResults);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  if (loading) return <LoadingSkeleton type="table" rows={5} />;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Results Management</h1>
          <p className="text-base mt-1.5" style={{ color: '#71717a' }}>{results.length} result records</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => exportToCSV(results, 'results')}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
            <Download size={15} /> Export
          </button>
          <button onClick={() => toast.success('Results published to all students!')}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)' }}>
            <CheckCircle size={15} /> Publish Results
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#121212', border: '1px solid #27272a' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#0a0a0a' }}>
                {['Student', 'Subject', 'Marks', 'Total', 'Percentage', 'Grade', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#71717a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const student = mockStudents.find(s => s.id === r.studentId);
                const color = getGradeColor(r.grade);
                return (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-white/5 transition-all" style={{ borderBottom: '1px solid #27272a' }}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: getAvatarColor(student?.name || '') }}>
                          {generateInitials(student?.name || '?')}
                        </div>
                        <span className="text-sm font-semibold text-white">{student?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#a1a1aa' }}>{r.subject}</td>
                    <td className="px-6 py-5 text-sm font-bold text-white">{r.marks}</td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#71717a' }}>{r.totalMarks}</td>
                    <td className="px-6 py-5 text-sm font-bold" style={{ color }}>{r.percentage}%</td>
                    <td className="px-6 py-5">
                      <span className="text-sm px-3 py-1.5 rounded-full font-bold" style={{ background: `${color}20`, color }}>{r.grade}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm px-3 py-1.5 rounded-full font-semibold status-active">Passed</span>
                    </td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#71717a' }}>{formatDate(r.date)}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
