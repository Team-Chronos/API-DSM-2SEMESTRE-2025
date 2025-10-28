import { useEffect, useState } from "react";
import axios from "axios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import "../../css/ModalEtapas.css";
import type { Cliente } from "../../utils/tipos";

const etapasConfig = [
  { key: "prospects", label: "Prospects" },
  { key: "inicial", label: "Inicial" },
  { key: "potencial", label: "Potencial" },
  { key: "manutenção", label: "Em Manutenção" },
  { key: "negociação", label: "Em Negociação" },
  { key: "followup", label: "Follow Up" },

];

type EtapaKey = (typeof etapasConfig)[number]["key"];

type ClientesPorEtapa = Record<EtapaKey, Cliente[]>;

export const ModalEtapas = () => {
  const [clientes, setClientes] = useState<ClientesPorEtapa>(
    etapasConfig.reduce((acc, etapa) => {
      acc[etapa.key] = [];
      return acc;
    }, {} as ClientesPorEtapa)
  );

  const carregarClientes = async () => {
    try {
      const res = await axios.get<Cliente[]>(
        "http://localhost:3000/api/clientes"
      );

      const novoEstado = etapasConfig.reduce((acc, etapa) => {
        acc[etapa.key] = res.data.filter(
          (c) =>
            c.Etapa?.toLowerCase() === etapa.label.toLowerCase() ||
            c.Etapa?.toLowerCase() === etapa.key.toLowerCase()
        );
        return acc;
      }, {} as ClientesPorEtapa);

      setClientes(novoEstado);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      alert("Erro ao carregar clientes");
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const origemKey = source.droppableId as EtapaKey;
    const destinoKey = destination.droppableId as EtapaKey;

    if (origemKey === destinoKey && source.index === destination.index) return;

    const origem = Array.from(clientes[origemKey]);
    const [movido] = origem.splice(source.index, 1);
    const destino = Array.from(clientes[destinoKey]);
    destino.splice(destination.index, 0, movido);

    setClientes({
      ...clientes,
      [origemKey]: origem,
      [destinoKey]: destino,
    });

    try {
      await axios.put(
        `http://localhost:3000/api/clientes/${movido.ID_Cliente}/etapa`,
        { etapa: etapasConfig.find((e) => e.key === destinoKey)?.label }
      );
    } catch (err) {
      console.error("Erro ao atualizar etapa:", err);
    }
  };

  return (
    <div className="etapas-container">
      <DragDropContext onDragEnd={onDragEnd}>
        {etapasConfig.map(({ key, label }) => (
          <Droppable key={key} droppableId={key}>
            {(provided) => (
              <div
                className="coluna"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="coluna-header">
                  <h3>{label}</h3>
                </div>
                <div className="cards-list">
                  {clientes[key].map((cliente, index) => (
                    <Draggable
                      key={cliente.ID_Cliente}
                      draggableId={String(cliente.ID_Cliente)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className="card-cliente"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {cliente.Nome_Cliente}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};