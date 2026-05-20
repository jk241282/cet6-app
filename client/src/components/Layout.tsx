import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { TinyOwl } from './OwlMascot';

const navItems = [
  { to: '/', label: '学习仪表盘', icon: '🏠', color: 'from-violet-500 to-purple-500' },
  { to: '/strategy', label: '备考思路', icon: '💡', color: 'from-amber-500 to-orange-500' },
  { to: '/vocabulary', label: '词汇背诵', icon: '📝', color: 'from-emerald-500 to-teal-500' },
  { to: '/reading', label: '阅读理解', icon: '📖', color: 'from-sky-500 to-blue-500' },
  { to: '/translation', label: '翻译训练', icon: '🌐', color: 'from-rose-500 to-pink-500' },
  { to: '/writing', label: '写作训练', icon: '✍️', color: 'from-fuchsia-500 to-purple-500' },
  { to: '/listening', label: '听力训练', icon: '🎧', color: 'from-cyan-500 to-teal-500' },
  { to: '/exam', label: '模拟考试', icon: '🏆', color: 'from-yellow-500 to-amber-500' },
];

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth" replace />;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-[220px] bg-gradient-to-b from-[#1E1B4B] via-[#2D1B69] to-[#1E1B4B] text-white flex flex-col shrink-0 relative overflow-hidden">
        {/* Sidebar background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-32 h-32 rounded-full bg-violet-500/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-40 left-0 w-40 h-40 rounded-full bg-purple-500/5 translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/3 right-4">
            <TinyOwl />
          </div>

          {/* Subtle dots */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        {/* Logo area */}
        <div className="relative p-5 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <span className="text-xl">🦉</span>
            </div>
            <div>
              <h1 className="font-fun text-lg font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                Owl Academy
              </h1>
              <p className="text-[10px] text-violet-300/50 tracking-wider">CET-6 备考助手</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto relative">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
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
                  <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`}>
                    {icon}
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user area */}
        <div className="relative p-3 border-t border-white/8">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/auth');
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-violet-200/50 text-sm hover:bg-white/5 hover:text-white transition-all duration-200 group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#FFFBF5]">
        <div className="p-6 max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
