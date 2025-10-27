import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { formatarCpf, formatarTelefone } from "../../utils/formatacoes";
import type { Cargos } from "../../utils/tipos";

interface ModalEditarColaboradorProps {
  show: boolean;
  colaborador: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalEditarColaborador = ({ show, colaborador, onClose, onSuccess }: ModalEditarColaboradorProps) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    id_cargo: "1",
    setor: "1",
  });

  const [cargos, setCargos] = useState<Cargos[]>([]);

	function limparForm(){
		setForm({
			nome: "",
			email: "",
			telefone: "",
			cpf: "",
      id_cargo: "1",
			setor: "1",
		});
	}

  useEffect(() => {

		if (colaborador) {
			setForm({
				nome: colaborador.Nome_Col || "",
				email: colaborador.Email || "",
				telefone: formatarTelefone(colaborador.Telefone || "") || "",
				cpf: formatarCpf(colaborador.CPF || "") || "",
        id_cargo: colaborador.ID_Cargo,
				setor: colaborador.Setor || 1,
			});
		} else {
			limparForm();
		}

    async function getCargos(){
      const resCargos = await axios.get("http://localhost:3000/api/colaboradores/cargos")
      setCargos(resCargos.data)
    }
    getCargos()

	}, [colaborador]);

  if (!colaborador) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let { name, value } = e.target;
		switch (name){
			case "telefone":
				value = formatarTelefone(value)
				break
			case "cpf":
				value = formatarCpf(value)
				break
		}
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
			form.telefone = form.telefone.replace(/\D/g, '')
			form.cpf = form.cpf.replace(/\D/g, '')
      await axios.put(`http://localhost:3000/api/colaboradores/${colaborador.ID_colaborador}`, form);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao editar colaborador:", error);
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
          <Modal.Title>Editar Colaborador</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome Completo</Form.Label>
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
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="tel"
              name="telefone"
              placeholder="(99) 99999-9999"
              value={form.telefone}
              onChange={handleChange}
              maxLength={15}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CPF</Form.Label>
            <Form.Control
              type="text"
              name="cpf"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={handleChange}
							maxLength={14}
            />
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
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
