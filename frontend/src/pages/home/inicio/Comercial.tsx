import { useState } from "react";
import { ComercialDashboard } from "./comercial/ComercialDashboard";
import { ClientesList } from "./comercial/ClientesList";
import { RelatorioList } from "./comercial/RelatorioList";
import { ModalDestaqueClientes } from "../../../components/modals/ModalDestaqueClientes";
import "../../../css/Comercial.css";
import { ModalEtapas } from "../../../components/modals/ModalEtapas";
import { CotacoesList } from "./comercial/cotacoes";
export const Comercial = () => {
  const [view, setView] = useState("dashboard");

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
  else if (view === "clientes") {
    return (
      <div>
        <button className="btn-voltar" onClick={() => setView("dashboard")}>
          &larr; Voltar ao Dashboard
        </button>
        <ClientesList />
      </div>
    );
  }  else if (view === "cotacoes") {
    return (
      <div>
        <button className="btn-voltar" onClick={() => setView("dashboard")}>
          &larr; Voltar ao Dashboard
        </button>
        <CotacoesList />
      </div>
    );
  }else if (view === "relatorio") {
    return (
      <div>
        <button className="btn-voltar" onClick={() => setView("dashboard")}>
          &larr; Voltar ao Dashboard
        </button>
        <RelatorioList />
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
          <button className="btn-azul" onClick={() => setView("etapas")}>Etapas</button>
          <button className="btn-azul" onClick={() => setView("clientes")}>
            Clientes
          </button>
           <button className="btn-azul" onClick={() => setView("cotacoes")}>
            Cotações
          </button>
          <button className="btn-azul botao-separado" onClick={() => setView("relatorio")}>Gerar relatórios</button>
        </nav>
      </div>

    </div>
  );
};