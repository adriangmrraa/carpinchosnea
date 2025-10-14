import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/Button'
import { Input, Textarea } from '../components/ui/Input'

function NewProject() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !summary.trim()) return

    setLoading(true)
    try {
      const res = await api.createProject({ title: title.trim(), summary: summary.trim(), body: body.trim() })
      toast.success('Proyecto publicado')
      navigate(`/projects/${res.id}`)
    } catch (error) {
      toast.error('Error creando proyecto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h1 className="text-2xl font-semibold">Nuevo proyecto</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 mt-6">
        <div><label className="text-sm text-inkSoft">Título</label><Input name="title" maxLength={120} placeholder="Título" value={title} onChange={(e)=>setTitle(e.target.value)} required /><p className="text-inkSoft text-xs mt-1">{title.length}/120</p></div>
        <div><label className="text-sm text-inkSoft">Resumen</label><Textarea name="summary" rows={3} maxLength={300} placeholder="Resumen breve" value={summary} onChange={(e)=>setSummary(e.target.value)} required /><p className="text-inkSoft text-xs mt-1">{summary.length}/300</p></div>
        <div><label className="text-sm text-inkSoft">Contenido</label><Textarea name="body" rows={8} placeholder="Detalles" value={body} onChange={(e)=>setBody(e.target.value)} /></div>
        <div className="pt-2"><Button type="submit" disabled={loading}>{loading ? 'Publicando...' : 'Publicar'}</Button></div>
      </form>
    </div>
  )
}

export default NewProject