import { useState, useEffect } from 'react';
import api from '../api/client';

interface Passage {
  id: number;
  title: string;
  source: string;
  difficulty: number;
  word_count: number;
  topic_tag: string;
}

interface Question {
  id: number;
  question_type: string;
  question_en: string;
  options_json: string;
  answer: string;
  explanation_cn: string;
}

export default function Reading() {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [selectedPassage, setSelectedPassage] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/reading/passages').then(({ data }) => {
      setPassages(data.passages);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const loadPassage = async (id: number) => {
    setLoading(true);
    setResults(null);
    setAnswers({});
    const { data } = await api.get(`/reading/passages/${id}`);
    setSelectedPassage(data.passage);
    setQuestions(data.questions);
    setLoading(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { data } = await api.post(`/reading/passages/${selectedPassage.id}/submit`, { answers });
    setResults(data);
    setSubmitting(false);
  };

  if (loading && !selectedPassage) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-4xl animate-bounce-gentle">📚</div>
        <div className="animate-spin h-10 w-10 border-4 border-violet-200 border-t-violet-500 rounded-full" />
        <p className="text-violet-400 text-sm font-fun">文章加载中...</p>
      </div>
    );
  }

  const borderStyles = [
    'border-violet-200 hover:border-violet-400',
    'border-rose-200 hover:border-rose-400',
    'border-emerald-200 hover:border-emerald-400',
    'border-sky-200 hover:border-sky-400',
    'border-amber-200 hover:border-amber-400',
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold font-fun mb-6 flex items-center gap-2">
        <span className="text-3xl">📖</span>
        <span className="gradient-text">阅读理解</span>
        <span className="text-3xl">✨</span>
      </h2>

      {!selectedPassage ? (
        <div className="grid gap-4">
          {passages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => loadPassage(p.id)}
              className={`bg-white rounded-2xl p-5 border-2 ${borderStyles[idx % borderStyles.length]} text-left shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800 font-fun flex items-center gap-2">
                  <span>{idx === 0 ? '🦉' : idx === 1 ? '🌟' : idx === 2 ? '💜' : idx === 3 ? '🍀' : '📝'}</span>
                  {p.title}
                </h3>
                <span className="text-xs px-2.5 py-1 bg-violet-100 text-violet-600 rounded-full font-medium">
                  {p.topic_tag}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>难度: {'★'.repeat(p.difficulty)}</span>
                <span>·</span>
                <span>{p.word_count}词</span>
                <span>·</span>
                <span>{p.source}</span>
              </div>
            </button>
          ))}
          {passages.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-lg mb-2 font-fun">暂无阅读文章</p>
              <p className="text-sm">数据正在陆续录入中</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => { setSelectedPassage(null); setResults(null); }}
            className="text-sm text-violet-500 hover:text-violet-700 hover:underline mb-4 inline-flex items-center gap-1 font-fun transition-colors"
          >
            <span>👈</span> 返回列表
          </button>

          <div className="bg-white rounded-3xl border-2 border-violet-100 shadow-fun p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2 font-fun flex items-center gap-2">
              <span>📄</span> {selectedPassage.title}
            </h3>
            <div className="text-xs text-slate-400 mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="px-2 py-0.5 bg-violet-50 text-violet-500 rounded-full">{selectedPassage.topic_tag}</span>
              <span>·</span>
              <span>{selectedPassage.word_count}词</span>
              <span>·</span>
              <span>难度 {'★'.repeat(selectedPassage.difficulty)}</span>
            </div>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
              {selectedPassage.content_en}
            </div>
          </div>

          {questions.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-800 font-fun flex items-center gap-2">
                <span>❓</span> 题目 <span className="text-violet-400 text-sm font-normal">({questions.length}题)</span>
              </h3>
              {questions.map((q, i) => {
                const options = JSON.parse(q.options_json || '[]');
                const isCorrect = results?.results?.[q.id]?.correct;
                const userAnswer = answers[q.id] || '';

                return (
                  <div key={q.id} className={`bg-white rounded-2xl border-2 p-5 transition-all duration-300 ${
                    results ? (isCorrect ? 'border-emerald-300 bg-emerald-50/20 shadow-mint' : 'border-rose-300 bg-rose-50/20 shadow-coral') : 'border-violet-100 shadow-card hover:shadow-card-hover'
                  }`}>
                    <p className="text-sm font-medium text-slate-800 mb-3 flex items-start gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {q.question_en}
                    </p>
                    <div className="space-y-2">
                      {options.map((opt: string) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 text-sm p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                            results
                              ? opt.startsWith(results.results[q.id]?.correctAnswer)
                                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                                : opt.startsWith(userAnswer) && !isCorrect
                                ? 'bg-rose-100 text-rose-800 border-2 border-rose-300'
                                : 'text-slate-500 border-2 border-transparent'
                              : answers[q.id] === opt.charAt(0) ? 'bg-violet-50 text-violet-700 border-2 border-violet-200' : 'text-slate-600 hover:bg-slate-50 border-2 border-transparent'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt.charAt(0)}
                            checked={userAnswer === opt.charAt(0)}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            disabled={!!results}
                            className="accent-violet-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {results && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        {isCorrect ? (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-emerald-500 text-lg">🎉</span>
                            <span className="text-emerald-600 font-medium">正确！太棒了！</span>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 text-sm">
                            <span className="text-rose-500 text-lg">💡</span>
                            <div>
                              <span className="text-rose-600 font-medium">正确答案: {results.results[q.id].correctAnswer}</span>
                            </div>
                          </div>
                        )}
                        {q.explanation_cn && (
                          <p className="text-slate-500 mt-2 text-xs leading-relaxed bg-slate-50 rounded-xl p-3">
                            📝 {q.explanation_cn}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!results && questions.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length < questions.length}
              className="btn-fun w-full py-3 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-base"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                  批改中...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  ✨ 提交答案 ✨
                </span>
              )}
            </button>
          )}

          {results && (
            <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-3xl p-8 text-white text-center shadow-fun-lg animate-pop">
              <div className="text-5xl mb-3">🏆</div>
              <div className="text-4xl font-bold mb-2 font-fun">{results.score}<span className="text-xl opacity-60">/{results.total}</span></div>
              <div className="text-sm opacity-80 mb-1 font-fun">
                正确率 {Math.round((results.score / results.total) * 100)}%
              </div>
              <div className="mt-3 flex justify-center gap-1">
                {Array.from({ length: results.total }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < results.score ? 'opacity-100' : 'opacity-30'}`}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
