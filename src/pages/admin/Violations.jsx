import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, AlertTriangle, Loader2 } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { formatDate, getSeverityClass, getStatusClass } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const SEVERITIES = ['Low', 'Medium', 'High'];
const PIE_COLORS = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };

export default function AdminViolations() {
  const [loading, setLoading] = useState(true);
  const [violations, setViolations] = useState([]);
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editViolation, setEditViolation] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const snap = await getDocs(collection(db, 'violations'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setViolations(list);
      } catch (err) {
        toast.error("Failed to load violations");
      } finally {
        setLoading(false);
      }
    };
    fetchViolations();
  }, []);

  const filtered = violations.filter(v => filter === 'All' || v.severity === filter);
  
  const handleDelete = async (id) => { 
    setIsDeleting(true);
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'violations', id));
      setViolations(p => p.filter(v => v.id !== id)); 
      toast.success('Violation removed'); 
    } catch (err) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (editViolation?.id) {
        await updateDoc(doc(db, 'violations', editViolation.id), data);
        setViolations(p => p.map(v => v.id === editViolation.id ? { ...v, ...data } : v));
        toast.success('Violation updated');
      } else {
        const newId = `v_${Date.now()}`;
        const finalData = { ...data, studentName: data.rollNumber || 'Unknown Student' };
        await setDoc(doc(db, 'violations', newId), finalData);
        setViolations(p => [...p, { ...finalData, id: newId }]);
        toast.success('Violation added');
      }
      setModalOpen(false); setEditViolation(null);
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton type="table" rows={5} />;

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Violations Management</h1>
          <p className="text-base mt-1.5" style={{ color: '#71717a' }}>{violations.length} records total</p>
        </div>
        <button onClick={() => { setEditViolation(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)' }}>
          <Plus size={16} /> Add Violation
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {SEVERITIES.map((s, i) => {
          const count = violations.filter(v => v.severity === s).length;
          const color = PIE_COLORS[s];
          return (
            <motion.div key={s} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-7 flex items-center gap-5"
              style={{ background: '#121212', border: `1px solid ${color}30` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <AlertTriangle size={22} style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#71717a' }}>{s} Severity</p>
                <p className="text-3xl font-bold text-white mt-0.5">{count}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-2.5">
        {['All', ...SEVERITIES].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={filter === f
              ? { background: 'rgba(249, 115, 22,0.2)', color: '#fdba74', border: '1px solid rgba(249, 115, 22,0.4)' }
              : { color: '#71717a', border: '1px solid #27272a' }
            }>{f}</button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#121212', border: '1px solid #27272a' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#0a0a0a' }}>
                {['Student', 'Roll No.', 'Violation Type', 'Severity', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-semibold" style={{ color: '#71717a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((v, i) => (
                  <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }} className="group hover:bg-white/5 transition-all"
                    style={{ borderBottom: '1px solid #27272a' }}>
                    <td className="px-6 py-5 font-semibold text-white">{v.studentName}</td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#a1a1aa' }}>{v.rollNumber}</td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#a1a1aa' }}>{v.type}</td>
                    <td className="px-6 py-5">
                      <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${getSeverityClass(v.severity)}`}>{v.severity}</span>
                    </td>
                    <td className="px-6 py-5 text-sm" style={{ color: '#a1a1aa' }}>{formatDate(v.date)}</td>
                    <td className="px-6 py-5">
                      <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${getStatusClass(v.status)}`}>{v.status}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditViolation(v); setModalOpen(true); }}
                          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                          style={{ color: '#f97316' }}><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(v.id)} disabled={isDeleting && deletingId === v.id}
                          className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                          style={{ color: '#ef4444', opacity: isDeleting && deletingId === v.id ? 0.5 : 1 }}>
                          {isDeleting && deletingId === v.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16 text-base" style={{ color: '#71717a' }}>No violations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && <ViolationModal violation={editViolation} onClose={() => { setModalOpen(false); setEditViolation(null); }} onSave={handleSave} isSaving={isSaving} />}
      </AnimatePresence>
    </div>
  );
}

function ViolationModal({ violation, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({
    rollNumber: violation?.rollNumber || '', type: violation?.type || '',
    severity: violation?.severity || 'Low', date: violation?.date || new Date().toISOString().slice(0, 10),
    description: violation?.description || '', status: violation?.status || 'Pending',
    actionTaken: violation?.actionTaken || '',
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
          <h3 className="font-bold text-lg text-white">{violation ? 'Edit Violation' : 'Add Violation'}</h3>
          <button onClick={onClose} style={{ color: '#71717a' }}><X size={20} /></button>
        </div>
        <div className="space-y-4">
          {[['Roll Number', 'rollNumber'], ['Violation Type', 'type'], ['Date', 'date', 'date'], ['Action Taken', 'actionTaken']].map(([lbl, key, type]) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>{lbl}</label>
              <input type={type || 'text'} value={form[key]} onChange={set(key)}
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>Severity</label>
              <select value={form.severity} onChange={set('severity')} className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }}>
                {SEVERITIES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>Status</label>
              <select value={form.status} onChange={set('status')} className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }}>
                {['Pending', 'Resolved'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#71717a' }}>Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm resize-none"
              style={{ background: '#0a0a0a', border: '1px solid #27272a', color: '#fafafa' }} />
          </div>
        </div>
        <div className="flex gap-3 mt-7">
          <button onClick={onClose} disabled={isSaving} className="flex-1 py-3 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors" style={{ background: '#1c1917', color: '#a1a1aa', opacity: isSaving ? 0.5 : 1 }}>Cancel</button>
          <button onClick={() => onSave(form)} disabled={isSaving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity"
            style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)', opacity: isSaving ? 0.7 : 1 }}>
            {isSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} 
            {isSaving ? 'Saving...' : (violation ? 'Update' : 'Add Violation')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
