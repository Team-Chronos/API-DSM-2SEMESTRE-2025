import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "../context/AuthContext";
import { PrivateRoute } from "./PrivateRoute";
import { ClienteDetalhes } from "../pages/home/inicio/comercial/ClienteDetalhes";

const Home = lazy(() => import("../pages/Home").then(mod => ({ default: (mod as any).default ?? (mod as any).Home })));
const Login = lazy(() => import("../pages/Login").then(mod => ({ default: (mod as any).default ?? (mod as any).Login })));
const Inicio = lazy(() => import("../pages/home/Inicio").then(mod => ({ default: (mod as any).default ?? (mod as any).Inicio })));
const Eventos = lazy(() => import("../pages/home/Eventos").then(mod => ({ default: (mod as any).default ?? (mod as any).Eventos })));
const Notificacoes = lazy(() => import("../pages/home/Notificacoes").then(mod => ({ default: (mod as any).default ?? (mod as any).Notificacoes })));
const Certificados = lazy(() => import("../pages/home/Certificados").then(mod => ({ default: (mod as any).default ?? (mod as any).Certificados })));
const Modalidade = lazy(() => import("../pages/home/Modalidade").then(mod => ({ default: (mod as any).default ?? (mod as any).Modalidade })));

const LoadingScreen = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status" />
      <p>Carregando...</p>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>}>
              <Route index element={<Inicio />} />
              <Route path="eventos" element={<Eventos />} />
              <Route path="notificacoes" element={<Notificacoes />} />
              <Route path="modalidade" element={<Modalidade />} />
              <Route path="certificados" element={<Certificados />} />

              <Route path="comercial/cliente/:id" element={<ClienteDetalhes />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};
