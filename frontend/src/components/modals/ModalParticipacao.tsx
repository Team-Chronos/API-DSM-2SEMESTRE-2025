import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import type { Evento } from "../../utils/tipos";

interface ModalParticipacaoProps {
  evento: Evento;
  onClose: () => void;
  onConcluirConfirmado: () => void;
}

export const ModalParticipacao = ({ evento, onClose, onConcluirConfirmado }: ModalParticipacaoProps) => {
  const [dataPart, setDataPart] = useState("");
  const [duracao, setDuracao] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConcluirConfirmado();
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{evento.Nome_Evento}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Data</Form.Label>
            <Form.Control type="datetime-local" value={dataPart} onChange={(e) => setDataPart(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Duração</Form.Label>
            <Form.Control value={duracao} onChange={(e) => setDuracao(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Conhecimento adquirido</Form.Label>
            <Form.Control as="textarea" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Concluir evento
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
