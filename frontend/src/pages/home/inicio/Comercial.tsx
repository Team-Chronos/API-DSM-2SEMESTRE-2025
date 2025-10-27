import { useState } from "react";
import { ComercialDashboard } from "./comercial/ComercialDashboard";
import { ClientesList } from "./comercial/ClientesList";
import { ModalDestaqueClientes } from "../../../components/modals/ModalDestaqueClientes";
import { ModalEtapas } from "../../../components/modals/ModalEtapas"; 
import "../../../css/Comercial.css";

export const Comercial = () => {
  const [view, setView] = useState("dashboard");

  if (view === "clientes") {
    return (
      <div>
        <button className="btn-voltar" onClick={() => setView("dashboard")}>
          &larr; Voltar ao Dashboard
        </button>
        <ClientesList />
      </div>
    );
  }

  if (view === "etapas") {
    return (
      <div>
        <button className="btn-voltar" onClick={() => setView("dashboard")}>
          &larr; Voltar ao Dashboard
        </button>
        <ModalEtapas />
      </div>
    );
  }

  return (
    <div>
      <ModalDestaqueClientes />
      <div className="grafico-container">
        <div className="comercial-dashboard">
          <ComercialDashboard />
        </div>

        <nav className="botoes-navegacao">
          <button className="btn-azul">Segmentos</button>
          <button className="btn-azul" onClick={() => setView("etapas")}>
            Etapas
          </button>
          <button className="btn-azul" onClick={() => setView("clientes")}>
            Clientes
          </button>
          <button className="btn-azul botao-separado">Gerar relatórios</button>
        </nav>
      </div>
    </div>
  );
};
