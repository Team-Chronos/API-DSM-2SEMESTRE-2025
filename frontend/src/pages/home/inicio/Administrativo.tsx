import { Header } from "./administrativo/Header";
import "../../../css/adm.css";
import { useEffect, useState } from "react";
import { ColaboradoresList } from "./administrativo/ColaboradoresList";
import { EventosList } from "./administrativo/EventosList";
import { HeaderControlsColaboradores } from "./administrativo/HeaderControlsColaboradores";
import { HeaderControlsEventos } from "./administrativo/HeaderControlsEventos";
import { type Colaborador, type Evento, type Tab } from "../../../utils/tipos";
import { normalizarTexto } from "../../../utils/formatacoes";
import { RelatorioList } from "../../../components/RelatorioList";
import api from "../../../services/api";

export const Administrativo = () => {
  const [activeTab, setActiveTab] = useState<Tab>("colaboradores");

  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);

  const [loadingColaboradores, setLoadingColaboradores] = useState(false);
  const [loadingEventos, setLoadingEventos] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filtroSetor, setFiltroSetor] = useState("");
  const [filtroModalidade, setFiltroModalidade] = useState("");
  const colaboradoresFiltrados = colaboradores?.filter((colab) => {
    const matchesSearch =
      normalizarTexto(colab.Nome_Col.toLowerCase()).includes(normalizarTexto(searchText.toLowerCase())) ||
      colab.Email.toLowerCase().includes(searchText.toLowerCase());

    const matchesSetor = filtroSetor ? colab.Setor.toString() === filtroSetor : true;
    
    const matchesModalidade = filtroModalidade
      ? colab.Localidade === filtroModalidade
      : true;

    return matchesSearch && matchesSetor && matchesModalidade;
  });

  const eventosFiltrados = eventos?.filter((evento) => {
    const matchesSearch =
      normalizarTexto(evento.Nome_Evento.toLowerCase()).includes(normalizarTexto(searchText.toLowerCase()))
      return matchesSearch
  })

  const carregarColaboradores = async () => {
    setLoadingColaboradores(true);
    try {
      const response = await api.get("/colaboradores");
      setColaboradores(response.data);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
    } finally {
      setLoadingColaboradores(false);
    }
  };

  const carregarEventos = async () => {
    setLoadingEventos(true);
    try {
      const response = await api.get("/eventos");
      setEventos(response.data);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoadingEventos(false);
    }
  };

  useEffect(() => {
    if (activeTab === "colaboradores") {
      carregarColaboradores();
    } else {
      carregarEventos();
    }
  }, [activeTab]);

  return (
    <div id="adm-module">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {activeTab === "colaboradores" ? (
        <HeaderControlsColaboradores
          onSuccess={carregarColaboradores}
          filtroSetor={filtroSetor}
          setFiltroSetor={setFiltroSetor}
          filtroModalidade={filtroModalidade}
          setFiltroModalidade={setFiltroModalidade}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      ) : activeTab === "eventos" ? (
        <HeaderControlsEventos
          onSuccess={carregarEventos}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      ) : (null)}
      <div id="lista-colaboradores-eventos" className={`table-responsive`}>
        {activeTab === "colaboradores" ? (
          <ColaboradoresList
            colaboradores={colaboradoresFiltrados}
            loading={loadingColaboradores}
            refetch={carregarColaboradores}
          />
        ) : activeTab === "eventos" ? (
          <EventosList
            eventos={eventosFiltrados}
            loading={loadingEventos}
            refetch={carregarEventos}
          />
        ) : (
          <RelatorioList />
        )}
      </div>
    </div>
  );
};