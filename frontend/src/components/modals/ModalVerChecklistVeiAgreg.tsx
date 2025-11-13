import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatarCpf, formatarDataHora } from "../../utils/formatacoes";

interface Props {
  show: boolean;
  onClose: () => void;
  idChecklist: number | null;
}

export function ModalVerChecklistVeiAgreg({ show, onClose, idChecklist }: Props) {
  const [checklist, setChecklist] = useState<any>(null);

  async function carregarChecklist() {
    try{
      const resposta = await api.get(`/checklistVeiculoAgregado/${idChecklist}`)
      setChecklist(resposta.data)
    } catch (err) {
      console.error("Erro ao carregar checklist:", err)
    }
  }

  useEffect(() => {
    if (idChecklist && show) {
      carregarChecklist()
    }
  }, [idChecklist, show]);

  if (!checklist) return null;

  const renderCampo = (label: string, valor: string | null) => (
    <div className="my-3 fs-5">
      <strong className={`me-3`}>{label}: </strong> {valor || "—"}
    </div>
  );

  const renderImagem = (label: string, url?: string) => (
    <div className="mt-4 mb-5 fs-5">
      <strong>{label}:</strong>
      {url ? (
        <img src={url} alt={label} className="d-block my-4" style={{ maxWidth: "300px", borderRadius: "8px" }} />
      ) : (
        <p>Sem imagem</p>
      )}
    </div>
  );

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Checklist #{checklist.ID_cva}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h3>Dados do Veículo</h3>
        {renderCampo("Motorista", checklist.nome_motorista)}
        {renderCampo("CPF", formatarCpf(checklist.cpf))}
        {renderCampo("Placa", checklist.placa_veiculo)}
        {renderCampo("Tipo do Veículo", checklist.tipo_veiculo)}

        <hr />
        <h3>Motor e Óleo</h3>
        {renderCampo("Nível de óleo", checklist.nivel_oleo)}
        {renderCampo("Vazamento de óleo", checklist.vazamento_oleo)}
        {renderCampo("Nível de água", checklist.nivel_agua)}
        {renderImagem("Foto do Motor", checklist.foto_motor)}
        {renderImagem("Etiqueta da Troca de Óleo", checklist.foto_etiqueta_troca_oleo)}

        <hr />
        <h3>Pneus</h3>
        {renderCampo("Pneu Dianteiro Esquerdo Liso", checklist.pne_liso)}
        {renderCampo("Pneu Traseiro Esquerdo Liso", checklist.pte_liso)}
        {renderCampo("Pneu Traseiro Direito Liso", checklist.ptd_liso)}
        {renderCampo("Pneu Dianteiro Direito Liso", checklist.pdd_liso)}
        {renderImagem("Pneu Dianteiro Esquerdo", checklist.pne_foto)}
        {renderImagem("Pneu Traseiro Esquerdo", checklist.pte_foto)}
        {renderImagem("Pneu Traseiro Direito", checklist.ptd_foto)}
        {renderImagem("Pneu Dianteiro Direito", checklist.pdd_foto)}

        <hr />
        <h3>Fotos Gerais</h3>
        {renderImagem("Frente", checklist.foto_frente)}
        {renderImagem("Lateral Direita", checklist.foto_lateral_direita)}
        {renderImagem("Lateral Esquerda", checklist.foto_lateral_esquerda)}
        {renderImagem("Traseira", checklist.foto_traseira)}

        <hr />
        <h3>Responsável pela Vistoria</h3>
        {renderCampo(
          "Responsável",
          checklist.Nome_Col || checklist.nome_responsavel_vistoria || "Não informado"
        )}

        {renderCampo("Observações", checklist.observacoes)}
        {renderCampo("Criado em", formatarDataHora(checklist.criado_em))}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
