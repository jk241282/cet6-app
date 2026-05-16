import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

interface Stats {
  total: number;
  mastered: number;
  learning: number;
  remaining: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ total: 0, mastered: 0, learning: 0, remaining: 0 });

  useEffect(() => {
    api.get('/vocabulary/stats/summary').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  const modules = [
    { path: '/vocabulary', label: '词汇背诵', desc: `${stats.mastered}/${stats.total} 已掌握`, icon: '📝', color: 'from-indigo-500 to-purple-500' },
    { path: '/reading', label: '阅读理解', desc: '真题文章+题目解析', icon: '📖', color: 'from-blue-500 to-cyan-500' },
    { path: '/translation', label: '翻译训练', desc: '汉译英实战练习', icon: '🌐', color: 'from-emerald-500 to-teal-500' },
    { path: '/writing', label: '写作训练', desc: '模板+范文+佳句', icon: '✍️', color: 'from-orange-500 to-amber-500' },
    { path: '/listening', label: '听力训练', desc: '真题听力+解析', icon: '🎧', color: 'from-pink-500 to-rose-500' },
    { path: '/exam', label: '模拟考试', desc: '计时模考+自动评分', icon: '🏆', color: 'from-violet-500 to-purple-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">学习仪表盘</h2>
      <p className="text-slate-500 text-sm mb-6">欢迎回来，准备开始今天的学习。</p>

      {/* 词汇进度 */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">词汇学习进度</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.total ? (stats.mastered / stats.total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm font-medium text-slate-600">
            {stats.total ? Math.round((stats.mastered / stats.total) * 100) : 0}%
          </span>
        </div>
        <div className="flex gap-6 mt-3 text-xs text-slate-500">
          <span>✅ 已掌握 <b className="text-emerald-600">{stats.mastered}</b></span>
          <span>🔄 学习中 <b className="text-amber-600">{stats.learning}</b></span>
          <span>📋 待学习 <b className="text-slate-400">{stats.remaining || stats.total - stats.mastered - stats.learning}</b></span>
        </div>
      </div>

      {/* 模块入口 */}
      <div className="grid grid-cols-2 gap-4">
        {modules.map((m) => (
          <button
            key={m.path}
            onClick={() => navigate(m.path)}
            className="bg-white rounded-xl p-5 border border-slate-200 text-left hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{m.icon}</span>
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{m.label}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
