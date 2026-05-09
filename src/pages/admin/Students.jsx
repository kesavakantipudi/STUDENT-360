import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Download, X, Save } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { mockStudents } from '../../data/mockData';
import { generateInitials, getAvatarColor, exportToCSV, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const DEPTS = ['All', 'Computer Science', 'Information Technology', 'Electronics', 'Mechanical'];

export default function AdminStudents() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState(mockStudents);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const PER_PAGE = 6;

  useEffect(() => { const t = setTimeout(() => setLoading(false), 800); return () => clearTimeout(t); }, []);

  const filtered = students.filter(s =>
    (dept === 'All' || s.department === dept) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNumber.toLowerCase().includes(search.toLowerCase()))
  );
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleDelete = (id) => { setStudents(prev => prev.filter(s => s.id !== id)); setDeleteConfirm(null); toast.success('Student removed'); };

  const handleSave = (data) => {
    if (editStudent?.id) {
      setStudents(prev => prev.map(s => s.id === editStudent.id ? { ...s, ...data } : s));
      toast.success('Student updated');
    } else {
      setStudents(prev => [...prev, { ...data, id: `s${Date.now()}`, status: 'active', joinDate: new Date().toISOString().slice(0, 10), skills: [] }]);
      toast.success('Student added');
    }
    setModalOpen(false); setEditStudent(null);
  };

  if (loading) return <LoadingSkeleton type="table" rows={6} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Student Management</h1>
          <p className="page-subtitle">{filtered.length} students total</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <button onClick={() => exportToCSV(students, 'students')} className="btn btn-ghost">
            <Download size={14} /> Export
          </button>
          <button onClick={() => { setEditStudent(null); setModalOpen(true); }} className="btn btn-primary">
            <Plus size={14} /> Add Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', minWidth: 240 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or roll number…"
            className="input" style={{ paddingLeft: 36 }} />
        </div>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {DEPTS.map(d => (
            <button key={d} onClick={() => { setDept(d); setPage(1); }}
              className="btn"
              style={dept === d
                ? { background: 'rgba(249, 115, 22,0.15)', color: '#fdba74', border: '1px solid rgba(249, 115, 22,0.35)', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }
                : { background: 'transparent', color: '#71717a', border: '1px solid #27272a', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }
              }>{d}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <div className="table-scroll">
          <table className="w-full">
            <thead>
              <tr>
                {['Student', 'Roll No.', 'Department', 'Year', 'CGPA', 'Status', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paged.map((s, i) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: getAvatarColor(s.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {generateInitials(s.name)}
                        </div>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fafafa' }}>{s.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#71717a', marginTop: 2 }}>{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{s.rollNumber}</td>
                    <td>{s.department}</td>
                    <td>Year {s.year}</td>
                    <td><span style={{ fontWeight: 700, color: s.cgpa >= 9 ? '#10b981' : s.cgpa >= 8 ? '#f97316' : '#f59e0b' }}>{s.cgpa}</span></td>
                    <td><span className={s.status === 'active' ? 'status-active' : 'status-pending'}>{s.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem' }}>
                        <button onClick={() => { setEditStudent(s); setModalOpen(true); }}
                          style={{ width: 30, height: 30, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(249, 115, 22,0.1)', color: '#fdba74', border: 'none', cursor: 'pointer' }}><Edit2 size={13} /></button>
                        <button onClick={() => setDeleteConfirm(s.id)}
                          style={{ width: 30, height: 30, borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {paged.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16 text-base" style={{ color: '#71717a' }}>No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="table-pagination">
            <span>Page {page} of {totalPages}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Previous</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-ghost" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && <StudentModal student={editStudent} onClose={() => { setModalOpen(false); setEditStudent(null); }} onSave={handleSave} />}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()} className="rounded-2xl p-8 max-w-sm w-full"
              style={{ background: '#121212', border: '1px solid #27272a' }}>
              <h3 className="font-bold text-lg text-white mb-3">Remove Student?</h3>
              <p className="text-base mb-7" style={{ color: '#71717a' }}>This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl text-sm font-medium"
                  style={{ background: '#1c1917', color: '#a1a1aa' }}>Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#ef4444' }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState({
    name: student?.name || '', email: student?.email || '', rollNumber: student?.rollNumber || '',
    department: student?.department || 'Computer Science', year: student?.year || 1,
    cgpa: student?.cgpa || 0, phone: student?.phone || '', githubUsername: student?.githubUsername || '',
  });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()} className="rounded-2xl p-8 w-full max-w-lg"
        style={{ background: '#121212', border: '1px solid #27272a' }}>
        <div className="flex items-center justify-between mb-7">
          <h3 className="font-bold text-lg text-white">{student ? 'Edit Student' : 'Add New Student'}</h3>
          <button onClick={onClose} style={{ color: '#71717a' }}><X size={20} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', col: 2 },
            { label: 'Email', key: 'email', type: 'email', col: 2 },
            { label: 'Roll Number', key: 'rollNumber', type: 'text', col: 1 },
            { label: 'Phone', key: 'phone', type: 'text', col: 1 },
            { label: 'GitHub Username', key: 'githubUsername', type: 'text', col: 1 },
            { label: 'CGPA', key: 'cgpa', type: 'number', col: 1 },
          ].map(f => (
            <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={set(f.key)}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>Department</label>
            <select value={form.department} onChange={set('department')} className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }}>
              {DEPTS.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>Year</label>
            <select value={form.year} onChange={set('year')} className="w-full px-4 py-3 rounded-xl text-sm"
              style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }}>
              {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: '#1c1917', color: '#a1a1aa' }}>Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)' }}>
            <Save size={15} /> {student ? 'Update' : 'Add Student'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
