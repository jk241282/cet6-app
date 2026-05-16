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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">阅读理解</h2>

      {!selectedPassage ? (
        <div className="grid gap-3">
          {passages.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPassage(p.id)}
              className="bg-white rounded-xl p-4 border border-slate-200 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-800">{p.title}</h3>
                <span className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                  {p.topic_tag}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                难度: {'★'.repeat(p.difficulty)} · {p.word_count}词 · {p.source}
              </div>
            </button>
          ))}
          {passages.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg mb-2">暂无阅读文章</p>
              <p className="text-sm">数据正在陆续录入中</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => { setSelectedPassage(null); setResults(null); }}
            className="text-sm text-indigo-600 hover:underline mb-4 inline-block"
          >
            ← 返回列表
          </button>

          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{selectedPassage.title}</h3>
            <div className="text-xs text-slate-400 mb-4">
              {selectedPassage.topic_tag} · {selectedPassage.word_count}词 · 难度 {'★'.repeat(selectedPassage.difficulty)}
            </div>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
              {selectedPassage.content_en}
            </div>
          </div>

          {questions.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-slate-800">题目</h3>
              {questions.map((q, i) => {
                const options = JSON.parse(q.options_json || '[]');
                const isCorrect = results?.results?.[q.id]?.correct;
                const userAnswer = answers[q.id] || '';

                return (
                  <div key={q.id} className={`bg-white rounded-xl border p-4 ${
                    results ? (isCorrect ? 'border-emerald-300 bg-emerald-50/30' : 'border-red-300 bg-red-50/30') : 'border-slate-200'
                  }`}>
                    <p className="text-sm font-medium text-slate-800 mb-2">
                      {i + 1}. {q.question_en}
                    </p>
                    <div className="space-y-1.5">
                      {options.map((opt: string) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-2 text-sm p-2 rounded-lg cursor-pointer transition-colors ${
                            results
                              ? opt.startsWith(results.results[q.id]?.correctAnswer)
                                ? 'bg-emerald-100 text-emerald-800'
                                : opt.startsWith(userAnswer) && !isCorrect
                                ? 'bg-red-100 text-red-800'
                                : 'text-slate-500'
                              : answers[q.id] === opt.charAt(0) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt.charAt(0)}
                            checked={userAnswer === opt.charAt(0)}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            disabled={!!results}
                            className="accent-indigo-600"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {results && (
                      <div className="mt-2 text-xs">
                        {isCorrect ? (
                          <span className="text-emerald-600">✅ 正确</span>
                        ) : (
                          <span className="text-red-600">❌ 错误 · 正确答案: {results.results[q.id].correctAnswer}</span>
                        )}
                        {q.explanation_cn && (
                          <p className="text-slate-500 mt-1">{q.explanation_cn}</p>
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
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? '提交中...' : '提交答案'}
            </button>
          )}

          {results && (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white text-center">
              <div className="text-3xl font-bold mb-1">{results.score}/{results.total}</div>
              <div className="text-sm opacity-80">
                正确率 {Math.round((results.score / results.total) * 100)}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
