import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../api'
import { getOrCreateUid, getUsername } from '../session/uid'
import toast from 'react-hot-toast'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { fadeUp } from '../ui/motion'

function Profile() {
  const [myProjects, setMyProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const uid = getOrCreateUid()
  const username = getUsername()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      // Fetch projects by authorId
      const projectsRes = await api.listProjects({ authorId: uid, pageSize: 100 })
      setMyProjects(projectsRes.items)
    } catch (error) {
      toast.error('Error cargando perfil')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Perfil</h1>
      <Card className="p-5 mb-6"><p className="text-inkSoft">Usuario: <span className="font-medium text-ink">{username}</span></p></Card>
      <h2 className="text-xl font-semibold mb-3">Mis proyectos</h2>
      {myProjects.length === 0
        ? <Card className="p-10 text-center"><p className="text-inkSoft">Todavía no creaste proyectos.</p><a href="/projects/new" className="inline-block mt-4"><Button>Crear proyecto</Button></a></Card>
        : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {myProjects.map(p=>(
              <Card key={p.id} className="p-5">
                <a href={`/projects/${p.id}`} className="text-[18px] font-semibold hover:text-primary">{p.title}</a>
                <p className="text-inkSoft mt-1">{p.summary}</p>
              </Card>
            ))}
          </div>}
    </>
  )
}

export default Profile