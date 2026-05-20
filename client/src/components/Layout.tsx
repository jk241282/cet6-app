import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { TinyOwl } from './OwlMascot';

const navItems = [
  { to: '/', label: '学习仪表盘', icon: '🏠' },
  { to: '/strategy', label: '备考思路', icon: '💡' },
  { to: '/vocabulary', label: '词汇背诵', icon: '📝' },
  { to: '/reading', label: '阅读理解', icon: '📖' },
  { to: '/translation', label: '翻译训练', icon: '🌐' },
  { to: '/writing', label: '写作训练', icon: '✍️' },
  { to: '/listening', label: '听力训练', icon: '🎧' },
  { to: '/exam', label: '模拟考试', icon: '🏆' },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#1E1B4B] via-[#2D1B69] to-[#1E1B4B] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-32 h-32 rounded-full bg-violet-500/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-40 left-0 w-40 h-40 rounded-full bg-purple-500/5 translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/3 right-4 hidden sm:block">
          <TinyOwl />
        </div>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
      </div>

      {/* Logo */}
      <div className="relative p-4 sm:p-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <span className="text-lg sm:text-xl">🦉</span>
          </div>
          <div>
            <h1 className="font-fun text-base sm:text-lg font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
              Owl Academy
            </h1>
            <p className="text-[10px] text-violet-300/50 tracking-wider">CET-6 备考助手</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 sm:p-3 space-y-0.5 overflow-y-auto relative">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'bg-white/15 text-white shadow-lg shadow-black/10'
                  : 'text-violet-200/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-400 to-purple-400 rounded-r-full" />
                )}
                <span className={`text-base sm:text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                  {icon}
                </span>
                <span className="text-xs sm:text-sm">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="relative p-2 sm:p-3 border-t border-white/8">
        <button
          onClick={() => { localStorage.removeItem('token'); navigate('/auth'); }}
          className="flex items-center gap-2.5 sm:gap-3 w-full px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-violet-200/50 text-xs sm:text-sm hover:bg-white/5 hover:text-white transition-all duration-200 group"
        >
          <span className="text-base sm:text-lg group-hover:scale-110 transition-transform">🚪</span>
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - desktop: visible, mobile: slide-over */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-full
        w-[240px] md:w-[220px] shrink-0
        transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur border-b border-slate-100 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-fun font-bold text-sm bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Owl Academy
          </span>
          <span className="text-[10px] text-slate-400">CET-6</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#FFFBF5]">
          <div className="p-4 sm:p-6 max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
