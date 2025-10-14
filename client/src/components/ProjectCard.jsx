import VoteButtons from "./VoteButtons";
export default function ProjectCard({ p, onVote, pendingMap }) {
  return (
    <article className="card p-5 group transition-all duration-soft ease-soft hover:-translate-y-0.5 hover:shadow-mdsoft">
      <a href={`/projects/${p.id}`} className="text-[18px] font-semibold text-ink hover:text-primary">{p.title}</a>
      <p className="text-inkSoft mt-1">{p.summary}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-inkSoft">Por {p.author?.username ?? "vecino"} • {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</span>
        <VoteButtons
          projectId={p.id}
          myVote={Number(p.myVote ?? 0)}
          score={Number(p.score ?? 0)}
          onVote={onVote}
          pending={pendingMap?.[p.id]}
        />
      </div>
    </article>
  );
}