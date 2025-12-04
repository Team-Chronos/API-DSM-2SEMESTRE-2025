import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { tp_tipo_evento, type Notificacao } from "../../utils/tipos";
import { dataHora } from "../../utils/facilidades";

interface ModalParticipacaoProps {
  show: boolean;
  evento: Notificacao | null;
  onClose: () => void;
  onSuccess: (idEvento: number) => void;
}

export const ModalParticipacao = ({
  show,
  evento,
  onClose,
  onSuccess,
}: ModalParticipacaoProps) => {
  const { user } = useAuth();

  if (!evento || !user) return null;

  const [form, setForm] = useState({
    id_colab: user.id,
    id_evento: evento.ID_Evento,
    objetivo: "",
    principais_infos: "",
    aplicacoes_newe: "",
    referencias: "",
    avaliacao: 0,
    comentarios: "",
  });

  function limparForm() {
    if (!evento || !user) return;
    setForm({
      id_colab: user.id,
      id_evento: evento.ID_Evento,
      objetivo: "",
      principais_infos: "",
      aplicacoes_newe: "",
      referencias: "",
      avaliacao: 0,
      comentarios: "",
    });
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/certificadoParticipacao", form);
      onSuccess(evento.ID_Evento);
      limparForm();
      onClose();
    } catch (error) {
      console.error("Erro ao enviar participação:", error);
      alert("Erro ao enviar participação. Tente novamente.");
    }
  };

  return (
    <Modal show={show} centered onHide={onClose} size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Concluir Evento — {evento.Nome_Evento}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Título do Evento</Form.Label>
            <Form.Control type="text" value={evento.Nome_Evento} readOnly />
          </Form.Group>

          <div className="d-flex flex-row gap-2">
            <Form.Group className="flex-fill">
              <Form.Label>Data do Evento</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dataHora(evento.Data_Evento)}
                readOnly
              />
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>Duração</Form.Label>
              <Form.Control type="text" value={evento.Duracao_Evento} readOnly />
            </Form.Group>
          </div>

          <div className="d-flex flex-row gap-2 mt-2">
            <Form.Group className="flex-fill">
              <Form.Label>Local</Form.Label>
              <Form.Control type="text" value={evento.Local_Evento} readOnly />
            </Form.Group>

            <Form.Group className="flex-fill">
              <Form.Label>Tipo do Evento</Form.Label>
              <Form.Control
                type="text"
                value={
                  tp_tipo_evento[evento.ID_Tipo_Evento as keyof typeof tp_tipo_evento]
                }
                readOnly
              />
            </Form.Group>
          </div>

          <hr />

          <Form.Group className="mb-3">
            <Form.Label>Objetivo da Participação</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="objetivo"
              placeholder="Descreva por que participou do evento e qual era a expectativa"
              value={form.objetivo}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Principais Informações</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="principais_infos"
              placeholder="Liste os temas abordados, dados relevantes, tendências, insights ou aprendizados obtidos."
              value={form.principais_infos}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Aplicações e Sugestões</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="aplicacoes_newe"
              placeholder="Como essas informações podem ser aplicadas na sua área ou empresa? Sugerir iniciativas, testes ou ações práticas."
              value={form.aplicacoes_newe}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Referências</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="referencias"
              placeholder="Links, PDFs, apresentações, nomes de palestrantes ou empresas citadas."
              value={form.referencias}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Avaliação (0 a 10)</Form.Label>
            <Form.Range
              min={0}
              max={10}
              step={1}
              name="avaliacao"
              value={form.avaliacao}
              onChange={handleChange}
            />
            <div className="text-center fw-bold">{form.avaliacao}</div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comentários</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="comentarios"
              placeholder="Comentários adicionais sobre o evento."
              value={form.comentarios}
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
            Enviar e Concluir
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};