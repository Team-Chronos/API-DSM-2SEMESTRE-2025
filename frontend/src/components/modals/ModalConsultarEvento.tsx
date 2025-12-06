import { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Spinner, Badge } from "react-bootstrap";
import { formatarDataHora } from "../../utils/formatacoes";
import type { Evento } from "../../utils/tipos";
import api from "../../services/api";

interface Participante {
  ID_Colaborador: number;
  Nome_Col: string;
  Nome_Status: string;
  justificativa?: string | null;
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
    if (show && evento) {
      const fetchParticipantes = async () => {
        setLoading(true);
        try {
          const res = await api.get(
            `/eventos/${evento.ID_Evento}/participantes`
          );
          setParticipantes(res.data);
        } catch (error) {
          console.error("Erro ao buscar participantes:", error);
          setParticipantes([]);
        } finally {
          setLoading(false);
        }
      };

      fetchParticipantes();
    }
  }, [show, evento]);

  if (!evento) return null;

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
                  className="d-flex flex-column align-items-start"
                >
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span>{p.Nome_Col}</span>
                    <Badge pill bg={getStatusVariant(p.Nome_Status)}>
                      {p.Nome_Status}
                    </Badge>
                  </div>

                  {p.Nome_Status.toLowerCase() === "recusado" &&
                    p.justificativa && (
                      <small className="text-muted fst-italic mt-1">
                        <strong>Motivo:</strong> {p.justificativa}
                      </small>
                    )}
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
