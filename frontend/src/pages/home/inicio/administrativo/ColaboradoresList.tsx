import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatarTelefone } from "../../../../utils/formatacoes";
import { ModalMensagem } from "../../../../components/modals/ModalMensagem";
import { ModalConfirmacao } from "../../../../components/modals/ModalConfirmacao";
import { ModalEditarColaborador } from "../../../../components/modals/ModalEditarColaborador";
import type { Colaborador } from "../../../../utils/tipos";
import api from "../../../../services/api";

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
      await api.delete(`/colaboradores/${colaboradorSelecionado.ID_colaborador}`);
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

  const cores = [
  "#1E5F8C", 
  "#4A90E2",  
  "#0D4674", 
  "#89C4F4"  
];

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
    <>
      <div className="row mt-4 mb-4">
        <div className="col-md-3">
          <div
            className="card shadow-sm"
            style={{
              backgroundColor: "#e7f0ff",
              height: "100%"
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
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                  >
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend
                    layout="vertical"
                    align="center"
                    verticalAlign="bottom"
                    wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                    formatter={(value) => (
                      <span style={{ color: '#000000' }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div
            style={{
              maxHeight: "400px",
              overflowY: colaboradores.length > 10 ? "auto" : "visible",
              border: "1px solid #dee2e6",
              borderRadius: "6px",
              height: "100%"
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
        </div>


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
    </>
  );
};