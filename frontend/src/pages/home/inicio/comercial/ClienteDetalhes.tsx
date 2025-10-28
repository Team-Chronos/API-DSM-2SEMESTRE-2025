import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { InteracoesList } from "./InteracoesList";
import { formatarTelefone } from "../../../../utils/formatacoes";

interface Cliente {
  ID_Cliente: number;
  Nome_Cliente: string;
  Email_Cliente: string;
  Telefone_Cliente: string;
  Segmento: string;
  atividade: string;
  depart_responsavel: string;
}

export const ClienteDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);

  const carregarCliente = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/clientes/${id}`);
      setCliente(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    carregarCliente();
  }, [id]);

  if (!cliente) return <p>Carregando informações...</p>;

  return (
    <div className="p-4">
      <Link to="/comercial">
        <Button variant="secondary" size="sm" className="mb-3">
          ← Voltar
        </Button>
      </Link>

      <Card className="mb-4">
        <Card.Body>
          <h3>{cliente.Nome_Cliente}</h3>
          <p><strong>Email:</strong> {cliente.Email_Cliente}</p>
          <p><strong>Telefone:</strong> {formatarTelefone(cliente.Telefone_Cliente)}</p>
          <p><strong>Segmento:</strong> {cliente.Segmento}</p>
          <p><strong>Atividade:</strong> {cliente.atividade}</p>
          <p><strong>Departamento:</strong> {cliente.depart_responsavel}</p>
        </Card.Body>
      </Card>

      <InteracoesList idCliente={Number(id)} nomeCliente={cliente.Nome_Cliente} />
    </div>
  );
};
