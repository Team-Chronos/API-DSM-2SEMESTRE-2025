import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { formatarTelefone } from "../../utils/formatacoes";
import { useAuth } from "../../context/AuthContext";

interface ModalCadastroClienteProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalCadastroCliente = ({ show, onClose, onSuccess }: ModalCadastroClienteProps) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    segmento: "",
    cidade: "",
    atividade: "",
    depart_responsavel: "",
  });

  function limparForm() {
    setForm({
      nome: "",
      email: "",
      telefone: "",
      segmento: "",
      cidade: "",
      atividade: "",
      depart_responsavel: "",
    });
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (e.target.name === "telefone") e.target.value = formatarTelefone(e.target.value);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      form.telefone = form.telefone.replace(/\D/g, "");
      await axios.post("http://localhost:3000/api/clientes", {
        ...form,
        criadoPor: user?.id,
      });
      onSuccess();
      onClose();
      limparForm();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao cadastrar cliente");
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
          <Modal.Title>Cadastro de Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="nome"
              placeholder="Nome"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Departamento Responsável</Form.Label>
            <Form.Control
              type="text"
              name="depart_responsavel"
              value={form.depart_responsavel}
              onChange={handleChange}
              placeholder="Departamento"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(99) 99999-9999"
              maxLength={15}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cidade*</Form.Label>
            <Form.Control
              type="text"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
              placeholder="Cidade do cliente"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Segmento*</Form.Label>
            <Form.Control
              type="text"
              name="segmento"
              value={form.segmento}
              onChange={handleChange}
              placeholder="Ex: Varejo, Indústria, Logística"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Atividade</Form.Label>
            <Form.Control
              type="text"
              name="atividade"
              value={form.atividade}
              onChange={handleChange}
              placeholder="Atividade"
              required
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
            Cadastrar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
