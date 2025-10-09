import { Header } from "./administrativo/Header";
import "../../../css/adm.css";
import { useEffect, useState } from "react";
import { ColaboradoresList } from "./administrativo/ColaboradoresList";
import { EventosList } from "./administrativo/EventosList";
import axios from "axios";

export const Administrativo = () => {
  const [activeTab, setActiveTab] = useState<"colaboradores" | "eventos">("colaboradores");

  const [colaboradores, setColaboradores] = useState([]);
  const [eventos, setEventos] = useState([]);

  const [loadingColaboradores, setLoadingColaboradores] = useState(true);
  const [loadingEventos, setLoadingEventos] = useState(true);

  const carregarColaboradores = async () => {
    setLoadingColaboradores(true);
    try {
      const response = await axios.get("http://localhost:3000/api/colaboradores");
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
      const response = await axios.get("http://localhost:3000/api/eventos");
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
        onSuccess={activeTab === "colaboradores" ? carregarColaboradores : carregarEventos}
      />

      <div id="lista-colaboradores-eventos">
        {activeTab === "colaboradores" ? (
          <ColaboradoresList
            colaboradores={colaboradores}
            loading={loadingColaboradores}
            refetch={carregarColaboradores}
          />
        ) : (
          <EventosList
            eventos={eventos}
            loading={loadingEventos}
            refetch={carregarEventos}
          />
        )}
      </div>
    </div>
  );
};
