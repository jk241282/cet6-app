import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Writing() {
  const [topics, setTopics] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [sentences, setSentences] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [tab, setTab] = useState<'essays'|'templates'|'sentences'>('essays');
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      api.get('/writing/topics'),
      api.get('/writing/templates'),
      api.get('/writing/sentences'),
    ]).then(([t, tm, s]) => {
      setTopics(t.data.topics || []);
      setTemplates(tm.data.templates || []);
      setSentences(s.data.sentences || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = [...new Set(topics.map((t: any) => t.category))] as string[];
  const filteredTopics = categoryFilter === 'all' ? topics : topics.filter(t => t.category === categoryFilter);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="animate-spin h-10 w-10 border-4 border-fuchsia-600 border-t-transparent rounded-full"/></div>;

  return (
    <div>
      {/* 🎀 Cute Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl drop-shadow-sm">✍️</span>
          <h2 className="text-2xl font-fun font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-purple-700">写作训练</h2>
        </div>
        <p className="text-sm text-slate-400 ml-11">Practice makes perfect ~ 每天进步一点点</p>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6">
        {[{key:'essays',label:'📝 真题范文'},{key:'templates',label:'📋 写作模板'},{key:'sentences',label:'💎 佳句背诵'}].map(({key,label})=>(
          <button key={key} onClick={()=>setTab(key as typeof tab)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
              tab===key
                ? 'bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-fun'
                : 'bg-white text-slate-500 border-2 border-fuchsia-100 hover:bg-fuchsia-50 hover:border-fuchsia-200'
            }`}>{label}</button>
        ))}
      </div>

      {/* ===== 真题范文 ===== */}
      {tab==='essays'&&<>
        {!selectedTopic ? <>
          {/* Category Filter Pills */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            <button onClick={()=>setCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                categoryFilter==='all'
                  ? 'bg-fuchsia-600 text-white shadow-sm'
                  : 'bg-white text-slate-500 border-2 border-fuchsia-100 hover:bg-fuchsia-50'
              }`}>全部({topics.length})</button>
            {categories.map(c=>{
              const count=topics.filter(t=>t.category===c).length;
              return <button key={c} onClick={()=>setCategoryFilter(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  categoryFilter===c
                    ? 'bg-fuchsia-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 border-2 border-fuchsia-100 hover:bg-fuchsia-50'
                }`}>{c}({count})</button>;
            })}
          </div>

          {/* Topic Cards */}
          <div className="grid gap-3">
            {filteredTopics.map((t:any)=>(
              <button key={t.id} onClick={async()=>{const{data}=await api.get(`/writing/topics/${t.id}`);setSelectedTopic(data.topic)}}
                className="bg-white rounded-2xl p-4 border-2 border-fuchsia-100 shadow-fun text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{t.topic_cn}</h3>
                  <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-medium">{t.category}</span>
                </div>
                <p className="text-xs text-slate-400">{t.topic_en} · {t.exam_year||''} · 难度{'★'.repeat(t.difficulty)}</p>
              </button>
            ))}
          </div>
        </> : <>
          <button onClick={()=>setSelectedTopic(null)} className="text-sm text-fuchsia-600 hover:text-fuchsia-800 hover:underline mb-4 inline-block font-medium transition-colors">← 返回题库</button>
          {/* Topic Detail Card */}
          <div className="bg-white rounded-2xl border-2 border-fuchsia-100 shadow-fun p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-800">{selectedTopic.topic_cn}</h3>
              <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full font-medium">{selectedTopic.category} · {selectedTopic.exam_year||''}</span>
            </div>
            <p className="text-sm text-slate-500 mb-4">{selectedTopic.topic_en}</p>
            {selectedTopic.outline && <div className="bg-slate-50 rounded-xl p-4 mb-4"><h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">📋 写作大纲</h4><pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{selectedTopic.outline}</pre></div>}
            {selectedTopic.key_vocab && <div className="bg-slate-50 rounded-xl p-4 mb-4"><h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">🔑 核心词汇</h4><div className="flex flex-wrap gap-1.5">{selectedTopic.key_vocab.split(',').map((w:string)=><span key={w} className="text-xs bg-fuchsia-50 text-fuchsia-600 px-2 py-1 rounded-full font-medium">{w.trim()}</span>)}</div></div>}
          </div>
          {/* Model Essay — amber/warm */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
            <h3 className="font-semibold text-amber-800 mb-3">📖 参考范文</h3>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed">{selectedTopic.model_essay}</div>
          </div>
        </>}
      </>}

      {/* ===== 模板 ===== */}
      {tab==='templates'&&<>
        {!selectedTemplate ? <>
          <div className="grid gap-3">
            {templates.map((t:any)=>(
              <button key={t.id} onClick={async()=>{const{data}=await api.get(`/writing/templates/${t.id}`);setSelectedTemplate(data.template)}}
                className="bg-white rounded-2xl p-4 border-2 border-purple-100 shadow-fun text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-slate-800 text-sm">{t.title}</h3>
                  <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">{t.category}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{t.template_structure?.slice(0,80)}</p>
              </button>
            ))}
          </div>
        </> : <>
          <button onClick={()=>setSelectedTemplate(null)} className="text-sm text-fuchsia-600 hover:text-fuchsia-800 hover:underline mb-4 inline-block font-medium transition-colors">← 返回模板库</button>
          <div className="bg-white rounded-2xl border-2 border-purple-100 shadow-fun p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{selectedTemplate.title}</h3>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full mb-4 inline-block font-medium">{selectedTemplate.category}</span>
            <div className="mt-4 prose prose-sm max-w-none text-slate-700 whitespace-pre-line">{selectedTemplate.template_structure}</div>
          </div>
          {selectedTemplate.model_paragraph_en && <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6">
            <h3 className="font-semibold text-purple-800 mb-3">📖 模板范文</h3>
            <p className="text-sm text-slate-700">{selectedTemplate.model_paragraph_en}</p>
            {selectedTemplate.model_paragraph_cn && <p className="text-xs text-slate-500 mt-3">{selectedTemplate.model_paragraph_cn}</p>}
          </div>}
        </>}
      </>}

      {/* ===== 佳句 ===== */}
      {tab==='sentences'&&<>
        <div className="space-y-3">
          {sentences.map((s:any)=>(
            <div key={s.id} className="bg-white rounded-2xl border-2 border-fuchsia-100 shadow-fun p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <p className="text-sm text-slate-800 font-medium">{s.sentence_en}</p>
              <p className="text-xs text-slate-500 mt-1">{s.sentence_cn}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-fuchsia-50 text-fuchsia-600 px-2 py-0.5 rounded-full font-medium">{s.category}</span>
                {s.topic_tag && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">{s.topic_tag}</span>}
              </div>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}
