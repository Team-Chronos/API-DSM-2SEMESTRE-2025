import { useState } from "react";
import type { Tarefa } from "../../pages/home/eventos/Calendar";

interface ModalDetalhesTarefaProps {
  isOpen: boolean;
  onClose: () => void;
  tarefa: Tarefa | null;
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (tarefa: Tarefa) => void;
}

const formatarHora = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const prioridadeMap: { [key: string]: string } = {
  Baixa: "prio-baixa",
  Média: "prio-media",
  Alta: "prio-alta",
  Urgente: "prio-urgente",
};

export const ModalDetalhesTarefa = ({
  isOpen,
  onClose,
  tarefa,
  onEdit,
  onDelete,
}: ModalDetalhesTarefaProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!isOpen || !tarefa) return null;

  const handleClose = () => {
    setIsConfirmingDelete(false);
    onClose();
  };

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleConfirmDelete = () => {
    onDelete(tarefa);
    handleClose();
  };

  const prioridadeClass = prioridadeMap[tarefa.Prioridade || "Média"] || "prio-media";
  const prioridadeText = tarefa.Prioridade || "Média";

  return (
    <div className="modal-detalhes-overlay" onClick={handleClose}>
      <div className="modal-detalhes-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-detalhes-header ${prioridadeClass}`}>
          <span className="modal-detalhes-prioridade">{prioridadeText}</span>
          <button className="modal-detalhes-close" onClick={handleClose}>×</button>
        </div>
        
        <h3>{tarefa.Titulo}</h3>
        
        <div className="modal-detalhes-body">
          <p>
            <strong>Horário:</strong> {formatarHora(tarefa.Data_Hora_Inicio)}
          </p>
          {tarefa.Nome_Cliente && (
            <p>
              <strong>Cliente:</strong> {tarefa.Nome_Cliente}
            </p>
          )}
          {tarefa.Local_Evento && (
            <p>
              <strong>Local:</strong> {tarefa.Local_Evento}
            </p>
          )}
          {tarefa.Descricao && (
            <div className="modal-detalhes-descricao">
              <strong>Descrição:</strong>
              <p>{tarefa.Descricao}</p>
            </div>
          )}
        </div>

        <div className="modal-detalhes-actions">
          {!isConfirmingDelete ? (
            <>
              <button className="btn-excluir" onClick={handleDeleteClick}>
                Excluir
              </button>
              <button className="btn-editar" onClick={() => onEdit(tarefa)}>
                Editar
              </button>
            </>
          ) : (
            <>
              <span className="confirm-delete-text">Tem certeza?</span>
              <button className="btn-cancelar-delete" onClick={handleCancelDelete}>
                Cancelar
              </button>
              <button className="btn-confirmar-delete" onClick={handleConfirmDelete}>
                Sim, Excluir
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};