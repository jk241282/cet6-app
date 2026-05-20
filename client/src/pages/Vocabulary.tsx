import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import VocabCard from '../components/VocabCard';
import { useVocabStore } from '../store/vocabStore';
import { Star } from '../components/OwlMascot';

interface WordDetail { word: any; meanings: any[]; examples: any[]; phrases: any[]; relations: any[]; }

export default function Vocabulary() {
  const [tab, setTab] = useState<'learn' | 'search' | 'list'>('learn');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-fun text-2xl font-bold text-slate-800">词汇学习</h2>
          <span className="text-xs font-semibold text-violet-500 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            📚 7634 词
          </span>
        </div>
        <div className="flex bg-slate-100/80 rounded-2xl p-1 sm:p-1.5 gap-0.5 sm:gap-1">
          {[
            { key: 'learn', label: '背诵', icon: '📝' },
            { key: 'search', label: '查询', icon: '🔍' },
            { key: 'list', label: '词表', icon: '📋' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                tab === key
                  ? 'bg-white text-violet-600 shadow-fun shadow-violet-200/30'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-sm sm:text-base">{icon}</span>
              <span className="hidden xs:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {tab === 'learn' && <LearnTab />}
        {tab === 'search' && <SearchTab />}
        {tab === 'list' && <ListTab />}
      </div>
    </div>
  );
}

// ====== 背诵模式 ======
function LearnTab() {
  const [words, setWords] = useState<WordDetail[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState({ mastered: 0, learning: 0, skipped: 0 });
  const [started, setStarted] = useState(false);
  const triggerRefresh = useVocabStore((s) => s.triggerRefresh);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/vocabulary/draw', { count: 10 });
      if (!data.words.length) {
        setWords([]);
        setDone(true);
        setLoading(false);
        return;
      }
      const details = await Promise.all(
        data.words.map((w: any) => api.get(`/vocabulary/${w.id}`).then((r) => r.data))
      );
      setWords(details);
      setCurrentIdx(0);
      setDone(false);
      setStats({ mastered: 0, learning: 0, skipped: 0 });
      setStarted(true);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (status: 'mastered' | 'learning' | 'skipped') => {
    const w = words[currentIdx];
    if (!w) return;
    setStats((p) => ({
      ...p,
      [status === 'mastered' ? 'mastered' : status === 'learning' ? 'learning' : 'skipped']:
        p[status === 'mastered' ? 'mastered' : status === 'learning' ? 'learning' : 'skipped'] + 1,
    }));
    if (currentIdx + 1 < words.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setDone(true);
    }
    try {
      await api.patch(`/vocabulary/${w.word.id}/status`, { status });
      triggerRefresh();
    } catch { /* silently ignore save failure */ }
  };

  if (!started && loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="relative">
          <div className="animate-spin h-14 w-14 border-[5px] border-violet-200 border-t-violet-500 rounded-full" />
          <span className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse-soft">🦉</span>
        </div>
        <span className="text-sm text-slate-400 font-medium">猫头鹰博士正在准备单词...</span>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-slide-up">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-fun-lg">
            <span className="text-5xl">🎉</span>
          </div>
          <Star className="absolute -top-2 -right-2" size={20} />
          <Star className="absolute -bottom-1 -left-2" size={14} />
        </div>
        <h2 className="font-fun text-2xl font-bold text-slate-800 mb-2">
          {words.length === 0 ? '词库暂无新词！' : '本轮完成！'}
        </h2>
        <p className="text-slate-400 text-sm mb-6">继续保持，每天进步一点点 🦉</p>
        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          {[
            { label: '已掌握', value: stats.mastered, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: '需复习', value: stats.learning, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
            { label: '已跳过', value: stats.skipped, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} className={`flex flex-col items-center ${bg} rounded-2xl px-7 py-4 border-2 ${border} shadow-sm`}>
              <span className={`font-fun text-3xl font-bold ${color}`}>{value}</span>
              <span className="text-xs text-slate-400 mt-1 font-medium">{label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={load}
          className="btn-fun px-10 py-3.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white rounded-2xl font-bold text-sm"
        >
          再来一轮 →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-4 mb-6 bg-white rounded-2xl p-3 border-2 border-violet-100">
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-400 rounded-full transition-all duration-500"
            style={{ width: `${((currentIdx) / words.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />{stats.mastered}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />{stats.learning}</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" />{stats.skipped}</span>
        </div>
      </div>
      {words[currentIdx] && (
        <VocabCard
          data={words[currentIdx]}
          onStatus={handleStatus}
          index={currentIdx}
          total={words.length}
        />
      )}
    </div>
  );
}

// ====== 查询模式 ======
function SearchTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<WordDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSelected(null);
    setSearched(true);
    try {
      const { data } = await api.get(`/vocabulary/search?q=${encodeURIComponent(query.trim())}`);
      setResults(data.words);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const loadDetail = async (id: number) => {
    setLoading(true);
    const { data } = await api.get(`/vocabulary/${id}`);
    setSelected(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="输入单词，如 abandon..."
            className="w-full pl-12 pr-4 py-3.5 border-2 border-violet-100 rounded-2xl focus:ring-0 focus:border-violet-400 outline-none text-sm bg-white shadow-fun transition-colors placeholder:text-slate-300"
          />
        </div>
        <button
          onClick={handleSearch}
          className="btn-fun px-7 py-3.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-2xl font-bold text-sm"
        >
          搜索
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-10 w-10 border-[4px] border-violet-200 border-t-violet-500 rounded-full" />
        </div>
      )}

      {selected && !loading && (
        <div>
          <button onClick={() => setSelected(null)} className="text-sm text-violet-600 hover:text-violet-800 mb-4 flex items-center gap-1 font-semibold">
            ← 返回搜索结果
          </button>
          <VocabCard data={selected} showActions={false} />
        </div>
      )}

      {!selected && !loading && results.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-400 mb-3 font-medium">找到 {results.length} 个结果</p>
          {results.map((w: any) => (
            <button
              key={w.id}
              onClick={() => loadDetail(w.id)}
              className="w-full bg-white rounded-2xl p-4 border-2 border-violet-50 text-left hover:shadow-fun hover:border-violet-200 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-fun font-bold text-slate-800 text-lg group-hover:text-violet-600 transition-colors">
                    {w.word}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full font-medium border border-slate-100">
                    {w.part_of_speech}
                  </span>
                </div>
                <span className="text-sm text-slate-500">{w.meaning_cn}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && !selected && (
        <div className="text-center py-16 animate-slide-up">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-fun text-xl font-bold text-slate-700 mb-1">未找到 "{query}"</h3>
          <p className="text-sm text-slate-400">请尝试其他拼写或关键词</p>
        </div>
      )}
    </div>
  );
}

// ====== 词表模式 ======
function ListTab() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [activeLetter, setActiveLetter] = useState('all');
  const [words, setWords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<WordDetail | null>(null);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 500;
  const totalPages = Math.ceil(total / pageSize);
  const refreshKey = useVocabStore((s) => s.refreshKey);

  const loadWords = useCallback(async () => {
    setLoading(true);
    setSelected(null);
    try {
      const { data } = await api.get(
        `/vocabulary/list?letter=${activeLetter}&limit=${pageSize}&page=${page}&status=${filter}`
      );
      setWords(data.words);
      setTotal(data.total);
    } catch { /* ignore */ }
    setLoading(false);
  }, [activeLetter, filter, refreshKey, page, pageSize]);

  useEffect(() => { loadWords(); }, [loadWords]);
  useEffect(() => { setPage(1); }, [activeLetter, filter]);

  const changeStatus = async (wid: number, status: string) => {
    await api.patch(`/vocabulary/${wid}/status`, { status });
    loadWords();
    setEditingId(null);
  };

  const cancelStatus = async (wid: number) => {
    await api.delete(`/vocabulary/${wid}/status`);
    loadWords();
    setEditingId(null);
  };

  const loadDetail = async (id: number) => {
    setLoading(true);
    const { data } = await api.get(`/vocabulary/${id}`);
    setSelected(data);
    setLoading(false);
  };

  const statusConfig: Record<string, { label: string; style: string }> = {
    mastered: { label: '已掌握', style: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    learning: { label: '不熟', style: 'bg-amber-100 text-amber-700 border-amber-200' },
    reviewed: { label: '复习中', style: 'bg-sky-100 text-sky-700 border-sky-200' },
    skipped: { label: '已跳过', style: 'bg-slate-100 text-slate-500 border-slate-200' },
  };

  const statusFilters = [
    { k: 'all', l: '全部' }, { k: 'none', l: '未标记' }, { k: 'mastered', l: '已掌握' },
    { k: 'learning', l: '不熟' }, { k: 'reviewed', l: '复习中' }, { k: 'skipped', l: '已跳过' },
  ];

  return (
    <div>
      {/* Letter selector */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <button
          onClick={() => setActiveLetter('all')}
          className={`px-3.5 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
            activeLetter === 'all'
              ? 'bg-violet-600 text-white shadow-fun shadow-violet-200'
              : 'bg-white text-slate-500 border-2 border-slate-100 hover:border-violet-200 hover:text-violet-600'
          }`}
        >全部</button>
        {letters.map((l) => (
          <button
            key={l}
            onClick={() => setActiveLetter(l)}
            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeLetter === l
                ? 'bg-violet-600 text-white shadow-fun shadow-violet-200 scale-110'
                : 'bg-white text-slate-500 border-2 border-slate-100 hover:border-violet-200 hover:text-violet-600'
            }`}
          >{l}</button>
        ))}
      </div>

      {/* Status filters */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {statusFilters.map(({ k, l }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              filter === k
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-white text-slate-500 border-2 border-slate-100 hover:bg-violet-50 hover:border-violet-200'
            }`}
          >{l}</button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-10 w-10 border-[4px] border-violet-200 border-t-violet-500 rounded-full" />
        </div>
      )}

      {selected && !loading && (
        <div>
          <button onClick={() => setSelected(null)} className="text-sm text-violet-600 hover:text-violet-800 mb-4 flex items-center gap-1 font-semibold">
            ← 返回词表
          </button>
          <div className="max-w-2xl mx-auto">
            <VocabCard data={selected} showActions={false} />
          </div>
        </div>
      )}

      {!selected && !loading && (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500 font-medium">
              <span className="font-bold text-slate-700">{activeLetter === 'all' ? '全部' : activeLetter}</span> · 共 {total} 词
              {total > pageSize && <span className="text-slate-400"> · 第 {page}/{totalPages} 页</span>}
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1.5 text-xs rounded-xl border-2 border-slate-100 disabled:opacity-30 hover:bg-violet-50 hover:border-violet-200 disabled:cursor-not-allowed font-semibold">上一页</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 7) p = i + 1;
                  else if (page <= 4) p = i + 1;
                  else if (page >= totalPages - 3) p = totalPages - 6 + i;
                  else p = page - 3 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs rounded-xl font-bold transition-colors ${
                        page === p ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-violet-50'
                      }`}>{p}</button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs rounded-xl border-2 border-slate-100 disabled:opacity-30 hover:bg-violet-50 hover:border-violet-200 disabled:cursor-not-allowed font-semibold">下一页</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
            {words.map((w: any) => {
              const st = w.user_status;
              const statusInfo = st ? statusConfig[st] : null;
              const isEditing = editingId === w.id;
              return (
                <div
                  key={w.id}
                  className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 transition-all duration-200 hover:shadow-fun group cursor-pointer ${
                    st === 'mastered' ? 'border-emerald-200 bg-emerald-50/20' :
                    st === 'learning' ? 'border-amber-200 bg-amber-50/20' :
                    st === 'skipped' ? 'border-slate-200 bg-slate-50/30' :
                    'border-slate-100 hover:border-violet-200'
                  }`}
                  onClick={() => !isEditing && loadDetail(w.id)}
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                    <span className="font-fun font-bold text-slate-800 group-hover:text-violet-600 transition-colors text-xs sm:text-sm">
                      {w.word}
                    </span>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {w.exam_frequency && parseInt(w.exam_frequency) > 0 && (
                        <span className="text-[10px] sm:text-xs text-amber-500 font-bold">🔥{w.exam_frequency}</span>
                      )}
                      <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate max-w-[50px] sm:max-w-none">{w.part_of_speech?.split(' ')[0]}</span>
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2 truncate">{w.meaning_cn}</div>
                  <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    {statusInfo ? (
                      <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border font-semibold ${statusInfo.style}`}>{statusInfo.label}</span>
                    ) : (
                      <span className="text-[10px] sm:text-xs text-slate-300 font-medium">未标记</span>
                    )}
                    {isEditing ? (
                      <div className="flex gap-0.5 sm:gap-1 flex-wrap">
                        <button onClick={() => changeStatus(w.id, 'mastered')} className="text-[10px] sm:text-xs text-emerald-600 hover:bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-lg font-semibold">掌握</button>
                        <button onClick={() => changeStatus(w.id, 'learning')} className="text-[10px] sm:text-xs text-amber-600 hover:bg-amber-50 px-1.5 sm:px-2 py-0.5 rounded-lg font-semibold">不熟</button>
                        <button onClick={() => changeStatus(w.id, 'skipped')} className="text-[10px] sm:text-xs text-slate-500 hover:bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-lg font-semibold">跳过</button>
                        {st && <button onClick={() => cancelStatus(w.id)} className="text-[10px] sm:text-xs text-red-400 hover:bg-red-50 px-1.5 sm:px-2 py-0.5 rounded-lg">清除</button>}
                        <button onClick={() => setEditingId(null)} className="text-[10px] sm:text-xs text-slate-400 px-1 py-0.5">✕</button>
                      </div>
                    ) : (
                      <button onClick={() => setEditingId(w.id)}
                        className="text-[10px] sm:text-xs text-violet-500 hover:bg-violet-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-all">
                        标记
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {words.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-slate-400 font-medium">该分类下暂无单词</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
