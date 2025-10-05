import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: number;
  nome: string;
  setor: number;
  nivel: number;
}

interface AuthContextType {
  isAuthenticated: boolean
  user?: User
  login: (username: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedAuth = localStorage.getItem('isAuthenticated') === 'true'
  const [isAuthenticated, setIsAuthenticated] = useState(storedAuth)

  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated))
  }, [isAuthenticated])

  const login = (email: string, senha: string) => {
    if (email === 'admin@a' && senha === '123') {
      setIsAuthenticated(true)
      navigate('/')
    } else {
      alert('Usuário ou senha inválidos!')
    }
  }

  const logout = () => {
    if (confirm("Deseja sair?")){
      setIsAuthenticated(false)
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return context
}