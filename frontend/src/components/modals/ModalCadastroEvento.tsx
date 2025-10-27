import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { dataHora } from "../../utils/facilidades";
import type { Colaborador } from "../../utils/tipos";
import { normalizarTexto } from "../../utils/formatacoes";

interface ModalCadastroEventoProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalCadastroEvento = ({ show, onClose, onSuccess }: ModalCadastroEventoProps) => {
  const [form, setForm] = useState({
    nome_evento: "",
    data_evento: dataHora(),
    duracao_evento: "",
    local_evento: "",
    tipo_evento: "1",
    descricao_evento: "",
    participantes: [] as number[],
  });

  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(false);
  const [todosSelecionados, setTodosSelecionados] = useState(false);

  useEffect(() => {
    if (show) carregarColaboradores();
  }, [show]);

  async function carregarColaboradores() {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:3000/api/colaboradores");
      setColaboradores(data);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
    } finally {
      setLoading(false);
    }
  }

  function limparForm() {
    setForm({
      nome_evento: "",
      data_evento: dataHora(),
      duracao_evento: "",
      local_evento: "",
      tipo_evento: "1",
      descricao_evento: "",
      participantes: [],
    });
    setFiltro("");
    setTodosSelecionados(false);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(id: number) {
    setForm((prev) => {
      const jaSelecionado = prev.participantes.includes(id);
      const novos = jaSelecionado
        ? prev.participantes.filter((pid) => pid !== id)
        : [...prev.participantes, id];
      setTodosSelecionados(novos.length === colaboradores.length);
      return { ...prev, participantes: novos };
    });
  }

  function toggleSelecionarTodos() {
    if (todosSelecionados) {
      setForm((prev) => ({ ...prev, participantes: [] }));
      setTodosSelecionados(false);
    } else {
      const todos = colaboradores.map((c) => c.ID_colaborador);
      setForm((prev) => ({ ...prev, participantes: todos }));
      setTodosSelecionados(true);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/eventos", form);
      onSuccess();
      limparForm();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar evento:", error);
    }
  }

	const colaboradoresFiltrados = colaboradores.filter((c) =>
		normalizarTexto(c.Nome_Col).includes(normalizarTexto(filtro))
	);

  if (!show) return null;

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
          <Modal.Title>Cadastrar Evento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome do Evento</Form.Label>
            <Form.Control
              type="text"
              name="nome_evento"
              placeholder="Ex: Workshop de Liderança"
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
              value={form.data_evento}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duração</Form.Label>
            <Form.Control
              type="text"
              name="duracao_evento"
              placeholder="Ex: 2 horas"
              value={form.duracao_evento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Local ou link</Form.Label>
            <Form.Control
              type="text"
              name="local_evento"
              placeholder="Ex: Auditório Central ou https://exemplo.com"
              value={form.local_evento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo do Evento</Form.Label>
            <Form.Select name="tipo_evento" value={form.tipo_evento} onChange={handleChange} required>
              <option value="1">Feira</option>
              <option value="2">Workshop</option>
              <option value="3">Reunião</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descricao_evento"
              placeholder="Breve descrição sobre o evento..."
              value={form.descricao_evento}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label className="mb-0">Participantes</Form.Label>
              <Button
                size="sm"
                variant={todosSelecionados ? "outline-danger" : "outline-primary"}
                onClick={toggleSelecionarTodos}
                disabled={loading || colaboradores.length === 0}
              >
                {todosSelecionados ? "Desmarcar todos" : "Selecionar todos"}
              </Button>
            </div>

            <div id="colEventoDiv" className="border rounded p-3 mt-2" style={{ maxHeight: "250px", overflowY: "auto" }}>
              {loading ? (
                <div className="text-center py-3">
                  <Spinner animation="border" size="sm" /> Carregando colaboradores...
                </div>
              ) : (
                <>
                  <Form.Control
                    type="search"
                    placeholder="Pesquisar por nome..."
                    className="mb-3"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                  {colaboradoresFiltrados.map((col) => (
                    <div key={col.ID_colaborador} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`col-${col.ID_colaborador}`}
                        checked={form.participantes.includes(col.ID_colaborador)}
                        onChange={() => handleCheckboxChange(col.ID_colaborador)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`col-${col.ID_colaborador}`}
                      >
                        {col.Nome_Col}
                      </label>
                    </div>
                  ))}
                  {colaboradoresFiltrados.length === 0 && (
                    <p className="text-muted text-center">Nenhum colaborador encontrado</p>
                  )}
                </>
              )}
            </div>
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
            Cadastrar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};