import { useState } from 'react';

const phases = [
  {
    title: '第一阶段：基础夯实期（1-2个月）',
    icon: '🏗️',
    items: [
      { label: '词汇积累', desc: '每天 30-50 个六级核心词，优先高频 2000 词，按艾宾浩斯遗忘曲线复习，结合真题例句记忆' },
      { label: '语法补漏', desc: '主谓一致、时态、常见从句（定从/状从/名从）、非谓语动词；每天 1 个语法点 + 5 道练习' },
      { label: '听力入门', desc: '从精听入手，每天 10 分钟真题短对话，逐句听写，标记听不清的连读弱读' },
    ],
  },
  {
    title: '第二阶段：题型强化期（2-3个月）',
    icon: '⚔️',
    items: [
      { label: '听力专项', desc: '先看选项预判主题 → 听时抓关键词（but/however、数字、地点）→ 长对话重点听开头结尾；每周精做 2-3 套听力真题，错题反复听' },
      { label: '阅读专项', desc: '长篇阅读先划题干关键词快速扫读定位；仔细阅读先题后文，答案多在定位句前后 1-2 句；选词填空放最后做' },
      { label: '翻译专项', desc: '背常考主题短语（文化、科技、社会类），每周练 2-3 篇真题翻译，对比参考译文修改' },
      { label: '写作专项', desc: '整理 2-3 套通用模板框架 + 积累 30-50 个高级替换词，每周写 1 篇真题作文，对照范文优化' },
    ],
  },
  {
    title: '第三阶段：冲刺模考期（最后1个月）',
    icon: '🚀',
    items: [
      { label: '整套模考', desc: '每周 2 套完整真题模考，严格按考试时间（写作30min + 听力30min + 阅读40min + 翻译30min）' },
      { label: '错题复盘', desc: '每道错题问自己三个问题：为什么错？（词汇不认识/语法不会/技巧不足？）→ 针对性补漏 → 同类型题再练' },
      { label: '优化策略', desc: '确定最适合自己的答题顺序（如阅读慢者可先做仔细阅读再做长篇匹配，选词填空最后做）' },
      { label: '心态调整', desc: '考前一星期调整作息，保持手感但不过度紧张；放弃难题执念，确保基础分不丢' },
    ],
  },
];

const strategies = [
  {
    title: '听力策略',
    icon: '🎧',
    score: '248.5分',
    weight: '35%',
    tips: [
      '正式开始前快速浏览选项，预判对话/讲座主题',
      '听时关注转折词（but, however, actually）和强调词（especially, in particular）',
      '数字、时间、地点、人物身份是高频考点',
      '长对话和讲座篇章：重点听开头 30 秒和结尾总结句',
      '六级听力语速较快（约 150词/分钟），精听比泛听有效10倍',
      '边听边涂答题卡！听力结束立即收答题卡，没有额外涂卡时间',
    ],
  },
  {
    title: '阅读策略',
    icon: '📖',
    score: '248.5分',
    weight: '35%',
    tips: [
      '选词填空（5%）：分值最低，基础一般者可放到最后做',
      '长篇匹配阅读（10%）：先划题干关键词→快速扫读段落首尾句→定位匹配',
      '仔细阅读（20%）：先读题干再读文章，答案一般在定位句前后 1-2 句',
      '科普类文章占比逐年提升，积累科技类词汇和学术表达',
      '阅读速度目标：仔细阅读 8-10 分钟/篇，长篇匹配 15 分钟',
      '遇到生词不要停，结合上下文推测含义，重点关注转折和因果逻辑',
    ],
  },
  {
    title: '写作策略',
    icon: '✍️',
    score: '106.5分',
    weight: '15%',
    tips: [
      '审题 2 分钟：确定题型（观点类/现象类/问题解决类/图表类）',
      '列提纲 3 分钟：开头引入→2-3 个论点→结论',
      '正文 20 分钟：骨架（模板）+ 血肉（自己的语料），避免模板痕迹过重',
      '检查 5 分钟：拼写、主谓一致、时态一致性',
      '积累 30-50 个高级替换词（very→extremely, important→pivotal）',
      '三段式结构最稳妥：引言段（2-3句）+ 主体段（6-8句）+ 结论段（2-3句）',
    ],
  },
  {
    title: '翻译策略',
    icon: '🌐',
    score: '106.5分',
    weight: '15%',
    tips: [
      '先通读中文全文，理解整体意思再动笔',
      '确定英语主干结构（主谓宾），再添加修饰成分',
      '避免逐字直译，追求意译和自然表达',
      '常考主题：中国传统文化、科技发展、社会热点、经济教育',
      '不会的词用已知的近义词替换，不要留空',
      '翻译完成后通读检查：时态一致性、单复数、冠词用法',
    ],
  },
];

