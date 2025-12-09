import { useState } from "react";
import { ModalCadastroEvento } from "../../../../components/modals/ModalCadastroEvento";
import { ModalMensagem } from "../../../../components/modals/ModalMensagem";

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
      <div className="header-controls d-flex align-items-center gap-3">
        <div className="search-wrapper">
          <i className="bi bi-search"></i>
          <input
            className="form-control"
            type="search"
            placeholder="Pesquisar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <button id="btn-modal-cad" className="btn btn-primary ms-auto text-nowrap" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg"></i>
          <span className={`d-none d-sm-inline-block ms-3`}>Adicionar Evento</span>
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
