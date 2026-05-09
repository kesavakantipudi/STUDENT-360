import { createContext, useContext, useState, useEffect } from 'react';
import { demoUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'admin'
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    // Check persisted session
    const savedUser = localStorage.getItem('s360_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed.user);
        setRole(parsed.role);
        setStudentData(parsed.studentData || null);
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password, selectedRole) => {
    setLoading(true);
    // Demo auth (no real Firebase needed)
    await new Promise(r => setTimeout(r, 800));

    const demoStudent = demoUsers.student;
    const demoAdmin = demoUsers.admin;

    if (selectedRole === 'student' && email === demoStudent.email && password === demoStudent.password) {
      const userData = { uid: 's001', email, role: 'student', name: 'Arjun Sharma' };
      const sd = { studentId: 's001' };
      setUser(userData);
      setRole('student');
      setStudentData(sd);
      localStorage.setItem('s360_user', JSON.stringify({ user: userData, role: 'student', studentData: sd }));
      setLoading(false);
      return { success: true };
    }

    if (selectedRole === 'admin' && email === demoAdmin.email && password === demoAdmin.password) {
      const userData = { uid: 'admin001', email, role: 'admin', name: 'Dr. Admin Kumar' };
      setUser(userData);
      setRole('admin');
      setStudentData(null);
      localStorage.setItem('s360_user', JSON.stringify({ user: userData, role: 'admin', studentData: null }));
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, error: 'Invalid credentials. Use demo credentials shown below.' };
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setStudentData(null);
    localStorage.removeItem('s360_user');
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, studentData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
