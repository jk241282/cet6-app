import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import OwlMascot, { Star } from '../components/OwlMascot';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || '操作失败');
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#FFFBF5]">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Star className="absolute top-[10%] left-[8%]" size={24} />
        <Star className="absolute top-[20%] right-[12%]" size={16} />
        <Star className="absolute bottom-[15%] left-[15%]" size={20} />
        <Star className="absolute bottom-[25%] right-[8%]" size={14} />
        <Star className="absolute top-[45%] left-[5%]" size={12} />

        {/* Floating circles */}
        <div className="absolute top-[8%] right-[25%] w-3 h-3 rounded-full bg-coral-400/15 animate-float" />
        <div className="absolute bottom-[30%] left-[20%] w-4 h-4 rounded-full bg-mint-400/15 animate-float-slow" />
        <div className="absolute top-[35%] right-[8%] w-2.5 h-2.5 rounded-full bg-violet-400/15 animate-float" />

        {/* Clouds */}
        <svg className="absolute top-[5%] left-[25%]" width="100" height="50" viewBox="0 0 100 50" fill="none">
          <ellipse cx="50" cy="35" rx="30" ry="12" fill="white" opacity="0.5" />
          <ellipse cx="35" cy="28" rx="18" ry="10" fill="white" opacity="0.5" />
          <ellipse cx="60" cy="28" rx="20" ry="11" fill="white" opacity="0.5" />
        </svg>
        <svg className="absolute bottom-[10%] right-[20%]" width="80" height="40" viewBox="0 0 80 40" fill="none">
          <ellipse cx="40" cy="28" rx="25" ry="10" fill="white" opacity="0.4" />
          <ellipse cx="28" cy="22" rx="15" ry="8" fill="white" opacity="0.4" />
          <ellipse cx="50" cy="22" rx="17" ry="9" fill="white" opacity="0.4" />
        </svg>
      </div>

      {/* Left: Mascot Illustration - hidden on mobile */}
      <div className="hidden lg:flex w-[45%] xl:w-[42%] items-center justify-center relative">
        <div className="absolute inset-0 dot-pattern opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

        <div className="relative flex flex-col items-center animate-slide-up">
          {/* Decorative rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-dashed border-violet-200/40 animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-violet-100/30 animate-float" />

          <OwlMascot size={220} />

          <h2 className="font-fun text-3xl font-bold gradient-text mt-4 text-center">
            Owl Academy
          </h2>
          <p className="text-slate-400 text-sm mt-2 text-center max-w-xs">
            猫头鹰博士陪你一起备战 CET-6
          </p>

          {/* Feature badges */}
          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            {['7634 词汇', '真题训练', '智能进度'].map((f) => (
              <span key={f} className="px-4 py-1.5 bg-violet-50 text-violet-600 text-xs font-medium rounded-full border border-violet-100">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile only: compact mascot */}
          <div className="lg:hidden flex flex-col items-center mb-6 animate-slide-up">
            <OwlMascot size={100} animated={false} />
            <h1 className="font-fun text-2xl font-bold gradient-text mt-2">Owl Academy</h1>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-fun-lg border border-violet-100/50 relative overflow-hidden animate-slide-up">
            {/* Card decorative top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-400" />

            <h1 className="font-fun text-2xl font-bold text-slate-800 mb-1">
              {isLogin ? '欢迎回来！' : '加入我们！'}
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              {isLogin ? '继续你的 CET-6 备考之旅' : '创建账户，开启学习之旅'}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl flex items-center gap-2">
                <span>😿</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="animate-slide-up">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">用户名</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">👤</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="你的昵称"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-violet-400 outline-none text-sm transition-colors placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">邮箱</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-violet-400 outline-none text-sm transition-colors placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">密码</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="至少 6 个字符"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-violet-400 outline-none text-sm transition-colors placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-fun w-full py-3.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-2xl font-semibold text-sm"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLogin ? '登录' : '注册'}
                  <span className="text-lg">{isLogin ? '🚀' : '✨'}</span>
                </span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                {isLogin ? '还没有账户？' : '已有账户？'}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-violet-600 font-semibold hover:text-violet-700 ml-1 transition-colors"
                >
                  {isLogin ? '立即注册' : '去登录'}
                </button>
              </p>
            </div>

            {/* Bottom decoration */}
            <div className="flex justify-center gap-1 mt-6">
              {['📚', '🎓', '⭐', '💜', '🦉'].map((e, i) => (
                <span key={i} className="text-xs opacity-30 hover:opacity-100 transition-opacity">{e}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
