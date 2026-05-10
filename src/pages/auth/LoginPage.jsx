import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Eye,
  EyeOff,
  Shield,
  Mail,
  Lock,
  ArrowRight,
} from 'lucide-react';

import {
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../firebase/firebase';

import { auth } from '../../firebase/firebase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuthData } = useAuth();

  // =========================
  // MICROSOFT LOGIN
  // =========================
  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true);

      const provider = new OAuthProvider('microsoft.com');

      provider.setCustomParameters({
        tenant: '7359f896-71e2-4dae-b8a3-15cdf97f2f10',
      });

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // SAVE USER TO FIRESTORE
      try {
        await setDoc(
          doc(db, 'students', user.uid),
          {
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            photo: user.photoURL || '',
            role: 'student',

            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (dbError) {
        console.error('Firestore Save Error:', dbError);
        // Note: We don't block the login flow here. If permission is denied,
        // it means your Firebase Firestore security rules might be blocking the write.
      }

      setAuthData(
        { uid: user.uid, email: user.email, name: user.displayName, photo: user.photoURL },
        'student'
      );

      toast.success('Microsoft Login Successful');

      navigate('/student/dashboard');

    } catch (error) {
      console.error('Microsoft Login Error:', error);

      toast.error(error.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // ADMIN LOGIN
  // =========================
  const handleAdminLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setAuthData(
        { uid: user.uid, email: user.email },
        'admin'
      );

      toast.success('Admin Login Successful');

      navigate('/admin/dashboard');
    } catch (error) {
      console.log(error);
      toast.error('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-10"
      style={{ background: '#050505' }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(249,115,22,0.5), transparent)',
          }}
        />

        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{
            background:
              'radial-gradient(circle, rgba(245,158,11,0.5), transparent)',
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div
          className="backdrop-blur-2xl border rounded-3xl p-8 md:p-10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{
                background:
                  'linear-gradient(135deg, #f97316, #f59e0b)',
              }}
            >
              <GraduationCap size={38} color="white" />
            </div>

            <h1 className="text-3xl font-bold text-white tracking-wide">
              STUDENT 360°
            </h1>

            <p className="text-sm mt-2 text-zinc-400 text-center">
              AI Powered Academic Intelligence Platform
            </p>
          </div>

          {/* Role Toggle */}
          <div
            className="flex gap-2 p-1 rounded-2xl mb-8"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {['student', 'admin'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setRole(item);
                  setEmail('');
                  setPassword('');
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${role === item ? 'text-white' : 'text-zinc-500'
                  }`}
                style={
                  role === item
                    ? {
                      background:
                        'linear-gradient(135deg, #f97316, #f59e0b)',
                      boxShadow:
                        '0 10px 25px rgba(249,115,22,0.35)',
                    }
                    : {}
                }
              >
                <div className="flex items-center justify-center gap-2">
                  {item === 'student' ? (
                    <Mail size={16} />
                  ) : (
                    <Shield size={16} />
                  )}

                  {item === 'student' ? 'Student' : 'Admin'}
                </div>
              </button>
            ))}
          </div>

          {/* STUDENT LOGIN */}
          {role === 'student' ? (
            <div className="space-y-6">
              <button
                onClick={handleMicrosoftLogin}
                disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                style={{
                  background:
                    'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  boxShadow:
                    '0 10px 30px rgba(37,99,235,0.35)',
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in with Microsoft
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-zinc-500 leading-6">
                Use your organization Microsoft account to access
                STUDENT 360°
              </p>
            </div>
          ) : (
            /* ADMIN LOGIN */
            <form onSubmit={handleAdminLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm mb-2 text-zinc-300">
                  Admin Email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm mb-2 text-zinc-300">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-orange-500 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2"
                style={{
                  background:
                    'linear-gradient(135deg, #f97316, #f59e0b)',
                  boxShadow:
                    '0 10px 30px rgba(249,115,22,0.35)',
                }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Admin Login
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}