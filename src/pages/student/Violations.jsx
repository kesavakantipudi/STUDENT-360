import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { mockViolations } from '../../data/mockData';
import { formatDate, getSeverityClass, getStatusClass } from '../../utils/helpers';

export default function ViolationsPage() {
  const [loading, setLoading] = useState(true);
  const violations = [
    { ...mockViolations[2], studentId: 's001' },
    { ...mockViolations[1], studentId: 's001' },
  ];
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);
  if (loading) return <LoadingSkeleton type="list" rows={3} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Violations</h1>
        <p className="text-base mt-1.5" style={{ color: '#71717a' }}>Academic violation records and resolution status</p>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-4 px-6 py-5 rounded-2xl" style={{ background: 'rgba(249, 115, 22,0.07)', border: '1px solid rgba(249, 115, 22,0.2)' }}>
        <Shield size={18} style={{ color: '#fdba74', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="font-semibold text-sm" style={{ color: '#fdba74' }}>Violation Policy</p>
          <p className="text-sm mt-1.5 leading-relaxed" style={{ color: '#71717a' }}>
            Academic violations are recorded and reviewed by the department. Repeated violations may affect academic standing. Contact your advisor for dispute resolution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Violations', value: violations.length, color: '#f97316', icon: AlertTriangle },
          { label: 'Resolved', value: violations.filter(v => v.status === 'Resolved').length, color: '#10b981', icon: CheckCircle },
          { label: 'Pending', value: violations.filter(v => v.status === 'Pending').length, color: '#f59e0b', icon: Clock },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-7 flex items-center gap-5" style={{ background: '#121212', border: '1px solid #27272a' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${s.color}20` }}>
              <s.icon size={22} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#71717a' }}>{s.label}</p>
              <p className="text-3xl font-bold text-white mt-0.5">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-5">
        {violations.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: v.severity === 'High' ? 'rgba(239,68,68,0.15)' : v.severity === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)' }}>
                  <AlertTriangle size={20} style={{ color: v.severity === 'High' ? '#ef4444' : v.severity === 'Medium' ? '#f59e0b' : '#10b981' }} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{v.type}</h3>
                  <p className="text-sm mt-1" style={{ color: '#71717a' }}>{formatDate(v.date)}</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${getSeverityClass(v.severity)}`}>{v.severity}</span>
                <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${getStatusClass(v.status)}`}>{v.status}</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#a1a1aa' }}>{v.description}</p>
            <div className="p-4 rounded-xl" style={{ background: '#0a0a0a' }}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#71717a' }}>Action Taken</p>
              <p className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>{v.actionTaken}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
