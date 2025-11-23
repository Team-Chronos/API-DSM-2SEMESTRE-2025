import { Modal, Button } from "react-bootstrap";

interface Props {
  show: boolean;
  onClose: () => void;
  tipo: "sucesso" | "erro" | "aviso";
  titulo: string;
  mensagem: string;
}

export function ModalFeedback({ show, onClose, tipo, titulo, mensagem }: Props) {
  
  const config = {
    sucesso: {
      headerBg: "bg-success",
      icon: "bi-check-circle-fill",
      color: "text-success",
      btnVariant: "success"
    },
    erro: {
      headerBg: "bg-danger",
      icon: "bi-x-circle-fill",
      color: "text-danger",
      btnVariant: "danger"
    },
    aviso: {
      headerBg: "bg-warning",
      icon: "bi-exclamation-triangle-fill",
      color: "text-warning",
      btnVariant: "warning"
    }
  };

  const estilo = config[tipo];

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header className={`${estilo.headerBg} text-white`}>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        <div className={`display-1 mb-3 ${estilo.color}`}>
          <i className={`bi ${estilo.icon}`}></i>
        </div>
        <h5 className="mb-3">{mensagem}</h5>
      </Modal.Body>

      <Modal.Footer>
        <Button variant={estilo.btnVariant} onClick={onClose} className="w-100">
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  );
}