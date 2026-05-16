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
  const [words, setWords] = useState<WordDetail[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState({ mastered: 0, learning: 0, skipped: 0 });
  const [drawCount] = useState(10);

  const loadWords = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/vocabulary/draw', { count: drawCount });
      if (data.words.length === 0) {
        setWords([]);
        setSessionComplete(true);
        setLoading(false);
        return;
      }
      const detailedWords = await Promise.all(
        data.words.map((w: any) => api.get(`/vocabulary/${w.id}`).then((r) => r.data))
      );
      setWords(detailedWords);
      setCurrentIndex(0);
      setSessionComplete(false);
      setStats({ mastered: 0, learning: 0, skipped: 0 });
    } catch (err) {
      console.error('Failed to load words', err);
    }
    setLoading(false);
  }, [drawCount]);

  useEffect(() => {
    loadWords();
  }, [loadWords]);

  const handleStatus = async (status: 'mastered' | 'learning' | 'skipped') => {
    const currentWord = words[currentIndex];
    if (!currentWord) return;

    try {
      await api.patch(`/vocabulary/${currentWord.word.id}/status`, { status });
    } catch (err) {
      console.error('Failed to update status', err);
    }

    setStats((prev) => {
      const key = status === 'mastered' ? 'mastered' : status === 'learning' ? 'learning' : 'skipped';
      return { ...prev, [key]: prev[key] + 1 };
    });

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSessionComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {words.length === 0 ? '词库中暂无新词！' : '本轮学习完成！'}
        </h2>
        <div className="flex justify-center gap-6 text-sm text-slate-600 mb-6">
          <span>✅ 已掌握: <b className="text-emerald-600">{stats.mastered}</b></span>
          <span>🔄 需复习: <b className="text-amber-600">{stats.learning}</b></span>
          <span>⏭️ 已跳过: <b className="text-slate-400">{stats.skipped}</b></span>
        </div>
        <button
          onClick={loadWords}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
        >
          再来一轮
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">词汇背诵</h2>
        <div className="flex gap-4 text-sm text-slate-500">
          <span>✅ {stats.mastered}</span>
          <span>🔄 {stats.learning}</span>
          <span>⏭️ {stats.skipped}</span>
        </div>
      </div>
      {words[currentIndex] && (
        <VocabCard
          data={words[currentIndex]}
          onStatus={handleStatus}
          index={currentIndex}
          total={words.length}
        />
      )}
    </div>
  );
}
