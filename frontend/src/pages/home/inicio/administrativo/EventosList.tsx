import { useState } from "react";
import { formatarDataHora } from "../../../../utils/formatacoes";
import { ModalMensagem } from "../../../../components/modals/ModalMensagem";
import { ModalConfirmacao } from "../../../../components/modals/ModalConfirmacao";
import { ModalEditarEvento } from "../../../../components/modals/ModalEditarEvento";
import { ModalConsultarEvento } from "../../../../components/modals/ModalConsultarEvento";
import type { Evento } from "../../../../utils/tipos";
import api from "../../../../services/api";

interface EventosListProps {
  eventos: Evento[];
  loading: boolean;
  refetch: () => void;
}

export const EventosList = ({
  eventos,
  loading,
  refetch,
}: EventosListProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [tituloMessage, setTituloMessage] = useState<
    "Sucesso" | "Erro" | "Aviso"
  >("Aviso");
  const [mensagem, setMensagem] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showConsultar, setShowConsultar] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(
    null
  );

  if (loading) return <p>Carregando...</p>;
  if (eventos.length === 0)
    return <p className="text-center mt-3">Nenhum evento cadastrado.</p>;

  const excluirEvento = async () => {
    if (!eventoSelecionado) return;

    try {
      await api.delete(
        `/eventos/${eventoSelecionado.ID_Evento}`
      );
      setTituloMessage("Sucesso");
      setMensagem("Evento excluído com sucesso!");
      setShowMessage(true);
      refetch();
    } catch (error) {
      console.error("Erro ao excluir evento:", error);
      setTituloMessage("Erro");
      setMensagem("Erro ao excluir evento.");
      setShowMessage(true);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <table className="table table-hover align-middle overflow-hidden px-5">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Data e Hora</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.ID_Evento}>
              <td style={{ paddingLeft: ".7rem"}}>{evento.ID_Evento}</td>
              <td>{evento.Nome_Evento}</td>
              <td>{formatarDataHora(evento.Data_Evento)}</td>
              <td>
                <div className={`d-flex`}>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => {
                      setEventoSelecionado(evento);
                      setShowEdit(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => {
                      setEventoSelecionado(evento);
                      setShowConsultar(true);
                    }}
                  >
                    Consultar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setEventoSelecionado(evento);
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

      <ModalEditarEvento
        show={showEdit}
        evento={eventoSelecionado}
        onClose={() => setShowEdit(false)}
        onSuccess={() => {
          refetch();
          setTituloMessage("Sucesso");
          setMensagem("Evento editado com sucesso!");
          setShowMessage(true);
        }}
      />

      <ModalConsultarEvento
        show={showConsultar}
        evento={eventoSelecionado}
        onClose={() => setShowConsultar(false)}
      />

      <ModalConfirmacao
        show={showConfirm}
        mensagem="Tem certeza que deseja excluir este evento?"
        onConfirm={excluirEvento}
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