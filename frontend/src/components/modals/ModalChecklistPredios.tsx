import { Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

interface Props {
  show: boolean;
  onClose: () => void;
  onSucces: () => void;
  onErro: () => void;
  setMensagem: (x: string) => void;
}

export function ModalChecklistPredios({
  show,
  onClose,
  onSucces,
  onErro,
  setMensagem,
}: Props) {
  const [formData, setFormData] = useState<any>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await axios.post("http://localhost:3000/api/checklistPredios", data);
      setMensagem(response.data.mensagem || "Checklist de fechamento enviado com sucesso!");
      onSucces();
      onClose();
    } catch (error) {
      console.error("Erro ao enviar checklist:", error);
      setMensagem("Erro ao enviar checklist");
      onErro();
      onClose();
    }
  }

  function renderRadios(name: string, label: string) {
    return (
      <div key={name} className="d-flex justify-content-between align-items-center border-bottom py-2">
        <span>{label}</span>
        <div className="d-flex gap-3">
          {["Sim", "Não"].map((opt) => (
            <Form.Check
              key={opt}
              inline
              type="radio"
              name={name}
              id={`${name}-${opt}`}
              label={opt}
              value={opt}
              onChange={handleChange}
              checked={formData[name] === opt}
              required
            />
          ))}
        </div>
      </div>
    );
  }

  function obrigatorio() {
    return <span className="text-danger">*</span>;
  }

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Checklist de Fechamento - NEWE</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-danger">* Indica uma pergunta obrigatória</p>

          <section className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Quem está preenchendo? {obrigatorio()}</Form.Label>
              <Form.Control
                type="text"
                name="nome_responsavel"
                placeholder="Seu nome..."
                onChange={handleChange}
                required
              />
            </Form.Group>
          </section>

          <hr />

          <section>
            <h5>Verificações gerais</h5>
            {renderRadios("lixo_cozinha", "Tirou o lixo orgânico da cozinha e trocou o cestinho com saco limpo para orgânico?")}
            {renderRadios("lixo_reciclavel", "Se for sexta-feira, colocou o lixo reciclável no cesto de lixo fora da empresa?")}
            {renderRadios("cozinha_organizada", "Deixou a cozinha organizada?")}
            {renderRadios("luzes_cozinha", "Apagou as luzes e fechou a porta da cozinha?")}
            {renderRadios("cadeado_portao2", "Trancou cadeado do portão 2?")}
            {renderRadios("cadeado_portao1", "Trancou cadeado do portão 1?")}
            {renderRadios("torneiras_fechadas", "Verificou se torneiras estão fechadas e válvula do mictório não está pressionada?")}
            {renderRadios("lixo_banheiro", "Tirou o lixo do banheiro e colocou no cesto fora da empresa?")}
            {renderRadios("porta_banheiro", "Trancou a porta do banheiro?")}
            {renderRadios("bebedouro_desligado", "Desligou da tomada e colocou o plástico do bebedouro?")}
            {renderRadios("chaves_chaveiro", "Deixou as chaves internas no chaveiro do operacional?")}
            {renderRadios("tv_cameras", "Desligou a TV das câmeras?")}
            {renderRadios("tv_dashboard", "Desligou a TV do dashboard?")}
            {renderRadios("ar_condicionado", "Desligou o ar-condicionado?")}
            {renderRadios("luzes_operacional", "Desligou as luzes do escritório operacional?")}
            {renderRadios("luzes_armazem", "Acendeu as luzes do armazém?")}
            {renderRadios("cone_pcd", "Retirou o cone do estacionamento PCD?")}
            {renderRadios("alarme", "Acionou o alarme?")}
            {renderRadios("porta_armazem", "Fechou a porta de entrada do armazém?")}
            {renderRadios("cadeado_correntes", "Trancou o cadeado das correntes?")}
          </section>

          <hr />

          <section>
            <Form.Group className="mb-3">
              <Form.Label>
                Algum dos motores dos portões apresenta ruídos ou travamentos? (Se sim, descreva)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="problemas_portao"
                placeholder="Descreva caso tenha ruído ou travamento..."
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Houve alguma situação atípica que exigiu atenção ou ação fora do previsto? (Descreva brevemente)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="situacao_atipica"
                placeholder="Descreva aqui..."
                onChange={handleChange}
              />
            </Form.Group>
          </section>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Enviar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
