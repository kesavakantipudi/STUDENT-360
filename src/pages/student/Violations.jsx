import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, CheckCircle, Clock } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { ErrorState } from '../../components/shared/ErrorState';
import { useAuth } from '../../context/AuthContext';

export default function ViolationsPage() {
  const { user } = useAuth();
  const rollNo = user?.email ? user.email.split('@')[0].toUpperCase() : '';
  const [loading, setLoading] = useState(true);
  const [violationsCount, setViolationsCount] = useState(0);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!rollNo) return;
    const fetchViolations = async () => {
      try {
        setError(false);
        const res = await fetch(`/api/violations-count/${rollNo}`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        setViolationsCount(data.count || 0);
      } catch (err) {
        console.error("Error fetching violations:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchViolations();
  }, [rollNo, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setRetryCount(c => c + 1);
  };

  if (error) return <ErrorState message="Unable to fetch violation records. Please check your connection and try again." onRetry={handleRetry} />;

  if (loading) return <LoadingSkeleton type="list" rows={3} />;

  return (
    <div className="space-y-8 max-w-4xl">
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
          { label: 'Total Violations', value: violationsCount, color: '#f97316', icon: AlertTriangle },
          { label: 'Resolved', value: 0, color: '#10b981', icon: CheckCircle },
          { label: 'Pending', value: violationsCount, color: '#f59e0b', icon: Clock },
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
        {violationsCount === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: '#121212', border: '1px solid #27272a' }}>
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <CheckCircle size={32} style={{ color: '#10b981' }} />
            </div>
            <h3 className="font-bold text-lg text-white">No Violations Found</h3>
            <p className="text-sm mt-2" style={{ color: '#71717a' }}>You have a clean academic record. Keep up the good work!</p>
          </div>
        ) : (
          <div className="rounded-2xl p-10 text-center" style={{ background: '#121212', border: '1px solid #27272a' }}>
             <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertTriangle size={32} style={{ color: '#ef4444' }} />
            </div>
             <h3 className="font-bold text-lg text-white">Action Required</h3>
             <p className="text-sm mt-2" style={{ color: '#71717a' }}>Please contact your advisor or department head for details regarding your violations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
