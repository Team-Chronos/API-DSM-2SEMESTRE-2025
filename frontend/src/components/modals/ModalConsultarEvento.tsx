import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, ListGroup, Spinner, Badge } from "react-bootstrap";
import { formatarDataHora } from "../../utils/formatacoes";
import type { Evento } from "../../utils/tipos";

// Você precisará criar uma rota no seu backend que retorne algo assim
// A partir da tabela Participacao_Evento, Colaboradores e Status_Participacao
interface Participante {
  ID_Colaborador: number;
  Nome_Col: string;
  Nome_Status: string; // Ex: "Confirmado", "Pendente"
}

interface ModalConsultarEventoProps {
  show: boolean;
  evento: Evento | null;
  onClose: () => void;
}

export const ModalConsultarEvento = ({
  show,
  evento,
  onClose,
}: ModalConsultarEventoProps) => {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Busca os participantes apenas se o modal estiver visível e um evento selecionado
    if (show && evento) {
      const fetchParticipantes = async () => {
        setLoading(true);
        try {
          // --- ATENÇÃO ---
          // Você precisa criar esta rota no seu backend (ex: no Node.js/Express)
          // Ela deve retornar a lista de participantes do evento
          const res = await axios.get(
            `http://localhost:3000/api/eventos/${evento.ID_Evento}/participantes`
          );
          setParticipantes(res.data);
        } catch (error) {
          console.error("Erro ao buscar participantes:", error);
          setParticipantes([]); // Limpa em caso de erro
        } finally {
          setLoading(false);
        }
      };

      fetchParticipantes();
    }
  }, [show, evento]); // Executa toda vez que 'show' or 'evento' mudar

  if (!evento) return null;

  // Função auxiliar para converter o ID do tipo em texto
  const getTipoEventoNome = (id: number | undefined) => {
    switch (id) {
      case 1:
        return "Feira";
      case 2:
        return "Workshop";
      case 3:
        return "Reunião";
      default:
        return "Não especificado";
    }
  };

  // Função para dar cor ao status do participante
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmado":
        return "success";
      case "recusado":
        return "danger";
      case "concluído":
        return "primary";
      case "pendente":
      default:
        return "secondary";
    }
  };

  return (
    <Modal show={show} centered onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Consultar Evento</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Seção de Detalhes do Evento */}
        <h4 className="mb-3">{evento.Nome_Evento}</h4>
        <div className="row">
          <div className="col-md-6">
            <p>
              <strong>Data:</strong> {formatarDataHora(evento.Data_Evento)}
            </p>
            <p>
              <strong>Duração:</strong>{" "}
              {evento.Duracao_Evento
                ? `${evento.Duracao_Evento} horas`
                : "Não informado"}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Local:</strong> {evento.Local_Evento || "Não informado"}
            </p>
            <p>
              <strong>Tipo:</strong> {getTipoEventoNome(evento.ID_Tipo_Evento)}
            </p>
          </div>
        </div>
        <p>
          <strong>Descrição:</strong>
        </p>
        <p style={{ whiteSpace: "pre-wrap" }}>
          {evento.Descricao || "Nenhuma descrição."}
        </p>

        <hr />

        {/* Seção de Participantes */}
        <h5>Participantes</h5>
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" /> Carregando participantes...
          </div>
        ) : (
          <ListGroup variant="flush">
            {participantes.length > 0 ? (
              participantes.map((p) => (
                <ListGroup.Item
                  key={p.ID_Colaborador}
                  className="d-flex justify-content-between align-items-center"
                >
                  {p.Nome_Col}
                  <Badge pill bg={getStatusVariant(p.Nome_Status)}>
                    {p.Nome_Status}
                  </Badge>
                </ListGroup.Item>
              ))
            ) : (
              <p className="text-muted">Nenhum participante encontrado.</p>
            )}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
