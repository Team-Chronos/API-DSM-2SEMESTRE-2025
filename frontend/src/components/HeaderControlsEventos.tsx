import { useState } from "react";
import { ModalCadastroEvento } from "./modals/ModalCadastroEvento";
import { ModalMensagem } from "./modals/ModalMensagem";

interface Props {
  onSuccess: () => void;
  searchText: string;
  setSearchText: (value: string) => void;
}

export const HeaderControlsEventos = ({ onSuccess, searchText, setSearchText }: Props) => {
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

        <button id="btn-modal-cad" className="btn btn-primary ms-auto" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i> Adicionar Evento
        </button>
      </div>

      <ModalCadastroEvento
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          onSuccess();
          setMensagem("Evento cadastrado com sucesso!");
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
