import { useState } from 'react';

interface WordData {
  word: any;
  meanings: any[];
  examples: any[];
  phrases: any[];
  relations: any[];
}

interface Props {
  data: WordData;
  onStatus: (status: 'mastered' | 'learning' | 'skipped') => void;
  index: number;
  total: number;
}

export default function VocabCard({ data, onStatus, index, total }: Props) {
  const [showAll, setShowAll] = useState(false);
  const { word, meanings, examples, phrases, relations } = data;
  const primaryMeaning = meanings.find((m) => m.is_primary) || meanings[0];

  const synonyms = relations.filter((r) => r.relation_type === 'synonym');
  const antonyms = relations.filter((r) => r.relation_type === 'antonym');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
        <div className="text-xs opacity-70 mb-2">
          {index + 1} / {total}
        </div>
        <div className="text-4xl font-bold mb-1 tracking-wide">{word.word}</div>
        <div className="text-sm opacity-80">
          {word.phonetic_us && `US: ${word.phonetic_us}`}
          {word.phonetic_uk && ` | UK: ${word.phonetic_uk}`}
        </div>
        <div className="mt-3 inline-block bg-white/20 px-3 py-1 rounded-full text-sm">
          {word.part_of_speech}. {primaryMeaning?.meaning_cn}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">释义</h4>
          <div className="space-y-1">
            {meanings.map((m: any) => (
              <p key={m.id} className="text-sm text-slate-700">
                <span className="text-slate-400 text-xs">{m.meaning_en && `${m.meaning_en} `}</span>
                {m.meaning_cn}
                {m.usage_note && <span className="text-slate-400 text-xs ml-1">({m.usage_note})</span>}
              </p>
            ))}
          </div>
        </div>

        {examples.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">真题例句</h4>
            <div className="space-y-2">
              {examples.slice(0, showAll ? examples.length : 2).map((ex: any) => (
                <div key={ex.id} className="bg-amber-50 rounded-lg p-3 border-l-3 border-amber-400">
                  <p className="text-sm text-slate-800 italic">"{ex.sentence_en}"</p>
                  <p className="text-xs text-slate-500 mt-1">{ex.sentence_cn}</p>
                  {ex.exam_year && (
                    <span className="text-xs text-amber-600 font-medium mt-1 inline-block">
                      {ex.exam_year} {ex.exam_type} {ex.source_section}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {examples.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs text-indigo-500 mt-2 hover:underline"
              >
                {showAll ? '收起' : `查看全部 ${examples.length} 条例句`}
              </button>
            )}
          </div>
        )}

        {phrases.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">短语搭配</h4>
            <div className="space-y-1">
              {phrases.map((p: any) => (
                <div key={p.id} className="flex gap-2 text-sm">
                  <span className="font-medium text-slate-800 whitespace-nowrap">{p.phrase}</span>
                  <span className="text-slate-500">— {p.meaning_cn}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {(synonyms.length > 0 || antonyms.length > 0) && (
            <div>
              <h4 className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">近义 / 反义</h4>
              {synonyms.length > 0 && (
                <p className="text-sm text-slate-700">
                  <span className="text-xs text-slate-400">近: </span>
                  {synonyms.map((r: any) => r.related_word).join(' · ')}
                </p>
              )}
              {antonyms.length > 0 && (
                <p className="text-sm text-slate-700">
                  <span className="text-xs text-slate-400">反: </span>
                  {antonyms.map((r: any) => r.related_word).join(' · ')}
                </p>
              )}
            </div>
          )}
          {word.memory_tip && (
            <div>
              <h4 className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">记忆技巧</h4>
              <p className="text-sm text-slate-700">{word.memory_tip}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex border-t border-slate-100">
        <button
          onClick={() => onStatus('skipped')}
          className="flex-1 py-3 text-slate-400 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          太难了 · 跳过
        </button>
        <button
          onClick={() => onStatus('learning')}
          className="flex-1 py-3 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors border-x border-slate-100"
        >
          还不熟 · 再学
        </button>
        <button
          onClick={() => onStatus('mastered')}
          className="flex-1 py-3 text-emerald-600 text-sm font-medium hover:bg-emerald-50 transition-colors"
        >
          已掌握 ✓
        </button>
      </div>
    </div>
  );
}
