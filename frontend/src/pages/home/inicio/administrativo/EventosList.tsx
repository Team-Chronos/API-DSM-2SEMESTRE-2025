import { useState } from "react";
import { formatarDataHora } from "../../../../utils/formatacoes";
import { ModalMensagem } from "../../../../components/modals/ModalMensagem";
import { ModalConfirmacao } from "../../../../components/modals/ModalConfirmacao";
import { ModalEditarEvento } from "../../../../components/modals/ModalEditarEvento";
import { ModalConsultarEvento } from "../../../../components/modals/ModalConsultarEvento";
import type { Evento } from "../../../../utils/tipos";
import api from "../../../../services/api";
import "../../../../css/eventoList.css";

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
  const [tituloMessage, setTituloMessage] =
    useState<"Sucesso" | "Erro" | "Aviso">("Aviso");
  const [mensagem, setMensagem] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showConsultar, setShowConsultar] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] =
    useState<Evento | null>(null);

  if (loading) return <p className="eventos-loading">Carregando...</p>;
  if (eventos.length === 0)
    return <p className="eventos-empty">Nenhum evento cadastrado.</p>;

  const excluirEvento = async () => {
    if (!eventoSelecionado) return;

    try {
      await api.delete(`/eventos/${eventoSelecionado.ID_Evento}`);
      setTituloMessage("Sucesso");
      setMensagem("Evento excluído com sucesso!");
      setShowMessage(true);
      refetch();
    } catch {
      setTituloMessage("Erro");
      setMensagem("Erro ao excluir evento.");
      setShowMessage(true);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="eventos-container">
        <table className="eventos-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data e Hora</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.ID_Evento}>
                <td data-label="Nome">
                  {evento.Nome_Evento}
                </td>
                <td data-label="Data e Hora">
                  {formatarDataHora(evento.Data_Evento)}
                </td>
                <td data-label="Ações">
                  <div className="eventos-acoes">
                    <button
                      className="eventos-btn eventos-btn-primary"
                      onClick={() => {
                        setEventoSelecionado(evento);
                        setShowEdit(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="eventos-btn eventos-btn-primary"
                      onClick={() => {
                        setEventoSelecionado(evento);
                        setShowConsultar(true);
                      }}
                    >
                      Consultar
                    </button>
                    <button
                      className="eventos-btn eventos-btn-danger"
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
      </div>

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
