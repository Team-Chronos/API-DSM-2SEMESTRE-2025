import { Logo } from "./Logo"
import "../css/sidebar.css";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

interface SidebarProps {
  onLogout: () => void;
}

const navItems = [
  { id: "inicio", label: "Início", icon: "house-door" },
  { id: "notificacoes", label: "Notificações", icon: "bell" },
  { id: "eventos", label: "Eventos", icon: "calendar-event" },
  { id: "modalidade", label: "Modalidade", icon: "buildings" },
  { id: "certificados", label: "Certificados", icon: "file-earmark-text" },
];

export const Sidebar = ({ onLogout }: SidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
	
  const currentPath = location.pathname.replace("/", "") || "inicio";

	const setorMap: Record<number, string> = {
    1: "Administrativo",
    2: "Comercial",
    3: "Operacional",
  };

	const setorTexto = user?.setor ? setorMap[user.setor] : "Desconhecido";

	return (
    <>
      <div id="barra-lateral" className={`d-flex h-100 flex-column align-items-center ${open ? "open" : ""}`}>
        <div id="colab-info" className="d-flex flex-column align-items-center mb-1 mt-4">
          <img
            id="colab-img"
            className="mb-3"
            src="/images/img-colab-test.png"
            alt="Foto do Colaborador"
          />
          <div id="colab-nome" className="mb-2 px-1">
            {user?.nome || "Usuário"}
          </div>
          <div id="modulo">{setorTexto}</div>
        </div>

        <nav className="my-auto overflow-y-auto">
          <ul className="list-unstyled d-flex flex-column mb-0">
            {navItems.map((item) => {
              const iconName =
                item.id === currentPath ? `bi-${item.icon}-fill` : `bi-${item.icon}`;
              return (
                <li
                  key={item.id}
                  className={`d-flex px-2 py-1 ${
                    item.id === currentPath ? "active" : ""
                  }`}
                  onClick={() => {
                    navigate(item.id === "inicio" ? "/" : `/${item.id}`)
                    setOpen(false)
                  }}
                >
                  <i className={`bi ${iconName}`}></i>
                  <span>{item.label}</span>
                </li>
              );
            })}

            <li
              id="btn-logout"
              className="align-self-center d-flex align-items-center px-2 py-1"
              style={{ cursor: "pointer" }}
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Sair</span>
            </li>
          </ul>
        </nav>

        <Logo />
      </div>
      
      <button
        className="btn-toggle-sidebar"
        onClick={() => setOpen(!open)}
      >
        <i className="bi bi-list"></i>
      </button>
    </>
  );
}