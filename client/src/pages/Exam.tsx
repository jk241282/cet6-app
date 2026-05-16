import { useState } from 'react';

const examStructure = [
  { section: '写作', time: '30分钟', items: '1篇作文', score: '106.5分', percentage: '15%', icon: '✍️' },
  { section: '听力', time: '30分钟', items: '25题', score: '248.5分', percentage: '35%', icon: '🎧' },
  { section: '阅读理解', time: '40分钟', items: '30题', score: '248.5分', percentage: '35%', icon: '📖' },
  { section: '翻译', time: '30分钟', items: '1段汉译英', score: '106.5分', percentage: '15%', icon: '🌐' },
];

const examTips = [
  { title: '时间分配', content: '写作30分钟 → 听力30分钟 → 阅读40分钟 → 翻译30分钟。全程130分钟，中间不休息。' },
  { title: '答题顺序建议', content: '写作(先写) → 听力(固定顺序) → 仔细阅读(20分钟) → 长篇匹配(15分钟) → 翻译(30分钟) → 选词填空(5分钟)。选词填空分低题多，放最后。' },
  { title: '涂卡策略', content: '听力边听边涂，结束立即收卡！阅读和翻译可以用最后几分钟统一涂，但建议做完一大题涂一次。' },
  { title: '心理准备', content: '遇到难题不要慌，先跳过，保证会做的题拿满分。六级是排位制，你不会的别人也不会。及格线425分。' },
];

const scoreTable = [
  { range: '630-710', level: '优秀', desc: '听力阅读接近满分，写作翻译表达地道' },
  { range: '550-629', level: '良好', desc: '各题型基础扎实，可冲刺更高目标' },
  { range: '425-549', level: '及格', desc: '达到毕业/求职基本要求' },
  { range: '<425', level: '未通过', desc: '需要加强基础训练，重点突破弱项' },
];

export default function Exam() {
  const [activeTab, setActiveTab] = useState<'info' | 'mock'>('info');

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">模拟考试</h2>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'info', label: '📋 考试信息' },
          { key: 'mock', label: '🏆 模拟考试' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* 考试结构 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">📊 CET-6 考试结构</h3>
            <div className="space-y-3">
              {examStructure.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 text-sm">{s.section}</div>
                    <div className="text-xs text-slate-500">{s.time} · {s.items}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-indigo-600">{s.score}</div>
                    <div className="text-xs text-slate-400">{s.percentage}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4 text-sm font-medium text-slate-600">
              总分：710分 | 及格线：425分 | 考试时长：130分钟
            </div>
          </div>

          {/* 备考建议 */}
          <div className="grid grid-cols-2 gap-3">
            {examTips.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                <h4 className="font-semibold text-sm text-slate-800 mb-1">{tip.title}</h4>
                <p className="text-xs text-slate-500">{tip.content}</p>
              </div>
            ))}
          </div>

          {/* 分数等级 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">🎯 分数等级对照</h3>
            <div className="space-y-2">
              {scoreTable.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-20 text-center">
                    <span className={`text-sm font-bold ${
                      s.level === '优秀' ? 'text-emerald-600' :
                      s.level === '良好' ? 'text-indigo-600' :
                      s.level === '及格' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>{s.range}</span>
                  </div>
                  <div className="w-12 text-center">
                    <span className="text-xs px-2 py-0.5 bg-white rounded-full text-slate-600">{s.level}</span>
                  </div>
                  <div className="flex-1 text-xs text-slate-500">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mock' && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">模拟考试功能即将上线</h3>
          <p className="text-slate-500 text-sm mb-4">
            将按真实 CET-6 结构自动组卷，包含计时、自动评分、成绩分析等功能。
          </p>
          <div className="inline-flex gap-4 text-sm text-slate-500">
            <span>📝 写作30min</span>
            <span>🎧 听力30min</span>
            <span>📖 阅读40min</span>
            <span>🌐 翻译30min</span>
          </div>
        </div>
      )}
    </div>
  );
}
