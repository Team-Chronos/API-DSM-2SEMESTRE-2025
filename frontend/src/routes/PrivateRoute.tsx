import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { JSX } from 'react'

interface PrivateRouteProps {
  children: JSX.Element
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? children : <Navigate to="/login" replace />
}
