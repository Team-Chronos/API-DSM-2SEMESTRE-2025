import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Cliente {
  ID_Cliente: number;
  segmento_atuacao: string;
}

export const ComercialDashboard = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarClientes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesPorSegmento: { name: string; value: number }[] = Object.values(
    clientes.reduce((acc: Record<string, { name: string; value: number }>, c: Cliente) => {
      const key = c.segmento_atuacao ?? "Não informado";
      if (!acc[key]) {
        acc[key] = { name: key, value: 0 };
      }
      acc[key].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#7952B3"];

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Painel Comercial</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Clientes Cadastrados</Card.Title>
              <h3>{clientes.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Clientes por Segmento</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={clientesPorSegmento}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {clientesPorSegmento.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
