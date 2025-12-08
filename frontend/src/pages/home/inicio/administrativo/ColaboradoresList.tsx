import { useState } from "react";
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

  return (
    <>
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
                <td style={{ paddingLeft: ".7rem"}}>{colab.ID_colaborador}</td>
                <td>{colab.Nome_Col}</td>
                <td>{colab.Email}</td>
                <td>{getNomeSetor(colab.Setor)}</td>
                <td>{getNomeLocalidade(colab.Localidade)}</td>
                <td className={`text-nowrap`}>{formatarTelefone(colab.Telefone)}</td>
                <td>
                  <div className={`d-flex`}>
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
                  </div>
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
    </>
  );
};