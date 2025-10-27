import { type Certificado } from "../../utils/tipos";

interface ModalDetalhesCertificadoProps {
  show: boolean;
  onClose: () => void;
  certificado: Certificado | null;
}

export const ModalDetalhesCertificado = ({ show, onClose, certificado }: ModalDetalhesCertificadoProps) => {
  if (!show || !certificado) {
    return null;
  }

  const formatarData = (data: string) => new Date(data).toLocaleDateString();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{certificado.Nome_Evento}</h3>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <p>
            <strong>Participante:</strong> {certificado.ID_colaborador}
          </p>
          <p>
            <strong>Duração:</strong> {certificado.Duracao_Evento}, emitido em {formatarData(certificado.Data_Part)}.
          </p>
          <p><strong>Descrição do evento:</strong><br />{certificado.Descricao || 'Sem descrição'}</p>
          <p><strong>Local do evento:</strong><br />{certificado.Local_Evento}</p>
          <p><strong>Conhecimentos adquiridos:</strong><br />{certificado.Data_Part || 'Não informado'}</p>
        </div>
      </div>
      
    </div>
  );
};