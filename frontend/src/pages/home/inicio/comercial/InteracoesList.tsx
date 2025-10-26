import { useEffect, useState } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../../../context/AuthContext";

interface Interacao {
  ID_Interacao: number;
  ID_Cliente: number;
  ID_Colaborador: number | null;
  Data_Interacao: string;
  Tipo_Interacao: string;
  Descricao: string;
  Resultado: string;
  Nome_Cliente?: string;
  Nome_Col?: string;
}

interface Props {
  idCliente: number;
  nomeCliente: string;
}

export const InteracoesList = ({ idCliente }: Props) => {
  const { user } = useAuth()
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    Tipo_Interacao: "Ligação",
    Descricao: "",
    Resultado: "",
  });

  const carregarInteracoes = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/interacoes/${idCliente}`);
      setInteracoes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (idCliente) carregarInteracoes();
  }, [idCliente]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const colaboradorId = user?.id;

      await axios.post("http://localhost:3000/api/interacoes", {
        ...form,
        ID_Cliente: idCliente,
        ID_Colaborador: colaboradorId,
      });

      setShowModal(false);
      setForm({
        Tipo_Interacao: "Ligação",
        Descricao: "",
        Resultado: "",
      });
      carregarInteracoes();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar interação");
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Histórico de Interações</h3>
        <Button onClick={() => setShowModal(true)}>+ Nova Interação</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Resultado</th>
            <th>Responsável</th>
          </tr>
        </thead>
        <tbody>
          {interacoes.map((i) => (
            <tr key={i.ID_Interacao}>
              <td>{new Date(i.Data_Interacao).toLocaleString()}</td>
              <td>{i.Nome_Cliente || i.ID_Cliente}</td>
              <td>{i.Tipo_Interacao}</td>
              <td>{i.Descricao}</td>
              <td>{i.Resultado}</td>
              <td>{i.Nome_Col || "—"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Nova Interação</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Interação</Form.Label>
              <Form.Select
                name="Tipo_Interacao"
                value={form.Tipo_Interacao}
                onChange={handleChange}
                required
              >
                <option value="Ligação">Ligação</option>
                <option value="Email">Email</option>
                <option value="Reunião">Reunião</option>
                <option value="Mensagem">Mensagem</option>
                <option value="Outro">Outro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="Descricao"
                rows={3}
                value={form.Descricao}
                onChange={handleChange}
                placeholder="Descreva brevemente a interação..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Resultado</Form.Label>
              <Form.Control
                type="text"
                name="Resultado"
                value={form.Resultado}
                onChange={handleChange}
                placeholder="Resultado do contato"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
