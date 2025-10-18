interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
	return (
		<header className="page-header d-flex align-items-center justify-content-between mb-4">
	
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
			</div>

			<div className="header-controls d-flex align-items-center flex-grow-1 justify-content-center gap-3 mx-4">
				<div className="search-wrapper">
					<i className="bi bi-search"></i>
					<input className="form-control" type="search" id="pesquisaAdm" placeholder="Pesquisar..." />
				</div>

				<div className="filter-wrapper d-flex align-items-center">
					<label htmlFor="filtro-setor" className="form-label mb-0 me-2">Setor:</label>
					<select id="filtro-setor" className="form-select">
						<option value="">Todos</option>
						<option value="Administrativo">Administrativo</option>
						<option value="Comercial">Comercial</option>
						<option value="Operacional">Operacional</option>
					</select>
				</div>

				<div className="filter-wrapper d-flex align-items-center">
					<label htmlFor="filtro-modalidade" className="form-label mb-0 me-2">Modalidade:</label>
					<select id="filtro-modalidade" className="form-select">
						<option value="">Todas</option>
						<option value="Presencial">Presencial</option>
						<option value="Remoto">Remoto</option>
						<option value="Outro">Outro</option>
						<option value="Não informado">Não informado</option>
					</select>
				</div>
			</div>

			<div>
				<button id="btn-modal-cad" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#cadColabMod">
					<i className="bi bi-plus-lg"></i> Adicionar Colaborador
				</button>
			</div>
		</header>
	)
}