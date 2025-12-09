import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Colaborador } from "../../../../utils/tipos";

interface Props {
  colaboradores: Colaborador[];
}

export function GraficoModalidade({ colaboradores }: Props) {
  const data = useMemo(() => {
    const contagem = { P: 0, R: 0, O: 0, N: 0 };

    colaboradores.forEach((colab) => {
      switch (colab.Localidade) {
        case "P":
          contagem.P++;
          break;
        case "R":
          contagem.R++;
          break;
        case "O":
          contagem.O++;
          break;
        default:
          contagem.N++;
          break;
      }
    });

    return [
      { name: "Presencial", value: contagem.P },
      { name: "Remoto", value: contagem.R },
      { name: "Outro", value: contagem.O },
      { name: "Não informado", value: contagem.N },
    ];
  }, [colaboradores]);

  const cores = ["#1E5F8C", "#4A90E2", "#0D4674", "#89C4F4"];

  const RADIAN = Math.PI / 180;
  const renderLabelPercentual = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent === 0) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        fontSize="14px"
        fontWeight="bold"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div
      className="card shadow-sm"
      style={{ backgroundColor: "#e7f0ff", height: "100%" }}
    >
      <div className="card-body p-3 d-flex flex-column">
        <h5 className="mb-3 card-title">Distribuição por Modalidade</h5>
        <div className={`my-auto`}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabelPercentual}
                outerRadius={80}
                innerRadius={40}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={cores[index % cores.length]} />
                ))}
              </Pie>

              <Tooltip formatter={(value, name) => [value, name]} />

              <Legend
                layout="vertical"
                align="center"
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                formatter={(value) => <span style={{ color: "#000" }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
