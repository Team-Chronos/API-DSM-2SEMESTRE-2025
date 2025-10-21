import { useEffect, useState } from "react";
import axios from "axios";
import {DragDropContext,Droppable,Draggable,type DropResult,} from "@hello-pangea/dnd";
import "../../css/ModalEtapas.css";
import type { Cliente } from "../../utils/tipos"; 

interface ClientesPorEtapa {
  inicial: Cliente[];
  andamento: Cliente[];
  finalizada: Cliente[];
}

export const ModalEtapas = () => {
  const [clientes, setClientes] = useState<ClientesPorEtapa>({
    inicial: [],
    andamento: [],
    finalizada: [],
  });

  const carregarClientes = async () => {
    try {
      const res = await axios.get<Cliente[]>(
        "http://localhost:3000/api/clientes" 
      );

      const etapas: ClientesPorEtapa = {
        inicial: res.data.filter((c) => c.Etapa === "Inicial"),
        andamento: res.data.filter((c) => c.Etapa === "Em andamento"),
        finalizada: res.data.filter((c) => c.Etapa === "Finalizada"),
      };

      setClientes(etapas);
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
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const origemKey = source.droppableId as keyof ClientesPorEtapa;
    const destinoKey = destination.droppableId as keyof ClientesPorEtapa;

    const origem = Array.from(clientes[origemKey]);
    const [movido] = origem.splice(source.index, 1);
    const destinoLista = Array.from(clientes[destinoKey]);
    destinoLista.splice(destination.index, 0, movido);

    setClientes({
      ...clientes,
      [origemKey]: origem,
      [destinoKey]: destinoLista,
    });

    const novaEtapa =
      destinoKey === "inicial"
        ? "Inicial"
        : destinoKey === "andamento"
        ? "Em andamento"
        : "Finalizada";

    try {
      await axios.put(
        `http://localhost:3000/api/clientes/${movido.ID_Cliente}/etapa`, 
        { etapa: novaEtapa }
      );
    } catch (err) {
      console.error("Erro ao atualizar etapa:", err);
    }
  };

  return (
    <div className="etapas-container">
      <DragDropContext onDragEnd={onDragEnd}>
        {[
          { key: "inicial", label: "Inicial" },
          { key: "andamento", label: "Em andamento" },
          { key: "finalizada", label: "Finalizada" },
        ].map(({ key, label }) => (
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

                {clientes[key as keyof ClientesPorEtapa].map(
                  (cliente, index) => (
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
                  )
                )}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};
