import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "./AppRoutes";

interface RoleRouteProps {
  allowedRoles: number[];
}

export function SetorRoute({ allowedRoles }: RoleRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen/>;

  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user.setor)
    ? <Outlet />
    : <Navigate to="/" replace />
}