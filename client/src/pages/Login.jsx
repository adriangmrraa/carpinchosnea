import { useState } from 'react'
import { motion } from 'framer-motion'
import { setUsername } from '../session/uid'
import toast from 'react-hot-toast'
import { fadeUp } from '../ui/motion'

function Login() {
  const [username, setUsernameState] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setUsername(username)
    toast.success('Nombre guardado')
    window.location.href = '/feed'
  }

  
  
  return (
    <div className="min-h-[70vh] grid place-items-center">
      <motion.div
        className="card max-w-md w-full p-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">CARPINCHOS DECIDEN</h1>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsernameState(e.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn-primary w-full">Ingresar</button>
        </form>
      </motion.div>
    </div>
  )
}

export default Login