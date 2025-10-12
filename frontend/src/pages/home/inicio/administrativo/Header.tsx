import type { Tab } from "../../../../utils/tipos";

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <div className="page-header d-flex align-items-center justify-content-between mb-4">
      <div className="header-tabs d-flex">
        <div
          id="btn-colaboradores"
          className={`btn ${activeTab === "colaboradores" ? "ativo" : ""}`}
          onClick={() => setActiveTab("colaboradores")}
        >
          Colaboradores
        </div>
        <div
          id="btn-eventos"
          className={`btn ${activeTab === "eventos" ? "ativo" : ""}`}
          onClick={() => setActiveTab("eventos")}
        >
          Eventos
        </div>
        {/* <div
          id="btn-cargos"
          className={`btn ${activeTab === "cargos" ? "ativo" : ""}`}
          onClick={() => setActiveTab("cargos")}
        >
          Cargos
        </div> */}
      </div>
    </div>
  );
};
