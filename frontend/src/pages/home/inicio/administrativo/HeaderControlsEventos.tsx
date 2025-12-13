import { useState } from "react";
import { ModalCadastroEvento } from "../../../../components/modals/ModalCadastroEvento";
import { ModalMensagem } from "../../../../components/modals/ModalMensagem";
import "../../../../css/headerEvento.css"
import { GrAdd } from "react-icons/gr";

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
      <div className="eventos-header">
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

        <button className="eventos-btn-add" onClick={() => setShowModal(true)}>
          <i className="eventos-btn-icon"><GrAdd /></i>
          <span className="eventos-btn-text">Adicionar Evento</span>
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
