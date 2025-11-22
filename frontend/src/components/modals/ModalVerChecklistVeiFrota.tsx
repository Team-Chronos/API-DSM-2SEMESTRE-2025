import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatarDataHora } from "../../utils/formatacoes";

interface Props {
  show: boolean;
  onClose: () => void;
  idChecklist: number | null;
}

export function ModalVerChecklistVeiFrota({ show, onClose, idChecklist }: Props) {
  const [checklist, setChecklist] = useState<any>(null);

  async function carregarChecklist() {
    try {
      const resposta = await api.get(`/checklistVeiculoFrota/${idChecklist}`);
      setChecklist(resposta.data);
    } catch (err) {
      console.error("Erro ao carregar checklist:", err);
    }
  }

  useEffect(() => {
    if (idChecklist && show) {
      carregarChecklist();
    }
  }, [idChecklist, show]);

  if (!checklist) return null;

  const renderCampo = (label: string, valor: string | number | null) => (
    <div className="my-2 fs-5">
      <strong className="me-2">{label}:</strong> {valor ?? "—"}
    </div>
  );

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Checklist Frota #{checklist.id_cvf}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h3>Dados Enviados</h3>
        {renderCampo("Motorista", checklist.nome_motorista_vinculado)}
        {renderCampo("ID Motorista", checklist.id_motorista)}
        {renderCampo("Placa", checklist.placa)}
        {renderCampo("KM Inicial", checklist.km_inicial)}
        {renderCampo("KM Final", checklist.km_final)}
        {renderCampo("Destino", checklist.destino)}

        <hr />

        <h3>Checklist Realizado</h3>
        {renderCampo("Abasteceu?", checklist.abastecimento)}
        {renderCampo("Comprovante enviado?", checklist.comprovante_enviado)}
        {renderCampo("Óleo do motor ok?", checklist.oleo_motor)}
        {renderCampo("Reservatório de água ok?", checklist.reservatorio_agua)}
        {renderCampo("Sistema elétrico ok?", checklist.sistema_eletrico)}
        {renderCampo("Estado dos pneus", checklist.estado_pneus)}
        {renderCampo("Limpeza baú/sider/cabine", checklist.limpeza_bau_sider_cabine)}
        {renderCampo("Lubrificação das suspensões", checklist.lubrificacao_suspensoes)}
        {renderCampo("Macaco presente", checklist.macaco)}
        {renderCampo("Chave de roda presente", checklist.chave_roda)}
        {renderCampo("Documentação vigente ok?", checklist.documento_vigente)}

        <hr />

        <h3>Encerramento da Atividade</h3>
        {renderCampo(
          "Data de encerramento",
          formatarDataHora(checklist.data_encerramento_atividade)
        )}

        <hr />

        <h3>Observações</h3>
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
