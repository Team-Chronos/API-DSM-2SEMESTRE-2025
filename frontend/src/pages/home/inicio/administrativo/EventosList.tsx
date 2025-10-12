import { useEffect, useState } from "react";
import { formatarDataHora } from "../../../../utils/formatacoes";

interface Evento {
  ID_Evento: number;
  Nome_Evento: string;
  Data_Evento: string;
  Duracao_Evento: number;
  Local_Evento: string;
  Descricao: string;
  data_registro: string;
}

export const EventosList = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarEventos = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/eventos");
        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarEventos();
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (eventos.length === 0)
    return <p className="text-center mt-3">Nenhum evento cadastrado.</p>;

  return (
    <table className="table table-hover align-middle">
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
            <td>{evento.ID_Evento}</td>
            <td>{evento.Nome_Evento}</td>
            <td>{formatarDataHora(evento.Data_Evento)}</td>
            <td>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => console.log("editar", evento.ID_Evento)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => console.log("excluir", evento.ID_Evento)}
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};