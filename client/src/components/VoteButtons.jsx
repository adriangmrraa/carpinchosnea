import { Badge } from "./ui/Badge";

/**
 * Reglas:
 * - myVote: -1 (dislike), 0 (sin voto), 1 (like)
 * - Click en el mismo voto NO hace nada.
 * - Click en el otro voto cambia y ajusta score en consecuencia (lo maneja el padre).
 * - Botones deshabilitados mientras pending=true (por proyecto).
 */
export default function VoteButtons({ projectId, myVote = 0, score = 0, onVote, pending = false }) {
  const isLike = Number(myVote) === 1;
  const isDislike = Number(myVote) === -1;

  const clickLike = () => {
    if (!pending && !isLike) onVote(projectId, 1);
  };
  const clickDislike = () => {
    if (!pending && !isDislike) onVote(projectId, -1);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-pressed={isLike}
        disabled={pending || isLike}
        onClick={clickLike}
        title="Votar a favor"
        className={`btn px-3 py-2 rounded-lg transition-all ${
          isLike
            ? "bg-blue-100 ring-2 ring-blue-400 text-blue-700"
            : "bg-surface2 hover:shadow-xssoft"
        } ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        👍
      </button>

      <Badge>{Number(score) || 0}</Badge>

      <button
        type="button"
        aria-pressed={isDislike}
        disabled={pending || isDislike}
        onClick={clickDislike}
        title="Votar en contra"
        className={`btn px-3 py-2 rounded-lg transition-all ${
          isDislike
            ? "bg-danger/10 ring-2 ring-danger/40 text-danger"
            : "bg-surface2 hover:shadow-xssoft"
        } ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        👎
      </button>
    </div>
  );
}