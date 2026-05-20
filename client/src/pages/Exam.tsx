import { useState } from 'react';

const examStructure = [
  { section: '写作', time: '30分钟', items: '1篇作文', score: '106.5分', percentage: '15%', icon: '✍️', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200', borderL: 'border-l-amber-400' },
  { section: '听力', time: '30分钟', items: '25题', score: '248.5分', percentage: '35%', icon: '🎧', color: 'from-cyan-400 to-teal-500', bg: 'bg-cyan-50', border: 'border-cyan-200', borderL: 'border-l-cyan-400' },
  { section: '阅读理解', time: '40分钟', items: '30题', score: '248.5分', percentage: '35%', icon: '📖', color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50', border: 'border-sky-200', borderL: 'border-l-sky-400' },
  { section: '翻译', time: '30分钟', items: '1段汉译英', score: '106.5分', percentage: '15%', icon: '🌐', color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50', border: 'border-emerald-200', borderL: 'border-l-emerald-400' },
];

const examTips = [
  { title: '时间分配', content: '写作30分钟 → 听力30分钟 → 阅读40分钟 → 翻译30分钟。全程130分钟，中间不休息。', icon: '⏰' },
  { title: '答题顺序建议', content: '写作(先写) → 听力(固定顺序) → 仔细阅读(20分钟) → 长篇匹配(15分钟) → 翻译(30分钟) → 选词填空(5分钟)。选词填空分低题多，放最后。', icon: '📋' },
  { title: '涂卡策略', content: '听力边听边涂，结束立即收卡！阅读和翻译可以用最后几分钟统一涂，但建议做完一大题涂一次。', icon: '✏️' },
  { title: '心理准备', content: '遇到难题不要慌，先跳过，保证会做的题拿满分。六级是排位制，你不会的别人也不会。及格线425分。', icon: '💪' },
];

const scoreTable = [
  { range: '630-710', level: '优秀', desc: '听力阅读接近满分，写作翻译表达地道', color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'bg-emerald-500' },
  { range: '550-629', level: '良好', desc: '各题型基础扎实，可冲刺更高目标', color: 'text-indigo-600', bg: 'bg-indigo-50', badge: 'bg-indigo-500' },
  { range: '425-549', level: '及格', desc: '达到毕业/求职基本要求', color: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-500' },
  { range: '<425', level: '未通过', desc: '需要加强基础训练，重点突破弱项', color: 'text-rose-600', bg: 'bg-rose-50', badge: 'bg-rose-500' },
];

export default function Exam() {
  const [activeTab, setActiveTab] = useState<'info' | 'mock'>('info');

  return (
    <div>
      <h2 className="font-fun text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-3xl">🏆</span>
        <span className="text-amber-600">模拟考试</span>
      </h2>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'info', label: '📋 考试信息' },
          { key: 'mock', label: '🏆 模拟考试' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeTab === key
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-fun hover:shadow-fun-lg hover:-translate-y-0.5'
                : 'bg-white text-slate-500 border-2 border-amber-100 hover:border-amber-300 hover:text-amber-600 hover:shadow-card'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="space-y-6 animate-slide-up">
          {/* 考试结构 */}
          <div className="bg-white rounded-3xl border-2 border-amber-100 p-6 shadow-fun">
            <h3 className="font-fun font-bold text-amber-800 mb-4 text-lg">📊 CET-6 考试结构</h3>
            <div className="space-y-3">
              {examStructure.map((s, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 ${s.bg} rounded-2xl border-2 ${s.border} border-l-4 ${s.borderL} transition-all duration-200 hover:shadow-sm hover:scale-[1.01]`}>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl shadow-sm`}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-fun font-bold text-slate-800">{s.section}</div>
                    <div className="text-xs text-slate-500 font-medium">{s.time} · {s.items}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-fun text-lg font-bold text-violet-600">{s.score}</div>
                    <div className="text-xs text-slate-400 font-semibold">{s.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5 pt-4 border-t-2 border-amber-100">
              <span className="font-fun font-bold text-slate-700">
                总分：710分 | 及格线：425分 | 考试时长：130分钟
              </span>
            </div>
          </div>

          {/* 备考建议 */}
          <div className="grid grid-cols-2 gap-3">
            {examTips.map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-amber-100 shadow-fun p-4 transition-all duration-200 hover:shadow-fun-lg hover:-translate-y-0.5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <h4 className="font-fun font-semibold text-sm text-amber-800 mb-1">{tip.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{tip.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分数等级 */}
          <div className="bg-white rounded-3xl border-2 border-amber-100 p-6 shadow-fun">
            <h3 className="font-fun font-bold text-amber-800 mb-4 text-lg">🎯 分数等级对照</h3>
            <div className="space-y-2">
              {scoreTable.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 ${s.bg} rounded-2xl border-2 border-transparent transition-all duration-200 hover:shadow-sm`}>
                  <div className="w-24 text-center">
                    <span className={`font-fun text-lg font-bold ${s.color}`}>{s.range}</span>
                  </div>
                  <div className="w-16 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold text-white ${s.badge} shadow-sm`}>{s.level}</span>
                  </div>
                  <div className="flex-1 text-xs text-slate-600 font-medium">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mock' && (
        <div className="text-center py-16 animate-slide-up">
          <div className="relative inline-block mb-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-fun-lg">
              <span className="text-6xl">🏆</span>
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-float">⭐</div>
          </div>
          <h3 className="font-fun text-2xl font-bold text-slate-800 mb-2">模拟考试功能即将上线</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            将按真实 CET-6 结构自动组卷，包含计时、自动评分、成绩分析等功能。
          </p>
          <div className="inline-flex gap-4 text-sm text-slate-400 font-medium flex-wrap justify-center">
            {examStructure.map((s) => (
              <span key={s.section} className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-2xl border-2 border-amber-100 shadow-sm">
                <span>{s.icon}</span>
                {s.section} {s.time}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
