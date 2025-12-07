import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const HomeLayout = () => {
	const { logout } = useAuth()

	return (
    <div className="home-layout d-flex overflow-y-hidden" style={{ height: '100vh' }}>
      <Sidebar
        onLogout={logout}
      />
      <main className="home-main w-100 p-4 overflow-y-auto">{<Outlet />}</main>
    </div>
  );
}