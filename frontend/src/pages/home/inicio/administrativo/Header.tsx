import type { Tab } from "../../../../utils/tipos";

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  return (
    <div className="header-tabs d-flex flex-row flex-nowrap align-items-center">
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
      <div
        id="btn-relatórios"
        className={`btn ${activeTab === "relatórios" ? "ativo" : ""}`}
        onClick={() => setActiveTab("relatórios")}
      >
        Relatórios
      </div>
    </div>
  );
};
