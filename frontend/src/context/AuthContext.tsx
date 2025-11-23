import { jwtDecode } from 'jwt-decode';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../utils/tipos';

interface AuthContextType {
  user?: User
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded: User = jwtDecode(token)
        setUser(decoded)
      } catch (err) {
        console.error("Token inválido")
        localStorage.removeItem("token")
        setUser(undefined)
      }
    }
    setLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token)
    const decoded = jwtDecode<User>(token)
    setUser(decoded)
  }

  const logout = () => {
    if (confirm("Deseja sair?")) {
      localStorage.removeItem("token")
      localStorage.removeItem("localidadeData")
      setUser(undefined)
      navigate("/login")
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return context
}
