import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api'

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.me()
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  if (isAuthenticated === null) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default ProtectedRoute