import React, { useEffect, useState } from "react";
import { NotificacaoItem } from "./NotificacaoItem";
import type { Notificacao } from "../../../utils/tipos";
import { ModalMensagem } from "../../../components/modals/ModalMensagem";
import { ModalParticipacao } from "../../../components/modals/ModalParticipacao";
import api from "../../../services/api";


interface Props {
  idColab: number;
}

export const ListaNotificacoes: React.FC<Props> = ({ idColab }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [busca, setBusca] = useState("");
  const [eventoFocado, setEventoFocado] = useState<number | null>(null);
  const [showModalForm, setShowModalForm] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState<Notificacao | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [tituloMessage, setTituloMessage] = useState<"Sucesso" | "Erro" | "Aviso">("Aviso");
  const [mensagem, setMensagem] = useState("");

  const carregarNotificacoes = async () => {
    try {
      const res = await api.get(
        `/participacaoEventos/${idColab}`
      );
      setNotificacoes(res.data);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  };

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  useEffect(() => {
    if (eventoFocado !== null) {
      const el = document.getElementById(`evento-${eventoFocado}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setEventoFocado(null);
    }
  }, [eventoFocado]);

  const atualizarStatus = async (
    idEvento: number,
    status: number,
    justificativa?: string
  ) => {
    try {
      await api.put(
        `/participacaoEventos/${idColab}/${idEvento}`,
        { status, justificativa_notificacao: justificativa || null }
      );
      await carregarNotificacoes();
      setEventoFocado(idEvento);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const handleConcluirCadastro = async (idEvento: number) => {
    try {
      await atualizarStatus(idEvento, 4);
      setTituloMessage("Sucesso");
      setMensagem("Evento concluído!");
      setShowMessage(true);
      setShowModalForm(false);
    } catch {
      setTituloMessage("Erro");
      setMensagem("Erro ao concluir evento.");
      setShowMessage(true);
    }
  };

  const notificacoesFiltradas = notificacoes.filter((n) =>
    n.Nome_Evento.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes(
        busca.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      )
  );

  const renderSecao = (titulo: string, filtro: number) => {
    const lista = notificacoesFiltradas.filter((n) => n.ID_Status === filtro);
    if (lista.length === 0) return null;
    return (
      <>
        <h4 className="text-center">{titulo}</h4>
        <div className="notificacoes-container">
          {lista.map((n) => (
            <div id={`evento-${n.ID_Evento}`} key={n.ID_Evento}>
              <NotificacaoItem
                data={n}
                onAceitar={() => atualizarStatus(n.ID_Evento, 2)}
                onRecusar={(j) => atualizarStatus(n.ID_Evento, 3, j)}
                onConcluir={() => {
                  setEventoSelecionado(n);
                  setShowModalForm(true);
                }}
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="notificacoes-wrapper">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <i className="bi bi-search"></i>
      </div>

      {renderSecao("Pendentes", 1)}
      {renderSecao("Confirmadas", 2)}
      {renderSecao("Recusadas", 3)}
      {renderSecao("Concluídas", 4)}

      <ModalParticipacao
        show={showModalForm}
        evento={eventoSelecionado}
        onClose={() => setShowModalForm(false)}
        onSuccess={(idEvento: number) => handleConcluirCadastro(idEvento)}
      />

      <ModalMensagem
        show={showMessage}
        titulo={tituloMessage}
        mensagem={mensagem}
        onClose={() => setShowMessage(false)}
      />
    </div>
  );
};