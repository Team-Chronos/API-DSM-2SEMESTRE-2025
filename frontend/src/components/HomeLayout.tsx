import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const HomeLayout = () => {
	const { logout } = useAuth()

	return (
    <div className="home-layout d-flex overflow-y-hidden">
      <Sidebar
        onLogout={logout}
      />
      <main className="home-main flex-grow-1 p-4 overflow-y-auto" style={{ height: '100vh' }}>{<Outlet />}</main>
    </div>
  );
}