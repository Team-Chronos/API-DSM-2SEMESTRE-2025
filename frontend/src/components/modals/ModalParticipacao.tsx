import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { tp_tipo_evento, type Notificacao } from "../../utils/tipos";
import { dataHora } from "../../utils/facilidades";

interface ModalParticipacaoProps {
  show: boolean;
  evento: Notificacao | null;
  onClose: () => void;
  onSuccess: (idEvento: number) => void;
}

export const ModalParticipacao = ({ show, evento, onClose, onSuccess }: ModalParticipacaoProps) => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    objetivo: "",
    principais_infos: "",
    aplicacoes_newe: "",
    referencias: "",
    avaliacao: 0,
    comentarios: "",
  });

  const [loading, setLoading] = useState(false);

  if (!evento || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const descricaoCompleta = `
OBJETIVO DA PARTICIPAÇÃO:
${form.objetivo}

PRINCIPAIS INFORMAÇÕES:
${form.principais_infos}

APLICAÇÕES E SUGESTÕES:
${form.aplicacoes_newe}

REFERÊNCIAS:
${form.referencias}

AVALIAÇÃO: ${form.avaliacao}/10

COMENTÁRIOS ADICIONAIS:
${form.comentarios}
      `.trim();

      const dadosParaEnviar = {
        ID_Colaborador: user.id,
        ID_Evento: evento.ID_Evento,
        Data_Part: new Date().toISOString(),
        Duracao_Part: evento.Duracao_Evento, 
        Descricao_Part: descricaoCompleta
      };

      console.log(" Enviando dados para o banco:", dadosParaEnviar);

      await axios.post("http://localhost:3000/api/certificadoParticipacao", dadosParaEnviar);

      onSuccess(evento.ID_Evento);
      onClose();
      
    } catch (error: any) {
      console.error(" Erro ao enviar participação:", error);
      console.error("Resposta do servidor:", error.response?.data);
      
      alert(`Erro ao enviar participação: ${error.response?.data?.mensagem || "Verifique o console para detalhes"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      centered
      onHide={() => {
        onClose();
      }}
      size="lg"
    >
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
              <Form.Control
                type="text"
                value={evento.Duracao_Evento}
                readOnly
              />
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
                value={tp_tipo_evento[evento.ID_Tipo_Evento as keyof typeof tp_tipo_evento]}
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
              onClose();
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar e Concluir"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};