import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Code, Edit3, Save, X, Trophy, Star } from 'lucide-react';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { generateInitials, getAvatarColor } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const rollNo = user?.email ? user.email.split('@')[0].toUpperCase() : '';
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [codingProfiles, setCodingProfiles] = useState({ leetcode: null, gfg: null, codechef: null, hackerrank: null });
  const [form, setForm] = useState({ phone: '', githubUsername: '' });

  useEffect(() => {
    if (!rollNo) return;
    const fetchProfileData = async () => {
      try {
        const body = JSON.stringify({ roll_no: rollNo });
        const headers = { 'Content-Type': 'application/json' };
        
        const safeFetch = async (url) => {
          try {
            const res = await fetch(url, { method: 'POST', headers, body });
            if (!res.ok) return null;
            return await res.json();
          } catch (e) {
            console.error('Fetch error for', url, e);
            return null;
          }
        };

        const [studentJson, lc, gfg, cc, hr] = await Promise.all([
          safeFetch('/api/get-student-by-rollno'),
          safeFetch('/api/get-leetcode-details-by-rollno'),
          safeFetch('/api/get-geeksforgeeks-details-by-rollno'),
          safeFetch('/api/get-codechef-details-by-rollno'),
          safeFetch('/api/get-hackerrank-details-by-rollno')
        ]);

        if (studentJson) setStudentData(studentJson);
        setCodingProfiles({ leetcode: lc, gfg: gfg, codechef: cc, hackerrank: hr });
        if (studentJson) setForm({ phone: studentJson.mobile || '', githubUsername: '' });
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [rollNo]);

  const initials = generateInitials(studentData?.first_name || user?.name || '');
  const avatarColor = getAvatarColor(studentData?.first_name || user?.name || '');

  const handleSave = () => { setEditing(false); toast.success('Profile updated successfully!'); };

  if (loading) return <LoadingSkeleton type="list" rows={4} />;

  const { leetcode, gfg, codechef, hackerrank } = codingProfiles;

  return (
    <div className="space-y-7 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">My Profile</h1>
        <p className="text-base mt-1.5" style={{ color: '#71717a' }}>View and manage your academic profile</p>
      </div>

      {/* Profile banner card */}
      <div className="rounded-2xl p-8" style={{ background: '#121212', border: '1px solid #27272a' }}>
        <div className="flex items-start gap-7">
          <motion.div whileHover={{ scale: 1.05 }} className="relative flex-shrink-0">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}88)` }}
            >
              {rollNo ? (
                <>
                  <img 
                    src={`https://mobile.technicalhub.io:5010/uploads/students-images/${rollNo}.png`} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }}
                  />
                  <span style={{ display: 'none' }}>{initials}</span>
                </>
              ) : <span>{initials}</span>}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2"
              style={{ background: '#10b981', borderColor: '#121212' }} />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{studentData?.first_name || user?.name}</h2>
                <p className="text-base mt-1" style={{ color: '#71717a' }}>{studentData?.email || user?.email}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-sm px-3 py-1.5 rounded-full font-semibold" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>Active Student</span>
                  <span className="text-sm font-medium" style={{ color: '#71717a' }}>{studentData?.roll_no || rollNo}</span>
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
            <InfoRow label="Full Name" value={studentData?.first_name || user?.name} />
            <InfoRow label="Email" value={studentData?.email || user?.email} />
            <InfoRow label="Phone" value={editing ? (
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="text-sm text-white bg-transparent border-b w-full outline-none pb-0.5"
                style={{ borderColor: '#f97316' }} />
            ) : studentData?.mobile} />
            <InfoRow label="Gender" value={studentData?.gender} />
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
            <InfoRow label="Roll Number" value={studentData?.roll_no || rollNo} />
            <InfoRow label="College" value={studentData?.college} />
            <InfoRow label="Department" value={studentData?.branch?.join(', ')} />
            <InfoRow label="Passout Year" value={studentData?.passout_year} />
          </div>
        </div>
      </div>

      {/* Coding Profiles Section */}
      <div>
        <h2 className="text-xl font-bold text-white mt-4 mb-4 flex items-center gap-2">
          <Code size={20} style={{ color: '#f97316' }} /> Coding Profiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* LeetCode */}
          <div className="rounded-2xl p-6" style={{ background: '#121212', border: '1px solid #27272a' }}>
            <h3 className="font-bold text-base text-white mb-4 flex items-center justify-between">
              LeetCode
              <a href={leetcode?.lc_profile || '#'} target="_blank" rel="noreferrer" style={{ color: '#f97316' }}>
                <Star size={16} />
              </a>
            </h3>
            <div className="space-y-3">
              <InfoRow label="Total Solved" value={leetcode?.lc_total_progarms || 0} />
              <InfoRow label="Easy" value={leetcode?.lc_easy || 0} />
              <InfoRow label="Medium" value={leetcode?.lc_medium || 0} />
              <InfoRow label="Hard" value={leetcode?.lc_hard || 0} />
              <InfoRow label="Global Rank" value={leetcode?.lc_rank ? `#${leetcode.lc_rank}` : 'N/A'} />
            </div>
          </div>

          {/* GeeksForGeeks */}
          <div className="rounded-2xl p-6" style={{ background: '#121212', border: '1px solid #27272a' }}>
            <h3 className="font-bold text-base text-white mb-4 flex items-center justify-between">
              GeeksForGeeks
              <a href={gfg?.gfg_profile || '#'} target="_blank" rel="noreferrer" style={{ color: '#10b981' }}>
                <Star size={16} />
              </a>
            </h3>
            <div className="space-y-3">
              <InfoRow label="Total Problems" value={gfg?.gfg_total_problems || 0} />
              <InfoRow label="Score" value={gfg?.gfg_score || 0} />
              <InfoRow label="Streak" value={`${gfg?.gfg_streak || 0} days`} />
              <InfoRow label="School" value={gfg?.gfg_school || 0} />
              <InfoRow label="Basic" value={gfg?.gfg_basic || 0} />
            </div>
          </div>

          {/* CodeChef */}
          <div className="rounded-2xl p-6" style={{ background: '#121212', border: '1px solid #27272a' }}>
            <h3 className="font-bold text-base text-white mb-4 flex items-center justify-between">
              CodeChef
              <a href={codechef?.cc_profile || '#'} target="_blank" rel="noreferrer" style={{ color: '#8b5cf6' }}>
                <Trophy size={16} />
              </a>
            </h3>
            <div className="space-y-3">
              <InfoRow label="Rating" value={codechef?.rating || 0} />
              <InfoRow label="Stars" value={`${codechef?.star_rating || 0} ★`} />
              <InfoRow label="Total Solved" value={codechef?.total_problems || 0} />
              <InfoRow label="Contests" value={codechef?.contests || 0} />
              <InfoRow label="Streak" value={`${codechef?.streak || 0} days`} />
            </div>
          </div>

          {/* HackerRank */}
          <div className="rounded-2xl p-6" style={{ background: '#121212', border: '1px solid #27272a' }}>
            <h3 className="font-bold text-base text-white mb-4 flex items-center justify-between">
              HackerRank
              <a href={hackerrank?.hr_profile || '#'} target="_blank" rel="noreferrer" style={{ color: '#06b6d4' }}>
                <Code size={16} />
              </a>
            </h3>
            <div className="space-y-3">
              <InfoRow label="Badges" value={hackerrank?.hr_badges || 0} />
              <InfoRow label="Total Stars" value={`${hackerrank?.hr_total_stars || 0} ★`} />
              <InfoRow label="C/C++" value={(hackerrank?.hr_c || 0) + (hackerrank?.hr_cpp || 0)} />
              <InfoRow label="Java" value={hackerrank?.hr_java || 0} />
              <InfoRow label="Python" value={hackerrank?.hr_python || 0} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2" style={{ borderBottom: '1px solid #1c1917' }}>
      <span className="text-xs font-medium flex-shrink-0" style={{ color: '#71717a' }}>{label}</span>
      <span className="text-xs text-white text-right font-medium">{value}</span>
    </div>
  );
}
