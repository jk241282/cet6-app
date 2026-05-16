import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import VocabCard from '../components/VocabCard';

interface WordDetail {
  word: any;
  meanings: any[];
  examples: any[];
  phrases: any[];
  relations: any[];
}

export default function Vocabulary() {
  const [tab, setTab] = useState<'learn' | 'search' | 'browse'>('learn');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">词汇学习</h2>
        <div className="flex gap-2">
          {[
            { key: 'learn', label: '📝 背诵' },
            { key: 'search', label: '🔍 查询' },
            { key: 'browse', label: '📋 总览' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === key ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'learn' && <LearnTab />}
      {tab === 'search' && <SearchTab />}
      {tab === 'browse' && <BrowseTab />}
    </div>
  );
}

// ====== 背诵 Tab ======
function LearnTab() {
  const [words, setWords] = useState<WordDetail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ mastered: 0, learning: 0, skipped: 0 });

  const loadWords = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/vocabulary/draw', { count: 10 });
      if (data.words.length === 0) { setWords([]); setSessionComplete(true); setLoading(false); return; }
      const detailed = await Promise.all(data.words.map((w: any) => api.get(`/vocabulary/${w.id}`).then(r => r.data)));
      setWords(detailed); setCurrentIndex(0); setSessionComplete(false); setStats({ mastered: 0, learning: 0, skipped: 0 });
    } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { loadWords(); }, [loadWords]);

  const handleStatus = async (status: 'mastered' | 'learning' | 'skipped') => {
    const w = words[currentIndex]; if (!w) return;
    try { await api.patch(`/vocabulary/${w.word.id}/status`, { status }); } catch {}
    setStats(p => ({ ...p, [status === 'mastered' ? 'mastered' : status === 'learning' ? 'learning' : 'skipped']: p[status === 'mastered' ? 'mastered' : status === 'learning' ? 'learning' : 'skipped'] + 1 }));
    currentIndex + 1 < words.length ? setCurrentIndex(currentIndex + 1) : setSessionComplete(true);
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;

  if (sessionComplete) return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{words.length === 0 ? '词库中暂无新词！' : '本轮学习完成！'}</h2>
      <div className="flex justify-center gap-6 text-sm text-slate-600 mb-6">
        <span>✅ 已掌握: <b className="text-emerald-600">{stats.mastered}</b></span>
        <span>🔄 需复习: <b className="text-amber-600">{stats.learning}</b></span>
        <span>⏭️ 已跳过: <b className="text-slate-400">{stats.skipped}</b></span>
      </div>
      <button onClick={loadWords} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700">再来一轮</button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 text-sm text-slate-500">
          <span>✅ {stats.mastered}</span><span>🔄 {stats.learning}</span><span>⏭️ {stats.skipped}</span>
        </div>
      </div>
      {words[currentIndex] && <VocabCard data={words[currentIndex]} onStatus={handleStatus} index={currentIndex} total={words.length} />}
    </div>
  );
}

// ====== 查询 Tab ======
function SearchTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setSelectedWord(null);
    const { data } = await api.get(`/vocabulary/search?q=${encodeURIComponent(query.trim())}`);
    setResults(data.words); setLoading(false);
  };

  const loadWordDetail = async (id: number) => {
    setLoading(true);
    const { data } = await api.get(`/vocabulary/${id}`);
    setSelectedWord(data); setLoading(false);
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="输入单词搜索..." className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
        <button onClick={handleSearch} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 text-sm">搜索</button>
      </div>

      {loading && <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>}

      {selectedWord ? (
        <div>
          <button onClick={() => setSelectedWord(null)} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">← 返回搜索结果</button>
          <VocabCard data={selectedWord} onStatus={() => {}} index={0} total={1} />
        </div>
      ) : results.length > 0 ? (
        <div className="grid gap-2">
          {results.map((w: any) => (
            <button key={w.id} onClick={() => loadWordDetail(w.id)}
              className="bg-white rounded-xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">{w.word}</span>
                <span className="text-xs text-slate-400 ml-2">{w.part_of_speech}</span>
              </div>
              <span className="text-sm text-slate-600">{w.meaning_cn}</span>
            </button>
          ))}
        </div>
      ) : query && !loading ? (
        <div className="text-center py-8 text-slate-400">未找到匹配单词</div>
      ) : null}
    </div>
  );
}

// ====== 字母总览 Tab ======
function BrowseTab() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [activeLetter, setActiveLetter] = useState('A');
  const [words, setWords] = useState<any[]>([]);
  const [selectedWord, setSelectedWord] = useState<WordDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true); setSelectedWord(null);
    api.get(`/vocabulary/list?letter=${activeLetter}&limit=200`).then(({ data }) => {
      setWords(data.words); setTotal(data.total); setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeLetter]);

  const loadDetail = async (id: number) => {
    setLoading(true);
    const { data } = await api.get(`/vocabulary/${id}`);
    setSelectedWord(data); setLoading(false);
  };

  return (
    <div>
      {/* Letter selector */}
      <div className="flex flex-wrap gap-1 mb-4">
        {letters.map(l => (
          <button key={l} onClick={() => setActiveLetter(l)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              activeLetter === l ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}>
            {l}
          </button>
        ))}
      </div>

      {loading && <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>}

      {selectedWord ? (
        <div>
          <button onClick={() => setSelectedWord(null)} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">← 返回列表</button>
          <VocabCard data={selectedWord} onStatus={() => {}} index={0} total={1} />
        </div>
      ) : (
        <>
          <div className="text-sm text-slate-500 mb-3">{activeLetter} 开头的单词 · 共 {total} 个</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {words.map((w: any) => (
              <button key={w.id} onClick={() => loadDetail(w.id)}
                className="bg-white rounded-lg p-3 border border-slate-200 text-left hover:shadow-sm transition-shadow">
                <div className="font-semibold text-slate-800 text-sm">{w.word}</div>
                <div className="text-xs text-slate-400">{w.part_of_speech}</div>
                <div className="text-xs text-slate-500 mt-1 truncate">{w.meaning_cn}</div>
              </button>
            ))}
          </div>
          {words.length === 0 && !loading && <div className="text-center py-8 text-slate-400">该字母下暂无单词</div>}
        </>
      )}
    </div>
  );
}
