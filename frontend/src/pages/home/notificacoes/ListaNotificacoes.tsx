import React, { useEffect, useState } from "react";
import axios from "axios";
import { NotificacaoItem } from "./NotificacaoItem";
import type { Notificacao } from "../../../utils/tipos";

interface Props {
  idColab: number;
}

export const ListaNotificacoes: React.FC<Props> = ({ idColab }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [busca, setBusca] = useState("");
  const [eventoFocado, setEventoFocado] = useState<number | null>(null);

  const carregarNotificacoes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/participacaoEventos/${idColab}`
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
      await axios.put(
        `http://localhost:3000/api/participacaoEventos/${idColab}/${idEvento}`,
        {
          status,
          justificativa_notificacao: justificativa || null,
        }
      );

      await carregarNotificacoes();
      setEventoFocado(idEvento);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
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
    if (lista.length === 0) return
    return (
      <>
        <h4 className="text-center">{titulo}</h4>
        <div className="notificacoes-container">
          {lista.map((n) => (
              <NotificacaoItem
                key={n.ID_Evento}
                data={n}
                onAceitar={() => atualizarStatus(n.ID_Evento, 2)}
                onRecusar={(j) => atualizarStatus(n.ID_Evento, 3, j)}
                onConcluir={() => atualizarStatus(n.ID_Evento, 4)}
              />
            ))
          }
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
    </div>
  );
};
