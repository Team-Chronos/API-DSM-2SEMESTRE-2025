import { Modal, Button } from "react-bootstrap";

interface ModalConfirmacaoProps {
  show: boolean;
  mensagem: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ModalConfirmacao = ({
  show,
  mensagem,
  onConfirm,
  onClose,
}: ModalConfirmacaoProps) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">{mensagem}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
