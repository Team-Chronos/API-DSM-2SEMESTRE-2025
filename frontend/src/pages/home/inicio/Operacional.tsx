import "../../../css/operacional.css";
import { useNavigate } from "react-router-dom";
import { FaCar, FaTruck, FaBuilding, FaClipboardList } from "react-icons/fa";

const buttons = [
  { 
    id: 1, 
    label: "Veículo Agregado", 
    desc: "Gestão de frota terceira", 
    route: "/gestao-agregado", 
    icon: <FaCar /> 
  },
  { 
    id: 2, 
    label: "Veículo Frota", 
    desc: "Gestão de frota própria", 
    route: "/gestao-frota", 
    icon: <FaTruck /> 
  },
  { 
    id: 3, 
    label: "Fechamento Predial", 
    desc: "Checklist diário de segurança", 
    route: "/gestao-fechamento", 
    icon: <FaBuilding /> 
  },
  { 
    id: 4, 
    label: "Manutenção Predial", 
    desc: "Checklist de infraestrutura", 
    route: "/checklist", 
    icon: <FaClipboardList /> 
  },
];

export function Operacional() {
  const navigate = useNavigate();

  return (
    <div className="operacional-container">
      <div className="operacional-content">
        <div className="operacional-header">
          <h2>Painel Operacional</h2>
          <span className="subtitle">Selecione o módulo de gestão</span>
        </div>
        
        <div className="operacional-grid">
          {buttons.map(({ id, label, desc, route, icon }) => (
            <div 
              key={id} 
              className="dashboard-card" 
              onClick={() => navigate(route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(route)}
            >
              <div className="card-icon">
                {icon}
              </div>
              <div className="card-info">
                <h3>{label}</h3>
                <p>{desc}</p>
              </div>
              
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}