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

  if (loading && !selected) return <div className="flex justify-center h-64 items-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"/></div>;

  if (tab === 'tips') return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">翻译训练</h2>
        <button onClick={()=>setTab('practice')} className="px-3 py-1.5 text-sm rounded-lg bg-white border text-slate-600 hover:bg-slate-50">← 返回练习</button>
      </div>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">{i+1}</div>
            <p className="text-sm text-slate-700 pt-0.5">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">翻译训练 <span className="text-sm font-normal text-slate-400">({exercises.length}篇)</span></h2>
        <button onClick={()=>setTab('tips')} className="px-3 py-1.5 text-sm rounded-lg bg-white border text-slate-600 hover:bg-slate-50">💡 翻译技巧</button>
      </div>

      {!selected ? (
        <div className="grid gap-3">
          {exercises.map((ex) => (
            <button key={ex.id} onClick={()=>loadExercise(ex.id)}
              className="bg-white rounded-xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">{ex.exam_year||'真题'}</span>
                <span className="text-xs text-slate-400">难度 {'★'.repeat(ex.difficulty||3)}</span>
              </div>
              <p className="text-sm text-slate-700 line-clamp-2">{ex.source_text_cn}</p>
              {ex.key_points && <div className="mt-2 flex gap-1 flex-wrap">{ex.key_points.split(',').slice(0,4).map((kp:string)=><span key={kp} className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">{kp.trim()}</span>)}</div>}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={()=>{setSelected(null);setReference('');}} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">← 返回列表</button>
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{selected.exam_year||'真题'}</span>
              <span className="text-xs text-slate-400">难度 {'★'.repeat(selected.difficulty||3)}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">📝 请将以下中文翻译成英语：</h3>
            <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm leading-relaxed">{selected.source_text_cn}</div>
            {selected.key_points && <div className="mt-3 flex gap-1 flex-wrap"><span className="text-xs text-amber-600 font-medium">采分点：</span>{selected.key_points.split(',').map((kp:string)=><span key={kp} className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">{kp.trim()}</span>)}</div>}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="font-semibold text-slate-800 mb-3">✍️ 你的翻译：</h3>
            <textarea value={userTranslation} onChange={e=>setUserTranslation(e.target.value)}
              placeholder="在此输入你的英语译文..." disabled={!!reference}
              className="w-full h-40 p-4 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"/>
            {!reference && <button onClick={handleSubmit} disabled={!userTranslation.trim()}
              className="mt-3 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 disabled:opacity-50 text-sm">提交对照</button>}
          </div>
          {reference && <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
            <h3 className="font-semibold text-emerald-800 mb-3">✅ 参考译文：</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{reference}</p>
            <p className="text-xs text-slate-500 mt-4">请对照参考译文，注意采分点是否翻译到位。记录薄弱环节，针对性积累相关主题词汇。</p>
          </div>}
        </div>
      )}
    </div>
  );
}
