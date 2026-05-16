import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import VocabCard from '../components/VocabCard';
import { useVocabStore } from '../store/vocabStore';

interface WordDetail { word: any; meanings: any[]; examples: any[]; phrases: any[]; relations: any[]; }

export default function Vocabulary() {
  const [tab, setTab] = useState<'learn' | 'search' | 'list'>('learn');
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">词汇学习</h2>
        <div className="flex gap-2">
          {[{key:'learn',label:'📝 背诵'},{key:'search',label:'🔍 查询'},{key:'list',label:'📋 词表'}].map(({key,label})=>(
            <button key={key} onClick={()=>setTab(key as typeof tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab===key?'bg-indigo-600 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{label}</button>
          ))}
        </div>
      </div>
      {tab==='learn'&&<LearnTab/>}
      {tab==='search'&&<SearchTab/>}
      {tab==='list'&&<ListTab/>}
    </div>
  );
}

// ====== 背诵 ======
function LearnTab(){
  const [words,setWords]=useState<WordDetail[]>([]);const [ci,setCi]=useState(0);const [l,setL]=useState(true);const [done,setDone]=useState(false);const [st,setSt]=useState({m:0,l:0,s:0});
  const triggerRefresh=useVocabStore(s=>s.triggerRefresh);
  const load=useCallback(async()=>{setL(true);try{const{data}=await api.post('/vocabulary/draw',{count:10});if(!data.words.length){setWords([]);setDone(true);setL(false);return}const d=await Promise.all(data.words.map((w:any)=>api.get(`/vocabulary/${w.id}`).then(r=>r.data)));setWords(d);setCi(0);setDone(false);setSt({m:0,l:0,s:0})}catch{}setL(false)},[]);
  useEffect(()=>{load()},[load]);
  const hs=async(s:'mastered'|'learning'|'skipped')=>{const w=words[ci];if(!w)return;try{await api.patch(`/vocabulary/${w.word.id}/status`,{status:s});triggerRefresh()}catch{}setSt(p=>({...p,[s==='mastered'?'m':s==='learning'?'l':'s']:p[s==='mastered'?'m':s==='learning'?'l':'s']+1}));ci+1<words.length?setCi(ci+1):setDone(true)};
  if(l)return<div className="flex justify-center h-64 items-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"/></div>;
  if(done)return<div className="text-center py-16"><div className="text-5xl mb-4">🎉</div><h2 className="text-2xl font-bold text-slate-800 mb-2">{words.length===0?'词库暂无新词！':'本轮完成！'}</h2><div className="flex justify-center gap-6 text-sm text-slate-600 mb-6"><span>✅{st.m}</span><span>🔄{st.l}</span><span>⏭️{st.s}</span></div><button onClick={load} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium">再来一轮</button></div>;
  return <div><div className="flex gap-4 text-sm text-slate-500 mb-4"><span>✅{st.m}</span><span>🔄{st.l}</span><span>⏭️{st.s}</span></div>{words[ci]&&<VocabCard data={words[ci]} onStatus={hs} index={ci} total={words.length}/>}</div>;
}

// ====== 查询 ======
function SearchTab(){
  const [q,setQ]=useState('');const [r,setR]=useState<any[]>([]);const [sw,setSw]=useState<WordDetail|null>(null);const [l,setL]=useState(false);
  const hs=async()=>{if(!q.trim())return;setL(true);setSw(null);const{data}=await api.get(`/vocabulary/search?q=${encodeURIComponent(q.trim())}`);setR(data.words);setL(false)};
  const ld=async(id:number)=>{setL(true);const{data}=await api.get(`/vocabulary/${id}`);setSw(data);setL(false)};
  return <div>
    <div className="flex gap-2 mb-4"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&hs()} placeholder="输入单词..." className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/><button onClick={hs} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm">搜索</button></div>
    {l&&<div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"/></div>}
    {sw?<div><button onClick={()=>setSw(null)} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">← 返回</button><VocabCard data={sw} onStatus={()=>{}} index={0} total={1}/></div>
    :r.length>0?<div className="grid gap-2">{r.map((w:any)=><button key={w.id} onClick={()=>ld(w.id)} className="bg-white rounded-xl p-4 border border-slate-200 text-left hover:shadow-md flex justify-between"><div><span className="font-semibold text-slate-800">{w.word}</span><span className="text-xs text-slate-400 ml-2">{w.part_of_speech}</span></div><span className="text-sm text-slate-600">{w.meaning_cn}</span></button>)}</div>
    :q&&!l?<div className="text-center py-8 text-slate-400">未找到</div>:null}
  </div>;
}

// ====== 词表(含状态管理) ======
function ListTab(){
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [al,setAl]=useState('A');const [words,setWords]=useState<any[]>([]);const [total,setTotal]=useState(0);const [l,setL]=useState(false);const [sw,setSw]=useState<WordDetail|null>(null);const [filter,setFilter]=useState('all');
  const [editing,setEditing]=useState<number|null>(null);

  const refreshKey=useVocabStore(s=>s.refreshKey);
  const load=useCallback(async()=>{
    setL(true);setSw(null);
    const{data}=await api.get(`/vocabulary/list?letter=${al}&limit=200&status=${filter}`);
    setWords(data.words);setTotal(data.total);setL(false);
  },[al,filter,refreshKey]);
  useEffect(()=>{load()},[load]);

  const changeStatus=async(wid:number,status:string)=>{
    await api.patch(`/vocabulary/${wid}/status`,{status});load();
  };
  const cancelStatus=async(wid:number)=>{
    await api.delete(`/vocabulary/${wid}/status`);load();
  };
  const ld=async(id:number)=>{setL(true);const{data}=await api.get(`/vocabulary/${id}`);setSw(data);setL(false)};

  const statusColors:Record<string,string>={mastered:'bg-emerald-100 text-emerald-700',learning:'bg-amber-100 text-amber-700',reviewed:'bg-blue-100 text-blue-700',skipped:'bg-slate-100 text-slate-500'};
  const statusLabels:Record<string,string>={mastered:'已掌握',learning:'不熟',reviewed:'复习中',skipped:'已跳过'};

  return <div>
    <div className="flex flex-wrap gap-1 mb-3">{letters.map(l=><button key={l} onClick={()=>setAl(l)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${al===l?'bg-indigo-600 text-white':'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>{l}</button>)}</div>
    <div className="flex gap-2 mb-3">
      {[{k:'all',l:'全部'},{k:'mastered',l:'已掌握'},{k:'learning',l:'不熟'},{k:'reviewed',l:'复习中'},{k:'skipped',l:'已跳过'},{k:'none',l:'未标记'}].map(({k,l})=><button key={k} onClick={()=>setFilter(k)} className={`px-2 py-1 rounded-full text-xs transition-colors ${filter===k?'bg-indigo-600 text-white':'bg-white text-slate-500 border hover:bg-slate-50'}`}>{l}</button>)}
    </div>

    {l&&<div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"/></div>}

    {sw?<div><button onClick={()=>setSw(null)} className="text-sm text-indigo-600 hover:underline mb-4 inline-block">← 返回</button><VocabCard data={sw} onStatus={()=>{}} index={0} total={1}/></div>
    :<>
      <div className="text-sm text-slate-500 mb-2">{al} · 共{total}词</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {words.map((w:any)=>{
          const st=w.user_status;
          const isEditing=editing===w.id;
          return <div key={w.id} className={`bg-white rounded-xl p-3 border ${st==='mastered'?'border-emerald-300 bg-emerald-50/30':st==='learning'?'border-amber-300 bg-amber-50/30':st==='skipped'?'border-slate-300 bg-slate-50/30':'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-1">
              <button onClick={()=>ld(w.id)} className="font-semibold text-slate-800 text-sm hover:text-indigo-600 text-left">{w.word}</button>
              <div className="flex items-center gap-1">
                {w.exam_frequency&&parseInt(w.exam_frequency)>0&&<span className="text-xs text-amber-500" title="近10年真题出现次数">🔥{w.exam_frequency}</span>}
                <span className="text-xs text-slate-400">{w.part_of_speech}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 mb-2 truncate">{w.meaning_cn}</div>
            <div className="flex items-center justify-between">
              {st?<span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[st]||''}`}>{statusLabels[st]||st}</span>:<span className="text-xs text-slate-300">未标记</span>}
              <div className="flex gap-1">
                {isEditing?<>
                  <button onClick={()=>{changeStatus(w.id,'mastered');setEditing(null)}} className="text-xs text-emerald-600 hover:bg-emerald-50 px-1.5 py-0.5 rounded">掌握</button>
                  <button onClick={()=>{changeStatus(w.id,'learning');setEditing(null)}} className="text-xs text-amber-600 hover:bg-amber-50 px-1.5 py-0.5 rounded">不熟</button>
                  <button onClick={()=>{changeStatus(w.id,'skipped');setEditing(null)}} className="text-xs text-slate-500 hover:bg-slate-50 px-1.5 py-0.5 rounded">跳过</button>
                  {st&&<button onClick={()=>{cancelStatus(w.id);setEditing(null)}} className="text-xs text-red-400 hover:bg-red-50 px-1.5 py-0.5 rounded">清除</button>}
                  <button onClick={()=>setEditing(null)} className="text-xs text-slate-400 px-1 py-0.5">✕</button>
                </>:<button onClick={()=>setEditing(w.id)} className="text-xs text-indigo-500 hover:bg-indigo-50 px-1.5 py-0.5 rounded">修改</button>}
              </div>
            </div>
          </div>;
        })}
      </div>
    </>}
  </div>;
}
