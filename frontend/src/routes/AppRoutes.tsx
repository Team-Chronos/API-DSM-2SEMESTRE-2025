import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { AuthProvider } from '../context/AuthContext'
import { PrivateRoute } from './PrivateRoute'
import { Inicio } from '../pages/home/Inicio'
import { Eventos } from '../pages/home/Eventos'
import { Notificacoes } from '../pages/home/Notificacoes'
import { Certificados } from '../pages/home/Certificados'
import { Modalidade } from '../pages/home/Modalidade'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <Login />
            }
          />
            
          <Route
              path="/"
              element={
                  <PrivateRoute><Home /></PrivateRoute>
              }
            >
            
              <Route index element={<PrivateRoute><Inicio /></PrivateRoute>} />
              <Route path="eventos" element={<PrivateRoute><Eventos /></PrivateRoute>} />
              <Route path="notificacoes" element={<PrivateRoute><Notificacoes /></PrivateRoute>} />
              <Route path="modalidade" element={<PrivateRoute><Modalidade /></PrivateRoute>} />
              <Route path="certificados" element={<PrivateRoute><Certificados /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}