const pitfalls = [
  { wrong: '盲目背 5500 大纲词', right: '优先级：高频核心词 2000 → 真题生词 → 完整大纲' },
  { wrong: '只背单词不刷题', right: '学练结合，每天 30 词 + 20 分钟真题训练同步推进' },
  { wrong: '盲目刷题不复盘', right: '每道错题分析原因（词汇/语法/技巧），整理错题本' },
  { wrong: '过早做整套模考', right: '先分题型逐个击破，考前 1 个月再开始整卷模考' },
  { wrong: '忽视翻译和写作', right: '这两项提分快，提前准备模板和语料库，每周至少练习 1 次' },
  { wrong: '迷信万能模板', right: '模板骨架 + 个性化语料，让作文既有结构又有内容' },
  { wrong: '听力泛听不精听', right: '精听一篇胜过泛听十篇，逐句听写是最高效的方法' },
  { wrong: '阅读逐字逐句读', right: '扫读 + 定位 + 精读结合，关键词是利器' },
];

export default function Strategy() {
  const [activeTab, setActiveTab] = useState<'plan' | 'strategy' | 'pitfall'>('plan');

  return (
    <div>
      <h2 className="text-2xl font-bold font-fun bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-1">备考思路</h2>
      <p className="text-slate-500 text-sm mb-6">科学规划 + 专项策略 + 避坑指南，高效备考 CET-6</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'plan', label: '📅 三阶段规划' },
          { key: 'strategy', label: '🎯 题型策略' },
          { key: 'pitfall', label: '⚠️ 避坑指南' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              activeTab === key
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-fun hover:shadow-fun-lg hover:-translate-y-0.5'
                : 'bg-white text-slate-600 border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-card'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'plan' && (
        <div className="space-y-6">
          {/* 核心原则 */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-6 text-white shadow-fun-lg">
            <h3 className="text-lg font-bold font-fun mb-3">💡 备考核心原则</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:bg-white/15">
                <div className="font-semibold mb-1">🎯 抓大放小</div>
                <div className="opacity-80">听力(248.5) + 阅读(248.5) = 70%，主攻方向</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:bg-white/15">
                <div className="font-semibold mb-1">📝 围绕真题</div>
                <div className="opacity-80">所有练习围绕近 3 年真题，不做偏题难题</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:bg-white/15">
                <div className="font-semibold mb-1">⏰ 每日固定</div>
                <div className="opacity-80">每天 1.5-2 小时，不贪多求快，贵在坚持</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:bg-white/15">
                <div className="font-semibold mb-1">✅ 放弃难点</div>
                <div className="opacity-80">先保证拿到基础分，难题不计较</div>
              </div>
            </div>
          </div>

          {/* Three Phases */}
          {phases.map((phase, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-indigo-100 shadow-fun p-5 transition-all duration-200 hover:shadow-fun-lg">
              <h3 className="text-lg font-bold text-indigo-800 font-fun mb-3">
                <span className="mr-2">{phase.icon}</span>
                {phase.title}
              </h3>
              <div className="space-y-3">
                {phase.items.map((item, j) => (
                  <div key={j} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 mt-1.5 shrink-0 shadow-sm" />
                    <div>
                      <span className="font-semibold text-slate-700 text-sm">{item.label}：</span>
                      <span className="text-sm text-slate-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'strategy' && (
        <div className="space-y-4">
          {/* 分数结构 */}
          <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-fun p-5">
            <h3 className="font-bold text-indigo-800 font-fun mb-3">📊 CET-6 分数结构</h3>
            <div className="flex gap-1.5 h-10 rounded-2xl overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold rounded-l-2xl" style={{ width: '35%' }}>听力 35%</div>
              <div className="bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold" style={{ width: '35%' }}>阅读 35%</div>
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center text-white text-xs font-semibold" style={{ width: '15%' }}>写作 15%</div>
              <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center text-white text-xs font-semibold rounded-r-2xl" style={{ width: '15%' }}>翻译 15%</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">满分 710 分 | 425 分及格 | 听力阅读各 248.5 分 | 写作翻译各 106.5 分</p>
          </div>

          {strategies.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-indigo-100 border-l-4 border-l-indigo-400 shadow-fun p-5 transition-all duration-200 hover:shadow-fun-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-indigo-800 font-fun">
                  <span className="mr-2">{s.icon}</span>
                  {s.title}
                </h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-semibold border border-indigo-100">{s.score} · {s.weight}</span>
              </div>
              <div className="space-y-2">
                {s.tips.map((tip, j) => (
                  <div key={j} className="flex gap-2 text-sm">
                    <span className="text-indigo-400 shrink-0 font-semibold">{j + 1}.</span>
                    <span className="text-slate-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pitfall' && (
        <div className="space-y-2">
          <p className="text-sm text-slate-500 mb-4">以下是用无数考生血泪教训总结的 8 大误区，提前避开等于多拿 50 分。</p>
          {pitfalls.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-rose-100 shadow-fun p-4 transition-all duration-200 hover:shadow-fun-lg hover:-translate-y-0.5">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">✕</div>
                <div className="flex-1">
                  <div className="text-sm text-red-500 line-through mb-1 font-medium">{p.wrong}</div>
                  <div className="flex gap-1.5 items-start">
                    <span className="text-emerald-500 font-bold text-sm mt-0.5 shrink-0">→</span>
                    <span className="text-sm text-emerald-700 font-medium">{p.right}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
