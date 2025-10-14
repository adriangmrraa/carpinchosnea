import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { api } from '../api'
import toast from 'react-hot-toast'
import VoteButtons from '../components/VoteButtons'
import { fadeUp } from '../ui/motion'

function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    setLoading(true)
    try {
      const res = await api.getProject(id)
      setProject(res)
    } catch (error) {
      toast.error('Error cargando proyecto')
    } finally {
      setLoading(false)
    }
  }

  const [pending, setPending] = useState(false);

  const handleVote = async (projectId, next) => {
    if (pending) return;

    // Optimista: aplicar delta EXACTO una sola vez
    const prevVote = Number(project.myVote || 0);
    if (prevVote === next) return;

    const prevScore = Number(project.score || 0);
    const delta = next - prevVote;
    const nextScore = prevScore + delta;

    setProject(prev => ({ ...prev, myVote: next, score: nextScore }));

    setPending(true);
    try {
      const data = await api.vote(projectId, next);

      // REEMPLAZAR valores por los del servidor
      setProject(prev => ({
        ...prev,
        score: Number(data.score ?? prev.score),
        myVote: Number(data.myVote ?? prev.myVote),
      }));
    } catch (e) {
      // rollback
      setProject(prev => ({ ...prev, myVote: prevVote, score: prevScore }));
    } finally {
      setPending(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  if (!project) return <div className="flex items-center justify-center min-h-screen">Proyecto no encontrado</div>

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-inkSoft mb-4">{project.summary}</p>
      <div className="mb-4">
        <p className="text-sm text-inkSoft">Por {project.author.username} - {new Date(project.createdAt).toLocaleDateString('es-AR')}</p>
      </div>
      <div className="prose mb-6">
        <pre className="whitespace-pre-wrap text-ink">{project.body}</pre>
      </div>
      <VoteButtons
        projectId={project.id}
        myVote={Number(project.myVote ?? 0)}
        score={Number(project.score ?? 0)}
        onVote={handleVote}
        pending={pending}
      />
    </motion.div>
  )
}

export default ProjectDetail