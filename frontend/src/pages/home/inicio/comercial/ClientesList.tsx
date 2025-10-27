import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table } from "react-bootstrap";
import { ModalCadastroCliente } from "../../../../components/modals/ModalCadastroCliente";
import type { Cliente } from "../../../../utils/tipos";
import { useNavigate } from "react-router-dom";

export const ClientesList = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const carregarClientes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar clientes");
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Clientes Cadastrados</h3>
        <Button onClick={() => setShowModal(true)}>+ Novo Cliente</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Segmento</th>
            <th>Atividade</th>
            <th>Departamento</th>
            <th>Data Cadastro</th>
            <th>Ver Histórico</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.ID_Cliente}>
              <td>{c.Nome_Cliente}</td>
              <td>{c.Email_Cliente}</td>
              <td>{c.Telefone_Cliente}</td>
              <td>{c.segmento_atuacao}</td>
              <td>{c.atividade}</td>
              <td>{c.depart_responsavel}</td>
              <td>{new Date(c.Data_Cadastro).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/comercial/cliente/${c.ID_Cliente}`)}
                >
                  Ver histórico
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalCadastroCliente
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={carregarClientes}
      />
    </div>
  );
};
