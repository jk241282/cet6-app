import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: '学习仪表盘', icon: '🏠' },
  { to: '/vocabulary', label: '词汇背诵', icon: '📝' },
  { to: '/reading', label: '阅读理解', icon: '📖' },
  { to: '/translation', label: '翻译训练', icon: '🌐' },
  { to: '/writing', label: '写作训练', icon: '✍️' },
  { to: '/listening', label: '听力训练', icon: '🎧' },
  { to: '/exam', label: '模拟考试', icon: '🏆' },
];

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth" replace />;

  return (
    <div className="flex h-screen">
      <aside className="w-[200px] bg-sidebar text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CET-6 备考助手
          </h1>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/auth');
            }}
            className="text-slate-400 text-sm hover:text-white w-full text-left px-3 py-2"
          >
            退出登录
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
