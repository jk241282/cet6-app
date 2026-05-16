import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Translation() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [userTranslation, setUserTranslation] = useState('');
  const [reference, setReference] = useState('');
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'practice' | 'tips'>('practice');

  useEffect(() => {
    api.get('/translation/exercises').then(({ data }) => {
      setExercises(data.exercises);
      setLoading(false);
    }).catch(() => setLoading(false));
    api.get('/translation/tips').then(({ data }) => setTips(data.tips)).catch(() => {});
  }, []);

  const loadExercise = async (id: number) => {
    setLoading(true);
    setReference('');
    setUserTranslation('');
    const { data } = await api.get(`/translation/exercises/${id}`);
    setSelected(data.exercise);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!userTranslation.trim()) return;
    const { data } = await api.post(`/translation/exercises/${selected.id}/submit`, { userTranslation });
    setReference(data.reference);
  };

  if (tab === 'tips') {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">翻译训练</h2>
          <div className="flex gap-2">
            <button onClick={() => setTab('practice')} className="px-3 py-1.5 text-sm rounded-lg bg-white border border-slate-200 text-slate-600">练习</button>
            <button onClick={() => setTab('tips')} className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white">技巧</button>
          </div>
        </div>
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
              <p className="text-sm text-slate-700 pt-0.5">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">翻译训练</h2>
        <button onClick={() => setTab('tips')} className="px-3 py-1.5 text-sm rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
          查看技巧
        </button>
      </div>

      {!selected ? (
        <div className="grid gap-3">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => loadExercise(ex.id)}
              className="bg-white rounded-xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full">
                  {ex.exam_year || '模拟题'}
                </span>
                <span className="text-xs text-slate-400">难度 {'★'.repeat(ex.difficulty)}</span>
              </div>
              <p className="text-sm text-slate-700 line-clamp-2">{ex.source_text_cn}</p>
              {ex.key_points && (
                <div className="mt-2 flex gap-1 flex-wrap">
                  {ex.key_points.split(',').map((kp: string) => (
                    <span key={kp} className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">{kp.trim()}</span>
                  ))}
                </div>
              )}
            </button>
          ))}
          {exercises.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg mb-2">暂无翻译题目</p>
              <p className="text-sm">数据正在陆续录入中</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button onClick={() => { setSelected(null); setReference(''); }} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
            ← 返回列表
          </button>

          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{selected.exam_year || '模拟'}</span>
              <span className="text-xs text-slate-400">难度 {'★'.repeat(selected.difficulty)}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">📝 请将以下中文翻译成英语：</h3>
            <div className="bg-slate-50 rounded-lg p-4 text-slate-700 text-sm leading-relaxed">
              {selected.source_text_cn}
            </div>
            {selected.key_points && (
              <div className="mt-3 flex gap-1 flex-wrap">
                <span className="text-xs text-amber-600 font-medium">采分点：</span>
                {selected.key_points.split(',').map((kp: string) => (
                  <span key={kp} className="text-xs bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">{kp.trim()}</span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="font-semibold text-slate-800 mb-3">✍️ 你的翻译：</h3>
            <textarea
              value={userTranslation}
              onChange={(e) => setUserTranslation(e.target.value)}
              placeholder="在此输入你的英语译文..."
              className="w-full h-40 p-4 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              disabled={!!reference}
            />
            {!reference && (
              <button
                onClick={handleSubmit}
                disabled={!userTranslation.trim()}
                className="mt-3 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-colors text-sm"
              >
                提交对照
              </button>
            )}
          </div>

          {reference && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <h3 className="font-semibold text-emerald-800 mb-3">✅ 参考译文：</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{reference}</p>
              <p className="text-xs text-slate-500 mt-4">请对照参考译文，注意标红的采分点是否翻译到位。记录自己的薄弱环节，针对性积累相关主题词汇。</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
