import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { dataHora } from "../../utils/facilidades";
import type { Evento } from "../../utils/tipos";

interface ModalEditarEventoProps {
  show: boolean;
  evento: Evento | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalEditarEvento = ({ show, evento, onClose, onSuccess }: ModalEditarEventoProps) => {
  const [form, setForm] = useState({
    nome_evento: "",
    data_evento: dataHora(),
    duracao_evento: "",
    local_evento: "",
    descricao_evento: "",
    participantes: [] as number[],
  });

  function limparForm() {
    setForm({
      nome_evento: "",
      data_evento: dataHora(),
      duracao_evento: "",
      local_evento: "",
      descricao_evento: "",
      participantes: [],
    });
  }

  useEffect(() => {
    if (evento) {
      setForm({
        nome_evento: evento.Nome_Evento || "",
        data_evento: dataHora(evento.Data_Evento),
        duracao_evento: evento.Duracao_Evento?.toString() || "",
        local_evento: evento.Local_Evento || "",
        descricao_evento: evento.Descricao || "",
        participantes: evento.participantes || [],
      });
    } else {
      limparForm();
    }
  }, [evento]);

  if (!evento) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evento) return;

    try {
      await axios.put(`http://localhost:3000/api/eventos/${evento.ID_Evento}`, form);
      onSuccess();
      onClose();
      limparForm();
    } catch (error) {
      console.error("Erro ao atualizar evento:", error);
    }
  };

  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        limparForm();
        onClose();
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Evento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome do Evento</Form.Label>
            <Form.Control
              type="text"
              name="nome_evento"
              value={form.nome_evento}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Data do Evento</Form.Label>
            <Form.Control
              type="datetime-local"
              name="data_evento"
              value={dataHora(form.data_evento)}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duração (horas)</Form.Label>
            <Form.Control
              type="text"
              name="duracao_evento"
              value={form.duracao_evento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Local ou link do evento</Form.Label>
            <Form.Control
              type="text"
              name="local_evento"
              value={form.local_evento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descricao_evento"
              value={form.descricao_evento}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              limparForm();
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};