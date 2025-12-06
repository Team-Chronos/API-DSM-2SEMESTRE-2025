import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import "../../../../css/ComercialDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Cliente {
  ID_Cliente: number;
  Segmento: string;
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
    clientes.reduce(
      (
        acc: Record<string, { name: string; value: number }>,
        c: Cliente
      ) => {
        const key = c.Segmento ?? "Não informado";
        if (!acc[key]) {
          acc[key] = { name: key, value: 0 };
        }
        acc[key].value += 1;
        return acc;
      },
      {}
    )
  );

  const data = (
    clientesPorSegmento.length
      ? clientesPorSegmento
      : [
        
      ]
  ).sort((a, b) => a.value - b.value);

  const COLORS = ["#A8E8F5", "#6BC9EC", "#3693DA", "#1E5AA8"];

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="dashboard-container-comercial">
      <h2 className="dashboard-title-comercial">Painel Comercial</h2>

      <Row>
        <Col md={15}>
          <Card className="dashboard-card-comercial">
            <Card.Body>
              <Card.Title className="dashboard-card-title-comercial">
                Clientes por Segmento
              </Card.Title>
              <ResponsiveContainer width="100%" height={550}>
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
                  barCategoryGap="30%"
                  barGap={1}

                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Legend
                    verticalAlign="top"
                    align="center"
                    iconType="circle"
                    iconSize={12}
                    content={() => (
                      <div className="dashboard-legend-comercial">
                        {data.map((entry, index) => (
                          <div key={`legend-${index}`} className="legend-item-comercial">
                            <div
                              className="legend-color-comercial"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="legend-text-comercial">{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />

                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {data.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};