import { useState } from 'react';

const listeningTips = [
  { title: '预判策略', desc: '听力开始前快速浏览选项，预测对话主题和可能的问题类型。特别注意选项中的名词、数字和动词。', icon: '🔮' },
  { title: '关键词捕捉', desc: '重点关注转折词(but, however, actually)、强调词(especially, in particular)、因果词(because, therefore)、数字和时间。', icon: '🔑' },
  { title: '首尾法则', desc: '长对话和讲座篇章的开头30秒和结尾总结句往往包含关键信息，是高频出题点。', icon: '📍' },
  { title: '笔记技巧', desc: '边听边记关键词，用缩写和符号代替完整单词。关注: 谁(who)、做什么(what)、何时(when)、何地(where)、为什么(why)。', icon: '✏️' },
  { title: '精听方法', desc: '精听一篇胜过泛听三十篇。方法：逐句听写 → 对照原文 → 标记连读弱读 → 跟读模仿。每天10-15分钟即可。', icon: '🎯' },
  { title: '涂卡提醒', desc: '六级听力结束后立即收答题卡！必须边听边涂，不要留到最后统一涂。听到不确定的题先蒙一个涂上，后面没时间返回修改。', icon: '⚠️' },
];

const sampleEpisodes = [
  {
    title: '2023年12月 CET-6 听力 Section A — 长对话',
    type: '长对话',
    examYear: '2023-12',
    transcript: `W: Professor, I'm having difficulty understanding the concept of cultural relativism.
M: Well, cultural relativism is the idea that a person's beliefs and practices should be understood based on that person's own culture, rather than be judged against the criteria of another.
W: So we shouldn't judge other cultures by our own standards?
M: Exactly. What may seem strange or even wrong in one culture might be perfectly normal in another. However, this doesn't mean we must accept all cultural practices unconditionally.
W: I see. So it's about understanding context rather than making quick judgments?
M: Precisely. And this principle is particularly important in fields like anthropology and international relations.`,
    transcriptCn: '女：教授，我很难理解文化相对主义这个概念。\n男：文化相对主义是指一个人的信仰和实践应该基于其自身文化来理解，而不是用另一个文化的标准来评判。\n女：所以我们不应该用自己的标准来评判其他文化？\n男：正是如此。在一种文化中看起来奇怪甚至错误的做法，在另一种文化中可能完全正常。但这并不意味着我们必须无条件接受所有文化实践。\n女：我明白了。所以关键是要理解背景，而不是匆忙下判断？\n男：完全正确。这个原则在人类学和国际关系等领域尤为重要。',
    keyWords: 'cultural relativism, beliefs and practices, anthropology, international relations',
  },
  {
    title: 'CET-6 听力讲座 — Climate Change Communication',
    type: '讲座/讲话',
    examYear: '2024-06',
    transcript: `Good morning, everyone. Today I'd like to discuss the challenge of communicating climate science to the general public. Despite overwhelming scientific consensus, a significant portion of the population remains skeptical about the severity of climate change. Why is this the case?

Research suggests several factors. First, climate change is a slow-moving, abstract threat. Our brains are wired to respond to immediate, visible dangers rather than gradual, statistical ones. Second, political polarization has turned climate change into an identity issue rather than a scientific one. People tend to accept information that aligns with their existing worldview and reject information that contradicts it.

So how can we bridge this communication gap? One promising approach is to frame climate messages in terms of local impacts and personal values. Instead of talking about global temperature averages, we might discuss how climate change affects local farming or increases the risk of flooding in specific communities. Another effective strategy is to emphasize solutions rather than just problems, giving people a sense of agency rather than helplessness.`,
    transcriptCn: '大家早上好。今天我想讨论向公众传达气候科学的挑战。尽管有压倒性的科学共识，相当一部分人仍然对气候变化的严重性持怀疑态度。为什么会这样？研究表明有几个因素。首先，气候变化是一种缓慢的、抽象的威胁……',
    keyWords: 'climate communication, scientific consensus, polarization, framing, local impacts',
  },
];

export default function Listening() {
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);

  return (
    <div>
      <h2 className="font-fun text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-3xl">🎧</span>
        <span className="text-teal-600">听力训练</span>
      </h2>

      {!selectedEpisode ? (
        <>
          {/* 技巧卡片 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {listeningTips.map((tip, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-teal-100 shadow-fun p-4 border-l-4 border-l-teal-400 transition-all duration-200 hover:shadow-fun-lg hover:-translate-y-0.5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{tip.icon}</span>
                  <div>
                    <h4 className="font-fun font-semibold text-sm text-teal-800 mb-1">{tip.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-fun font-semibold text-teal-700 mb-3 flex items-center gap-2">
            <span>📻</span> 听力材料
          </h3>
          <div className="grid gap-3">
            {sampleEpisodes.map((ep, i) => (
              <button
                key={i}
                onClick={() => setSelectedEpisode(ep)}
                className="bg-white rounded-2xl border-2 border-teal-100 shadow-fun p-5 text-left transition-all duration-200 hover:shadow-fun-lg hover:-translate-y-1 hover:border-teal-200 w-full"
              >
                <h3 className="font-fun font-semibold text-slate-800 text-sm hover:text-teal-600 transition-colors">
                  {ep.title}
                </h3>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    ep.type === '长对话'
                      ? 'bg-pink-50 text-pink-600 border-pink-200'
                      : 'bg-cyan-50 text-cyan-600 border-cyan-200'
                  }`}>{ep.type}</span>
                  <span className="text-xs px-2.5 py-1 bg-slate-50 text-slate-400 rounded-full font-medium">{ep.examYear}</span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-6 font-medium">
            📌 听力音频功能需连接后端音频服务，当前展示听力原文供精听练习。更多真题听力材料持续录入中。
          </p>
        </>
      ) : (
        <div className="animate-slide-up">
          <button
            onClick={() => setSelectedEpisode(null)}
            className="btn-fun bg-gradient-to-r from-teal-400 to-cyan-500 px-4 py-2 text-sm mb-4 inline-flex items-center gap-1"
          >
            ← 返回列表
          </button>

          <div className="bg-white rounded-3xl border-2 border-teal-100 p-6 mb-6 shadow-fun">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
                selectedEpisode.type === '长对话'
                  ? 'bg-pink-50 text-pink-600 border-pink-200'
                  : 'bg-cyan-50 text-cyan-600 border-cyan-200'
              }`}>{selectedEpisode.type}</span>
              <span className="text-xs text-slate-400 font-medium">{selectedEpisode.examYear}</span>
            </div>
            <h3 className="font-fun text-xl font-bold text-slate-800 mb-4">{selectedEpisode.title}</h3>

            <div className="bg-amber-50 rounded-2xl p-4 mb-4 border-2 border-amber-100">
              <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">🔑 关键词</h4>
              <p className="text-sm text-slate-700">{selectedEpisode.keyWords}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 mb-4 border-2 border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">📝 听力原文 (Transcript)</h4>
              <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                {selectedEpisode.transcript}
              </div>
            </div>

            <details className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-100">
              <summary className="text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-teal-600 transition-colors">🌐 中文翻译</summary>
              <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed mt-3">
                {selectedEpisode.transcriptCn}
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
