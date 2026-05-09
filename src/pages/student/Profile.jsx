import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, BookOpen, Code, Edit3, Save, X, GitBranch } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { mockStudents } from '../../data/mockData';
import { generateInitials, getAvatarColor, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const student = mockStudents[0];
  const [form, setForm] = useState({ phone: student.phone, githubUsername: student.githubUsername });
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const initials = generateInitials(student.name);
  const avatarColor = getAvatarColor(student.name);

  const handleSave = () => { setEditing(false); toast.success('Profile updated successfully!'); };

  if (loading) return <LoadingSkeleton type="list" rows={4} />;

  return (
    <div className="space-y-7 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Profile</h1>
        <p className="text-base mt-1.5" style={{ color: '#71717a' }}>View and manage your academic profile</p>
      </div>

      {/* Profile banner card */}
      <div className="rounded-2xl p-8" style={{ background: '#121212', border: '1px solid #27272a' }}>
        <div className="flex items-start gap-7">
          <motion.div whileHover={{ scale: 1.05 }} className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)` }}
            >
              {initials}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2"
              style={{ background: '#10b981', borderColor: '#121212' }} />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{student.name}</h2>
                <p className="text-base mt-1" style={{ color: '#71717a' }}>{student.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm px-3 py-1.5 rounded-full font-semibold status-active">Active Student</span>
                  <span className="text-sm font-medium" style={{ color: '#71717a' }}>{student.rollNumber}</span>
                </div>
              </div>
              {!editing ? (
                <button onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: 'rgba(249, 115, 22,0.15)', color: '#fdba74', border: '1px solid rgba(249, 115, 22,0.3)' }}>
                  <Edit3 size={14} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: '#f97316', color: 'white' }}>
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: '#1c1917', color: '#71717a' }}>
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Personal Info */}
        <div className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
          <h3 className="font-bold text-base text-white mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(249, 115, 22,0.15)' }}>
              <User size={16} style={{ color: '#f97316' }} />
            </div>
            Personal Information
          </h3>
          <div className="space-y-4">
            <InfoRow label="Full Name" value={student.name} />
            <InfoRow label="Email" value={student.email} />
            <InfoRow label="Phone" value={editing ? (
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="text-sm text-white bg-transparent border-b w-full outline-none pb-0.5"
                style={{ borderColor: '#f97316' }} />
            ) : student.phone} />
            <InfoRow label="Join Date" value={formatDate(student.joinDate)} />
          </div>
        </div>

        {/* Academic Info */}
        <div className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
          <h3 className="font-bold text-base text-white mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245, 158, 11,0.15)' }}>
              <BookOpen size={16} style={{ color: '#f59e0b' }} />
            </div>
            Academic Information
          </h3>
          <div className="space-y-4">
            <InfoRow label="Roll Number" value={student.rollNumber} />
            <InfoRow label="Department" value={student.department} />
            <InfoRow label="Year" value={`Year ${student.year}`} />
            <InfoRow label="CGPA" value={<span className="font-bold text-base" style={{ color: '#10b981' }}>{student.cgpa} / 10.0</span>} />
          </div>
        </div>

        {/* GitHub */}
        <div className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
          <h3 className="font-bold text-base text-white mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(148,163,184,0.1)' }}>
              <GitBranch size={16} style={{ color: '#a1a1aa' }} />
            </div>
            GitHub Profile
          </h3>
          <InfoRow label="Username" value={editing ? (
            <input value={form.githubUsername} onChange={e => setForm(f => ({ ...f, githubUsername: e.target.value }))}
              className="text-sm text-white bg-transparent border-b w-full outline-none pb-0.5"
              style={{ borderColor: '#f97316' }} />
          ) : (
            <a href={`https://github.com/${student.githubUsername}`} target="_blank" rel="noreferrer"
              className="hover:underline text-sm" style={{ color: '#fdba74' }}>
              @{student.githubUsername}
            </a>
          )} />
        </div>

        {/* Skills */}
        <div className="rounded-2xl p-7" style={{ background: '#121212', border: '1px solid #27272a' }}>
          <h3 className="font-bold text-base text-white mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.12)' }}>
              <Code size={16} style={{ color: '#06b6d4' }} />
            </div>
            Technical Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {student.skills.map((skill, i) => (
              <motion.span key={skill} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="text-sm px-4 py-2 rounded-xl font-medium"
                style={{ background: 'rgba(249, 115, 22,0.1)', color: '#fdba74', border: '1px solid rgba(249, 115, 22,0.22)' }}>
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3" style={{ borderBottom: '1px solid #1c1917' }}>
      <span className="text-sm font-medium flex-shrink-0" style={{ color: '#71717a' }}>{label}</span>
      <span className="text-sm text-white text-right">{value}</span>
    </div>
  );
}
