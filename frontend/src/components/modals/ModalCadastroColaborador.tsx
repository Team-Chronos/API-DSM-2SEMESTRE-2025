import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { formatarCpf, formatarTelefone } from "../../utils/formatacoes";
import type { Cargos } from "../../utils/tipos";

interface ModalCadastroColaboradorProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalCadastroColaborador = ({ show, onClose, onSuccess }: ModalCadastroColaboradorProps) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
    id_cargo: "1",
    setor: "1",
  });

  const [cargos, setCargos] = useState<Cargos[]>([]);

  useEffect(() => {
    if (show) {
      axios.get("http://localhost:3000/api/colaboradores/cargos")
        .then(response => {
          setCargos(response.data);
          if (response.data.length > 0) {
            setForm(prevForm => ({ ...prevForm, id_cargo: response.data[0].ID_Cargo.toString() }));
          }
        })
        .catch(error => console.error("Erro ao buscar cargos:", error));
    }
  }, [show]);

  function limparForm() {
    setForm({
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      cpf: "",
      id_cargo: cargos.length > 0 ? cargos[0].ID_Cargo.toString() : "",
      setor: "1",
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    switch (name) {
      case "telefone":
        formattedValue = formatarTelefone(value);
        break;
      case "cpf":
        formattedValue = formatarCpf(value);
        break;
    }
    setForm({ ...form, [name]: formattedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        telefone: form.telefone.replace(/\D/g, ''),
        cpf: form.cpf.replace(/\D/g, '')
      };
      await axios.post("http://localhost:3000/api/colaboradores", payload);
      onSuccess();
      onClose();
      limparForm();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao cadastrar colaborador");
    }
  };

  return (
    <Modal show={show} centered onHide={() => {
      limparForm();
      onClose();
    }}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Colaborador</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome Completo</Form.Label>
            <Form.Control type="text" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} autoComplete="none" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} autoComplete="none" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Senha</Form.Label>
            <Form.Control type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control type="tel" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(99) 99999-9999" maxLength={15} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>CPF</Form.Label>
            <Form.Control type="text" name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" maxLength={14} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cargo</Form.Label>
            <Form.Select name="id_cargo" value={form.id_cargo} onChange={handleChange} required>
              {cargos.map(cargo => (
                <option key={cargo.ID_Cargo} value={cargo.ID_Cargo}>
                  {cargo.Nome_Cargo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Setor</Form.Label>
            <Form.Select name="setor" value={form.setor} onChange={handleChange} required>
              <option value="1">Administrativo</option>
              <option value="2">Comercial</option>
              <option value="3">Operacional</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            limparForm();
            onClose();
          }}>
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