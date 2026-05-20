import { useState } from 'react';

interface WordData {
  word: {
    id: number;
    word: string;
    phonetic_us: string;
    phonetic_uk: string;
    part_of_speech: string;
    memory_tip: string;
    exam_frequency: string;
    root_word?: string;
  };
  meanings: { id: number; meaning_cn: string; meaning_en?: string; usage_note?: string; is_primary: boolean }[];
  examples: { id: number; sentence_en: string; sentence_cn: string; exam_year?: string; exam_type?: string; source_section?: string }[];
  phrases: { id: number; phrase: string; meaning_cn: string }[];
  relations: { id: number; related_word: string; relation_type: string; nuance_cn?: string }[];
}

interface Props {
  data: WordData;
  onStatus?: (status: 'mastered' | 'learning' | 'skipped') => void;
  index?: number;
  total?: number;
  showActions?: boolean;
}

export default function VocabCard({ data, onStatus, index, total, showActions = true }: Props) {
  const [showAllExamples, setShowAllExamples] = useState(false);
  const { word, meanings, examples, phrases, relations } = data;

  const primaryMeaning = meanings.find((m) => m.is_primary) || meanings[0];
  const forms = meanings.filter((m) => m.usage_note?.includes('词形变化'));
  const coreMeanings = meanings.filter((m) => !m.usage_note?.includes('词形变化'));
  const synonyms = relations.filter((r) => r.relation_type === 'synonym');
  const antonyms = relations.filter((r) => r.relation_type === 'antonym');
  const displayedExamples = showAllExamples ? examples : examples.slice(0, 2);

  return (
    <div className="bg-white rounded-3xl shadow-fun-lg border-2 border-violet-100 overflow-hidden transition-all duration-300 hover:shadow-xl animate-pop">
      {/* Header - gradient card top */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-violet-900 to-purple-900 px-4 py-5 sm:px-6 sm:py-7 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-violet-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-80 h-20 bg-gradient-to-t from-purple-500/10 to-transparent rounded-full" />
        <div className="absolute top-8 right-12 text-3xl opacity-20 animate-float-slow">🦉</div>
        <div className="absolute top-16 right-32 text-xl opacity-10 animate-float">⭐</div>

        <div className="relative">
          {/* Progress indicator */}
          {(index !== undefined && total !== undefined) && (
            <div className="flex items-center gap-2 text-white/40 text-xs mb-3 tracking-widest font-medium">
              <span className="font-fun">{index + 1} / {total}</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${((index + 1) / total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Word + phonetic */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">{word.word}</h2>
            <span className="text-violet-300 text-lg font-light">/{word.phonetic_us}/</span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-violet-100">
              {word.part_of_speech}
            </span>
            {primaryMeaning && (
              <span className="text-sm text-white/70">{primaryMeaning.meaning_cn}</span>
            )}
            {word.exam_frequency && parseInt(word.exam_frequency) > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-400/20 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-amber-300">
                🔥 ×{word.exam_frequency}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Meanings */}
        {coreMeanings.length > 0 && (
          <CardSection title="释义" icon="📖" color="violet">
            <div className="space-y-2">
              {coreMeanings.map((m) => (
                <div key={m.id} className="flex gap-2 text-sm text-slate-700 pl-3 border-l-[3px] border-violet-300 rounded-r-lg hover:bg-violet-50/50 py-1 transition-colors">
                  {m.meaning_en && <span className="text-violet-500 font-semibold shrink-0">{m.meaning_en}</span>}
                  <span>{m.meaning_cn}</span>
                </div>
              ))}
            </div>
          </CardSection>
        )}

        {/* Word forms */}
        {forms.length > 0 && (
          <CardSection title="词形变化" icon="🔄" color="fuchsia">
            <div className="flex flex-wrap gap-1.5">
              {forms[0].meaning_cn.split(/, (?=[a-z])/).filter(Boolean).map((f, i) => (
                <span key={i} className="inline-flex items-center bg-fuchsia-50 text-fuchsia-700 text-xs px-3 py-1.5 rounded-full border border-fuchsia-200 font-medium">
                  {f.trim()}
                </span>
              ))}
            </div>
          </CardSection>
        )}

        {/* Phrases */}
        {phrases.length > 0 && (
          <CardSection title="词组搭配" icon="🔗" color="emerald">
            <div className="space-y-2">
              {phrases.map((p) => (
                <div key={p.id} className="flex items-baseline gap-3 text-sm bg-emerald-50/70 rounded-2xl px-4 py-2.5 group hover:bg-emerald-100/70 transition-colors">
                  <code className="font-bold text-emerald-700 shrink-0 text-xs bg-emerald-100 px-2 py-1 rounded-lg">{p.phrase}</code>
                  <span className="text-slate-600 text-xs">{p.meaning_cn}</span>
                </div>
              ))}
            </div>
          </CardSection>
        )}

        {/* Examples */}
        {examples.length > 0 && (
          <CardSection title={`真题例句 (${examples.length})`} icon="📝" color="amber">
            <div className="space-y-3">
              {displayedExamples.map((ex) => (
                <div key={ex.id} className="bg-amber-50/80 rounded-2xl p-4 border border-amber-100/80 hover:border-amber-200 transition-colors">
                  {ex.exam_year && (
                    <span className="inline-flex items-center gap-1 bg-amber-200/60 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                      🏛 {ex.exam_year}{ex.exam_type ? ` ${ex.exam_type}` : ''}
                    </span>
                  )}
                  <p className="text-slate-800 text-sm leading-relaxed italic">"{ex.sentence_en}"</p>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">{ex.sentence_cn}</p>
                </div>
              ))}
            </div>
            {examples.length > 2 && (
              <button
                onClick={() => setShowAllExamples(!showAllExamples)}
                className="mt-2 text-xs font-semibold text-violet-500 hover:text-violet-700 transition-colors flex items-center gap-1"
              >
                {showAllExamples ? '收起例句 ↑' : `展开全部 ${examples.length} 条例句 ↓`}
              </button>
            )}
          </CardSection>
        )}

        {/* Synonyms/Antonyms */}
        {(synonyms.length > 0 || antonyms.length > 0) && (
          <CardSection title="近义词 / 反义词" icon="🔀" color="purple">
            <div className="flex flex-col gap-2">
              {synonyms.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-purple-500 font-bold shrink-0 text-xs mt-0.5 bg-purple-50 px-1.5 py-0.5 rounded">近义</span>
                  <div className="flex flex-wrap gap-1.5">
                    {synonyms.map((r, i) => (
                      <span key={i} className="inline-flex items-center bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full border border-purple-200 font-medium">
                        {r.related_word}
                        {r.nuance_cn && <span className="text-purple-400 ml-1">({r.nuance_cn})</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {antonyms.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-pink-500 font-bold shrink-0 text-xs mt-0.5 bg-pink-50 px-1.5 py-0.5 rounded">反义</span>
                  <div className="flex flex-wrap gap-1.5">
                    {antonyms.map((r, i) => (
                      <span key={i} className="inline-flex items-center bg-pink-50 text-pink-700 text-xs px-2.5 py-1 rounded-full border border-pink-200 font-medium">
                        {r.related_word}
                        {r.nuance_cn && <span className="text-pink-400 ml-1">({r.nuance_cn})</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardSection>
        )}

        {/* Memory tip */}
        {word.memory_tip && (
          <CardSection title="记忆技巧" icon="💡" color="rose">
            <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/70 rounded-2xl px-4 py-3 border border-rose-100">
              {word.memory_tip}
            </p>
          </CardSection>
        )}
      </div>

      {/* Action buttons */}
      {showActions && onStatus && (
        <div className="flex border-t-2 border-slate-50 bg-gradient-to-r from-slate-50 to-violet-50/50">
          <button
            onClick={() => onStatus('skipped')}
            className="flex-1 py-3 sm:py-4 text-slate-400 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 sm:gap-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">⏭</span> <span className="hidden sm:inline">跳过</span>
          </button>
          <button
            onClick={() => onStatus('learning')}
            className="flex-1 py-3 sm:py-4 text-amber-500 text-xs sm:text-sm font-semibold hover:bg-amber-50 transition-colors border-x-2 border-slate-100 flex items-center justify-center gap-1 sm:gap-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">🔄</span> <span className="hidden sm:inline">还不熟</span>
          </button>
          <button
            onClick={() => onStatus('mastered')}
            className="flex-1 py-3 sm:py-4 text-emerald-600 text-xs sm:text-sm font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1 sm:gap-2 group"
          >
            <span className="group-hover:scale-110 transition-transform">✅</span> <span className="hidden sm:inline">已掌握</span>
          </button>
        </div>
      )}
    </div>
  );
}

function CardSection({ title, icon, color, children }: { title: string; icon: string; color: string; children: React.ReactNode }) {
  const borderMap: Record<string, string> = {
    violet: 'border-l-violet-400',
    fuchsia: 'border-l-fuchsia-400',
    emerald: 'border-l-emerald-400',
    amber: 'border-l-amber-400',
    purple: 'border-l-purple-400',
    rose: 'border-l-rose-400',
  };

  return (
    <div className={`border-l-[3px] ${borderMap[color] || 'border-l-violet-400'} pl-3`}>
      <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>
      {children}
    </div>
  );
}
