import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatarDataHora } from "../../utils/formatacoes";

interface Props {
  show: boolean;
  onClose: () => void;
  idChecklist: number | null;
}

export function ModalVerChecklistPredial({ show, onClose, idChecklist }: Props) {
  const [checklist, setChecklist] = useState<any>(null);

  async function carregarChecklist() {
    try {
      const resposta = await api.get(`/checklistPredios/${idChecklist}`);
      setChecklist(resposta.data);
    } catch (err) {
      console.error("Erro ao carregar checklist predial:", err);
    }
  }

  useEffect(() => {
    if (idChecklist && show) {
      carregarChecklist();
    }
  }, [idChecklist, show]);

  if (!checklist) return null;

  const renderCampo = (label: string, valor: string | null) => (
    <div className="my-3 fs-5">
      <strong className="me-3">{label}:</strong> {valor || "—"}
    </div>
  );

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Checklist Predial #{checklist.CheckPredio}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h3>Informações Gerais</h3>
        {renderCampo("Responsável pelo fechamento", checklist.NomeFuncPredio)}
        {renderCampo("Data do fechamento", formatarDataHora(checklist.DataPredio))}

        <hr />
        <h3>Verificações gerais</h3>
        {renderCampo("Lixo da cozinha", checklist.LixoCozinha)}
        {renderCampo("Lixo reciclável", checklist.LixoReciclavel)}
        {renderCampo("Cozinha organizada", checklist.CozinhaOrganizada)}
        {renderCampo("Luzes da cozinha apagadas", checklist.LuzesCozinha)}
        {renderCampo("Cadeado portão 2", checklist.CadeadoPortao2)}
        {renderCampo("Cadeado portão 1", checklist.CadeadoPortao1)}
        {renderCampo("Torneiras fechadas", checklist.TorneirasFechadas)}
        {renderCampo("Lixo do banheiro retirado", checklist.LixoBanheiro)}
        {renderCampo("Porta do banheiro trancada", checklist.PortaBanheiro)}
        {renderCampo("Bebedouro desligado", checklist.BebedouroDesligado)}
        {renderCampo("Chaves no chaveiro", checklist.ChavesChaveiro)}
        {renderCampo("TV das câmeras desligada", checklist.TVCameras)}
        {renderCampo("TV do dashboard desligada", checklist.TVDashboard)}
        {renderCampo("Ar-condicionado desligado", checklist.ArCondicionado)}
        {renderCampo("Luzes do operacional apagadas", checklist.LuzesOperacional)}
        {renderCampo("Luzes do armazém apagadas", checklist.LuzesArmazem)}
        {renderCampo("Cone PCD retirado", checklist.ConePCD)}
        {renderCampo("Alarme ativado", checklist.Alarme)}
        {renderCampo("Porta do armazém fechada", checklist.PortaArmazem)}
        {renderCampo("Cadeado das correntes trancado", checklist.CadeadoCorrentes)}

        <hr />
        <h3>Observações</h3>
        {renderCampo("Motor dos portões - ruídos/travamentos", checklist.MotorRuidos)}
        {renderCampo("Situação atípica", checklist.SituacaoAtip)}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
