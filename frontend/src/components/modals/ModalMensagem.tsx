import { Modal, Button } from "react-bootstrap";

interface ModalMensagemProps {
  show: boolean;
  titulo: "Sucesso" | "Erro" | "Aviso";
  mensagem: string;
  onClose: () => void;
}

export const ModalMensagem = ({
  show,
  titulo,
  mensagem,
  onClose,
}: ModalMensagemProps) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center d-flex flex-column">
        {titulo === 'Sucesso' ? (
            <i className="bi bi-check-circle-fill text-success" style={{fontSize: "3rem"}}></i>
          ) : titulo === 'Erro' ? (
            <i className="bi bi-x-circle-fill text-danger" style={{fontSize: "3rem"}}></i>
          ) : null
        }
        <p style={{ fontSize: "1.25rem"}}>{mensagem}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
