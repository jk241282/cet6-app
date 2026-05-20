import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import OwlMascot, { Star } from '../components/OwlMascot';

interface Stats {
  total: number;
  mastered: number;
  learning: number;
  remaining: number;
}

const modules = [
  { path: '/vocabulary', label: '词汇背诵', desc: '7634 核心词汇', icon: '📝', color: 'from-emerald-400 to-teal-500', emoji: '📚', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  { path: '/reading', label: '阅读理解', desc: '真题文章+解析', icon: '📖', color: 'from-sky-400 to-blue-500', emoji: '🔍', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
  { path: '/translation', label: '翻译训练', desc: '汉译英实战', icon: '🌐', color: 'from-rose-400 to-pink-500', emoji: '🔄', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
  { path: '/writing', label: '写作训练', desc: '模板+范文+佳句', icon: '✍️', color: 'from-fuchsia-400 to-purple-500', emoji: '✨', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-700' },
  { path: '/listening', label: '听力训练', desc: '真题+精听方法', icon: '🎧', color: 'from-cyan-400 to-teal-500', emoji: '🎵', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
  { path: '/exam', label: '模拟考试', desc: '计时模考+评分', icon: '🏆', color: 'from-amber-400 to-orange-500', emoji: '🎯', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
];

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ total: 0, mastered: 0, learning: 0, remaining: 0 });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    api.get('/vocabulary/stats/summary').then(({ data }) => setStats(data)).catch(() => {});
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('早上好！');
    else if (hour < 18) setGreeting('下午好！');
    else setGreeting('晚上好！');
  }, []);

  const progressPct = stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return (
    <div className="relative">
      {/* Decorative stars */}
      <Star className="absolute -top-2 right-4" size={18} />
      <Star className="absolute top-20 left-[60%]" size={12} />

      {/* Header with mascot */}
      <div className="flex items-center gap-5 mb-8 animate-slide-up">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-200 rounded-full blur-xl opacity-40" />
          <OwlMascot size={90} animated={true} />
        </div>
        <div>
          <h2 className="font-fun text-3xl font-bold text-slate-800">
            {greeting} 准备开始学习吧！
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            猫头鹰博士为你准备了今天的学习计划
          </p>
        </div>
      </div>

      {/* Progress card */}
      <div className="card-fun p-6 mb-8 relative overflow-hidden animate-slide-up border-violet-100">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-bl from-violet-100/50 to-transparent -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-gradient-to-tr from-purple-100/30 to-transparent translate-y-1/4 -translate-x-1/4" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-fun text-lg font-bold text-slate-800">词汇学习进度</h3>
              <p className="text-xs text-slate-400 mt-0.5">掌握 {stats.mastered} / {stats.total} 个单词</p>
            </div>
            <div className="text-right">
              <span className="font-fun text-4xl font-bold gradient-text">{progressPct}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
            </div>
            {/* Animated owl on progress bar */}
            {progressPct > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                style={{ left: `calc(${progressPct}% - 16px)` }}
              >
                <span className="text-lg animate-bounce-gentle">🦉</span>
              </div>
            )}
          </div>

          {/* Stats pills */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-700">已掌握 {stats.mastered}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-amber-700">学习中 {stats.learning}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="text-xs font-semibold text-slate-500">待学习 {stats.remaining || stats.total - stats.mastered - stats.learning}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-2 gap-4">
        {modules.map((m, i) => (
          <button
            key={m.path}
            onClick={() => navigate(m.path)}
            className={`card-fun p-5 text-left group relative overflow-hidden ${m.border}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Card top bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${m.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${m.bg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-sm`}>
                {m.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-fun font-semibold text-slate-800 text-base group-hover:text-violet-600 transition-colors">
                  {m.label}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
              </div>
              <div className={`self-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 ${m.text}`}>
                →
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick tip */}
      <div className="mt-8 p-5 bg-gradient-to-r from-violet-50 to-purple-50 rounded-3xl border border-violet-100 animate-slide-up">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-fun font-semibold text-violet-800 text-sm">猫头鹰博士的小提示</h4>
            <p className="text-xs text-violet-600/70 mt-1">
              每天坚持背诵 30 个单词 + 做 1 篇阅读理解，坚持 2 个月就能覆盖 CET-6 核心词汇。加油！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
