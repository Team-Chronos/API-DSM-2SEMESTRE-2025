import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatarTelefone } from "../../../../utils/formatacoes";
import axios from "axios";
import { ModalMensagem } from "../../../../components/modals/ModalMensagem";
import { ModalConfirmacao } from "../../../../components/modals/ModalConfirmacao";
import { ModalEditarColaborador } from "../../../../components/modals/ModalEditarColaborador";
import type { Colaborador } from "../../../../utils/tipos";

interface ColaboradoresListProps {
  colaboradores: Colaborador[];
  loading: boolean;
  refetch: () => void;
}

export const ColaboradoresList = ({ colaboradores, loading, refetch }: ColaboradoresListProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [tituloMessage, setTituloMessage] = useState<"Sucesso" | "Erro" | "Aviso">("Aviso");
  const [mensagem, setMensagem] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<Colaborador | null>(null);

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

  if (loading) return <p>Carregando...</p>;
  if (colaboradores.length === 0)
    return <p className="text-center mt-3">Nenhum colaborador cadastrado.</p>;

  const excluirColaborador = async () => {
    if (!colaboradorSelecionado) return;
    try {
      await axios.delete(`http://localhost:3000/api/colaboradores/${colaboradorSelecionado.ID_colaborador}`);
      setTituloMessage("Sucesso");
      setMensagem("Colaborador excluído com sucesso!");
      setShowMessage(true);
      refetch();
    } catch (err) {
      setTituloMessage("Erro");
      setMensagem("Erro ao excluir colaborador.");
      setShowMessage(true);
    } finally {
      setShowConfirm(false);
    }
  };

  const getNomeSetor = (id: number) =>
    id === 1 ? "Administrativo" : id === 2 ? "Comercial" : "Operacional";

  const getNomeLocalidade = (char: string) => {
    switch (char) {
      case "P":
        return "Presencial";
      case "R":
        return "Remoto";
      case "O":
        return "Outro";
      default:
        return "Não informado";
    }
  };

  const COLORS = ["#0d6efd", "#08f400ff", "#fffb07ff", "#6c757d"];

  const RADIAN = Math.PI / 180;
  const renderLabelPercentual = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
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
    <>
      <div
        style={{
          maxHeight: "400px",
          overflowY: colaboradores.length > 10 ? "auto" : "visible",
          border: "1px solid #dee2e6",
          borderRadius: "6px",
        }}
      >
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Setor</th>
              <th>Modalidade</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((colab) => (
              <tr key={colab.ID_colaborador}>
                <td>{colab.ID_colaborador}</td>
                <td>{colab.Nome_Col}</td>
                <td>{colab.Email}</td>
                <td>{getNomeSetor(colab.Setor)}</td>
                <td>{getNomeLocalidade(colab.Localidade)}</td>
                <td>{formatarTelefone(colab.Telefone)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => {
                      setColaboradorSelecionado(colab);
                      setShowEdit(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setColaboradorSelecionado(colab);
                      setShowConfirm(true);
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalEditarColaborador
        show={showEdit}
        colaborador={colaboradorSelecionado}
        onClose={() => setShowEdit(false)}
        onSuccess={() => {
          refetch();
          setTituloMessage("Sucesso");
          setMensagem("Colaborador editado com sucesso!");
          setShowMessage(true);
        }}
      />

      <ModalConfirmacao
        show={showConfirm}
        mensagem="Tem certeza que deseja excluir este colaborador?"
        onConfirm={excluirColaborador}
        onClose={() => setShowConfirm(false)}
      />

      <ModalMensagem
        show={showMessage}
        titulo={tituloMessage}
        mensagem={mensagem}
        onClose={() => setShowMessage(false)}
      />

      <div 
        className="card shadow-sm mt-4 mb-4" 
        style={{ 
          maxWidth: "500px", 
          backgroundColor: "#e7f0ff"
        }}
      >
        <div className="card-body p-3">
          <h5 className="mb-3 card-title">Distribuição por Modalidade</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabelPercentual} 
                outerRadius={90}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value, name]} /> 
              <Legend 
                formatter={(value) => (
                  <span style={{ color: '#000000' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};