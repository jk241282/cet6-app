import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Translation() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [userTranslation, setUserTranslation] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'practice'|'tips'>('practice');

  useEffect(() => {
    api.get('/translation/exercises?limit=50').then(({ data }) => {
      setExercises(data.exercises || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadExercise = async (id: number) => {
    setLoading(true); setReference(''); setUserTranslation('');
    const { data } = await api.get(`/translation/exercises/${id}`);
    setSelected(data.exercise); setLoading(false);
  };
  const handleSubmit = async () => {
    if (!userTranslation.trim()) return;
    const { data } = await api.post(`/translation/exercises/${selected.id}/submit`, { userTranslation });
    setReference(data.reference);
  };

  const tips = [
    '先通读中文全文，理解整体意思再动笔翻译',
    '确定英语主干结构（主谓宾），再添加修饰成分',
    '避免逐字直译，追求意译和自然流畅的表达',
    '遇到不会的词，用已知的近义词或解释性翻译替代',
    '翻译完成后通读检查：时态一致性、单复数、冠词用法',
    '注意中文无主语句 → 英语必须补主语或用被动语态',
    '四字成语 → 意译核心含义，不必逐字翻译',
    '流水句转树形句：用定语从句、分词、with复合结构',
  ];

  const tipColors = [
    'bg-rose-100 text-rose-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-200 text-rose-700',
    'bg-amber-200 text-amber-700',
    'bg-rose-100 text-rose-600',
    'bg-amber-100 text-amber-600',
    'bg-rose-200 text-rose-700',
    'bg-amber-200 text-amber-700',
  ];

  if (loading && !selected) return (
    <div className="flex justify-center h-64 items-center">
      <div className="animate-spin h-8 w-8 border-4 border-rose-400 border-t-transparent rounded-full" />
    </div>
  );

  if (tab === 'tips') return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-2 text-4xl opacity-20 float-decor pointer-events-none select-none">✨</div>
      <div className="absolute -bottom-6 -left-2 text-3xl opacity-15 float-decor pointer-events-none select-none" style={{ animationDelay: '1.5s' }}>🌸</div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-fun font-bold text-rose-500 flex items-center gap-2">
          <span className="text-3xl">📖</span> 翻译技巧
          <span className="text-sm font-normal text-rose-300 font-sans ml-1">Translation Tips</span>
        </h2>
        <button onClick={()=>setTab('practice')}
          className="btn-fun bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-2 text-sm">
          ← 返回练习
        </button>
      </div>

      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i}
            className="card-fun rounded-2xl card-border-coral p-4 flex gap-3 items-start group cursor-default">
            <div className={`w-8 h-8 rounded-full ${tipColors[i]} flex items-center justify-center text-sm font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
              {i+1}
            </div>
            <p className="text-sm text-slate-600 pt-1 leading-relaxed group-hover:text-slate-800 transition-colors">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Decorative floating elements */}
      <div className="absolute -top-3 -right-2 text-3xl opacity-20 float-decor pointer-events-none select-none">✨</div>
      <div className="absolute top-12 -left-1 text-2xl opacity-15 float-decor pointer-events-none select-none" style={{ animationDelay: '2s' }}>🌟</div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-fun font-bold text-rose-500 flex items-center gap-2">
          <span className="text-3xl">🌐</span> 翻译训练
          <span className="text-sm font-normal text-rose-300 font-sans">({exercises.length}篇)</span>
        </h2>
        <button onClick={()=>setTab('tips')}
          className="btn-fun bg-gradient-to-r from-rose-400 to-pink-500 px-4 py-2 text-sm">
          💡 翻译技巧
        </button>
      </div>

      {!selected ? (
        <div className="grid gap-3">
          {exercises.map((ex) => (
            <button key={ex.id} onClick={()=>loadExercise(ex.id)}
              className="bg-white rounded-2xl p-4 border-2 border-rose-50 text-left hover:border-rose-200 hover:shadow-fun-lg transition-all duration-300 hover:-translate-y-0.5 shadow-fun group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2.5 py-0.5 bg-rose-50 text-rose-500 rounded-full font-medium">{ex.exam_year||'真题'}</span>
                <span className="text-xs text-rose-300">难度 {'★'.repeat(ex.difficulty||3)}</span>
              </div>
              <p className="text-sm text-slate-700 line-clamp-2 group-hover:text-slate-900 transition-colors">{ex.source_text_cn}</p>
              {ex.key_points && <div className="mt-2 flex gap-1.5 flex-wrap">{ex.key_points.split(',').slice(0,4).map((kp:string)=><span key={kp} className="text-xs bg-sunny-50 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">{kp.trim()}</span>)}</div>}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={()=>{setSelected(null);setReference('');}}
            className="text-sm text-rose-500 hover:text-rose-700 hover:underline mb-4 inline-flex items-center gap-1 font-medium transition-colors">
            <span className="text-base">←</span> 返回列表
          </button>

          <div className="bg-white rounded-2xl border-2 border-rose-100 shadow-fun p-6 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-rose-50 text-rose-500 px-2.5 py-0.5 rounded-full font-medium">{selected.exam_year||'真题'}</span>
              <span className="text-xs text-rose-300">难度 {'★'.repeat(selected.difficulty||3)}</span>
            </div>
            <h3 className="text-lg font-fun font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-xl">📝</span> 请将以下中文翻译成英语：
            </h3>
            <div className="bg-cream rounded-2xl p-5 text-slate-700 text-sm leading-relaxed border border-rose-50">{selected.source_text_cn}</div>
            {selected.key_points && <div className="mt-3 flex gap-1.5 flex-wrap items-center"><span className="text-xs text-amber-600 font-medium">🎯 采分点：</span>{selected.key_points.split(',').map((kp:string)=><span key={kp} className="text-xs bg-sunny-50 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">{kp.trim()}</span>)}</div>}
          </div>

          <div className="bg-white rounded-2xl border-2 border-rose-100 shadow-fun p-6 mb-5">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 font-fun">
              <span className="text-lg">✍️</span> 你的翻译：
            </h3>
            <textarea value={userTranslation} onChange={e=>setUserTranslation(e.target.value)}
              placeholder="在此输入你的英语译文..." disabled={!!reference}
              className="w-full h-40 p-4 border-2 border-rose-100 rounded-2xl text-sm focus:border-rose-400 focus:ring-4 focus:ring-rose-400/10 outline-none resize-none transition-all placeholder:text-rose-300"/>
            {!reference && <button onClick={handleSubmit} disabled={!userTranslation.trim()}
              className="btn-fun bg-gradient-to-r from-rose-400 to-pink-500 mt-3 px-6 py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              ✨ 提交对照
            </button>}
          </div>

          {reference && <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-200 shadow-fun p-6 relative overflow-hidden">
            <div className="absolute top-2 right-2 text-2xl opacity-20 pointer-events-none select-none">✅</div>
            <h3 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2 font-fun">
              <span className="text-lg">✅</span> 参考译文：
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{reference}</p>
            <p className="text-xs text-emerald-600 mt-4 pt-3 border-t border-emerald-200/60">
              📌 请对照参考译文，注意采分点是否翻译到位。记录薄弱环节，针对性积累相关主题词汇。
            </p>
          </div>}
        </div>
      )}
    </div>
  );
}
