import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import TopNav from '../components/shared/TopNav';

export default function DashboardLayout({ title }) {
  return (
    <div className="app-shell">
      {/* Ambient background orbs */}
      <div className="orb" style={{ width: 480, height: 480, background: '#f97316', top: '-10%', left: '8%' }} />
      <div className="orb" style={{ width: 360, height: 360, background: '#f59e0b', bottom: '10%', right: '5%' }} />

      {/* Sidebar */}
      <Sidebar />

      {/* Right column: TopNav + page */}
      <div className="content-column">
        <TopNav title={title} />
        <main className="page-area">
          <div className="page-content">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
