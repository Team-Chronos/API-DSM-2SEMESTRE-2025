import { useState } from "react";
import { ModalCadastroColaborador } from "../../../../components/modals/ModalCadastroColaborador";
import { ModalMensagem } from "../../../../components/modals/ModalMensagem";

interface Props {
  onSuccess: () => void;
  filtroSetor: string;
  setFiltroSetor: (value: string) => void;
  filtroModalidade: string;
  setFiltroModalidade: (value: string) => void;
  searchText: string;
  setSearchText: (value: string) => void;
}

export const HeaderControlsColaboradores = ({
  onSuccess,
  filtroSetor,
  setFiltroSetor,
  filtroModalidade,
  setFiltroModalidade,
  searchText,
  setSearchText
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [tituloMessage, setTituloMessage] = useState<"Sucesso" | "Erro" | "Aviso">("Aviso");

  return (
    <>
      <div className="header-controls d-flex align-items-center gap-3 mb-4">
        <div className="search-wrapper me-auto">
          <i className="bi bi-search"></i>
          <input
            className="form-control"
            type="search"
            placeholder="Pesquisar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="filter-wrapper d-flex align-items-center">
          <label htmlFor="filtro-setor" className="form-label mb-0 me-2">Setor:</label>
          <select
            id="filtro-setor"
            className="form-select"
            value={filtroSetor}
            onChange={(e) => setFiltroSetor(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Administrativo</option>
            <option value="2">Comercial</option>
            <option value="3">Operacional</option>
          </select>
        </div>

        <div className="filter-wrapper d-flex align-items-center">
          <label htmlFor="filtro-modalidade" className="form-label mb-0 me-2">Modalidade:</label>
          <select
            id="filtro-modalidade"
            className="form-select"
            value={filtroModalidade}
            onChange={(e) => setFiltroModalidade(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="P">Presencial</option>
            <option value="R">Remoto</option>
            <option value="O">Outro</option>
            <option value="N">Não informado</option>
          </select>
        </div>

        <button id="btn-modal-cad" className="btn btn-primary ms-auto" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i> Adicionar Colaborador
        </button>
      </div>

      <ModalCadastroColaborador
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          onSuccess();
          setMensagem("Colaborador cadastrado com sucesso!");
          setTituloMessage("Sucesso");
          setShowMessage(true);
          setShowModal(false);
        }}
      />

      <ModalMensagem
        show={showMessage}
        titulo={tituloMessage}
        mensagem={mensagem}
        onClose={() => setShowMessage(false)}
      />
    </>
  );
};