import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, list as listVar, item as itemVar } from "../ui/motion";
import ProjectCard from "../components/ProjectCard";
import { Input, Select } from "../components/ui/Input";
import { api } from "../api";

export default function Feed() {
  const [items, setItems] = useState([]), [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null), [search, setSearch] = useState(""), [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1); const pageSize = 12;
  const [pendingMap, setPendingMap] = useState({}); // { [projectId]: boolean }

  const setPending = (id, v) => setPendingMap((m) => ({ ...m, [id]: v }));

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const data = await api.listProjects({ search, sort, page, pageSize });
        if(!ignore) setItems(Array.isArray(data.items) ? data.items : []);
      } catch(e){ if(!ignore) setErr(e.message || "Error al cargar"); } finally { if(!ignore) setLoading(false); }
    })();
    return () => { ignore = true; };
  }, [search, sort, page]);

  const onVote = async (projectId, next) => {
    // next ∈ {-1, 1}
    if (pendingMap[projectId]) return;

    // Optimista: aplicar delta EXACTO una sola vez
    setItems((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const prevVote = Number(p.myVote || 0);   // -1 | 0 | 1
        if (prevVote === next) return p;          // mismo voto: nada

        const prevScore = Number(p.score || 0);
        const delta = next - prevVote;            // 0->1:+1, 0->-1:-1, -1->1:+2, 1->-1:-2
        const nextScore = prevScore + delta;

        return { ...p, myVote: next, score: nextScore };
      })
    );

    setPending(projectId, true);
    try {
      const data = await api.vote(projectId, next); // { score, myVote }

      // IMPORTANTÍSIMO: REEMPLAZAR valores por los del servidor (no volver a sumar)
      setItems((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                score: Number(data.score ?? p.score),
                myVote: Number(data.myVote ?? p.myVote),
              }
            : p
        )
      );
    } catch (e) {
      // Rollback: re-cargar esa página del feed
      try {
        const qs = new URLSearchParams({
          search,
          sort,
          page: String(page),
          pageSize: String(pageSize),
        });
        const r = await fetch(`/api/projects?${qs}`);
        const d = await r.json();
        setItems(Array.isArray(d.items) ? d.items : []);
      } catch {}
    } finally {
      setPending(projectId, false);
    }
  };

  return (
    <div className="container-app py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Proyectos</h1>
        <p className="text-inkSoft mt-1">Explorá, votá y proponé ideas.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <Input placeholder="Buscar proyectos…" value={search}
          onChange={(e)=>{ setPage(1); setSearch(e.target.value); }} />
        <Select value={sort} onChange={(e)=>{ setPage(1); setSort(e.target.value); }}>
          <option value="recent">Más recientes</option>
          <option value="top">Más votados</option>
        </Select>
      </div>

      {err && <div className="bg-red-100 border border-red-300 p-5 rounded-lg"><p className="text-red-800">⚠️ {err}</p></div>}

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({length:6}).map((_,i)=><div key={i} className="skel h-40"/>)}
        </div>
      )}

      {!loading && !err && items.length===0 && (
        <div className="card p-10 text-center"><p className="text-inkSoft">No hay resultados.</p></div>
      )}

      {!loading && !err && items.length>0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p)=>(
            <ProjectCard key={p.id} p={p} onVote={onVote} pendingMap={pendingMap}/>
          ))}
        </div>
      )}
    </div>
  );
}