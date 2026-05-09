import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Eye, EyeOff, User, Shield, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DEMO_CREDS = {
  student: { email: 'student@demo.com', password: 'demo1234' },
  admin: { email: 'admin@demo.com', password: 'admin1234' },
};

export default function LoginPage() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fillDemo = () => {
    setEmail(DEMO_CREDS[role].email);
    setPassword(DEMO_CREDS[role].password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);
    if (result.success) {
      toast.success(`Welcome back!`);
      navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#000000' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }}
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(249, 115, 22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="glass-strong rounded-3xl p-8" style={{ boxShadow: '0 25px 80px rgba(0,0,0,0.6)' }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}
            >
              <GraduationCap size={32} color="white" />
            </motion.div>
            <h1 className="text-2xl font-bold gradient-text">STUDENT 360</h1>
            <p className="text-sm mt-1" style={{ color: '#71717a' }}>Academic Intelligence Platform</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-2 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #27272a' }}>
            {[
              { value: 'student', label: 'Student', icon: User },
              { value: 'admin', label: 'Admin', icon: Shield },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => { setRole(value); setEmail(''); setPassword(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={role === value ? {
                  background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(249, 115, 22,0.4)',
                } : { color: '#71717a' }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#71717a' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid #27272a',
                    color: '#fafafa',
                  }}
                  onFocus={e => e.target.style.borderColor = '#f97316'}
                  onBlur={e => e.target.style.borderColor = '#27272a'}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#71717a' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid #27272a',
                    color: '#fafafa',
                  }}
                  onFocus={e => e.target.style.borderColor = '#f97316'}
                  onBlur={e => e.target.style.borderColor = '#27272a'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: '#71717a' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 mt-2 transition-all disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                boxShadow: '0 4px 20px rgba(249, 115, 22,0.4)',
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(249, 115, 22,0.08)', border: '1px solid rgba(249, 115, 22,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} style={{ color: '#fdba74' }} />
              <span className="text-xs font-semibold" style={{ color: '#fdba74' }}>Demo Credentials</span>
            </div>
            <div className="space-y-1 text-xs" style={{ color: '#71717a' }}>
              <p><span style={{ color: '#a1a1aa' }}>Student:</span> student@demo.com / demo1234</p>
              <p><span style={{ color: '#a1a1aa' }}>Admin:</span> admin@demo.com / admin1234</p>
            </div>
            <button
              onClick={fillDemo}
              className="mt-2 text-xs font-medium flex items-center gap-1 hover:underline"
              style={{ color: '#f97316' }}
            >
              <ArrowRight size={11} /> Use demo credentials
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
