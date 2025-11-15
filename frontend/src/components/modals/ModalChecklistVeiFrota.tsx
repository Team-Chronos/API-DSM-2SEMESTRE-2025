import { Button, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  show: boolean;
  onClose: () => void;
  onSucces: () => void;
  onErro: () => void;
  setMensagem: (x: string) => void;
}

export function ModalChecklistVeiFrota({ show, onClose, onSucces, onErro, setMensagem }: Props) {
  const [formData, setFormData] = useState<any>({});
  const [motoristas, setMotoristas] = useState<any[]>([]);

  useEffect(() => {
    if (!show) return;

    const loadMotoristas = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/checklistVeiculoFrota/motoristas");
        setMotoristas(data);
      } catch (err) {
        console.error("Erro ao carregar motoristas:", err);
      }
    };

    loadMotoristas();
  }, [show]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/checklistVeiculoFrota", formData
      );

      setMensagem(response.data.mensagem);
      onSucces();
      onClose();
    } catch (err) {
      console.error("Erro ao enviar checklist", err);
      setMensagem("Erro ao enviar checklist");
      onErro();
      onClose();
    }
  }

  function obrigatorio() {
    return <span className="text-danger">*</span>;
  }

  function renderRadios(name: string, label: string, options: string[]) {
    return (
      <div className="d-flex justify-content-between align-items-center border-bottom py-2">
        <span className="text-capitalize">{label}</span>
        <div className="d-flex gap-3">
          {options.map((opt) => (
            <Form.Check
              key={opt}
              inline
              type="radio"
              name={name}
              id={`${name}-${opt}`}
              label={opt.toUpperCase()}
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

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Checklist Veículo Frota</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-danger">* Indica campo obrigatório</p>

          <hr />

          <section className="mt-3">
            <h4>Dados</h4>

            <Form.Label>Motorista {obrigatorio()}</Form.Label>

            <div className="d-flex flex-column gap-2 mt-2">
              {motoristas.map((m: any) => (
                <Form.Check
                  key={m.id_motorista}
                  type="radio"
                  name="id_motorista"
                  id={`mot-${m.id_motorista}`}
                  label={m.nome_motorista}
                  value={m.id_motorista}
                  onChange={handleChange}
                  checked={Number(formData.id_motorista) === m.id_motorista}
                  required
                />
              ))}

              <Form.Check
                type="radio"
                name="id_motorista"
                id="mot-outro"
                label="Outro"
                value="outro"
                onChange={handleChange}
                checked={formData.id_motorista === "outro"}
                required
              />
            </div>

            {formData.id_motorista === "outro" && (
              <div className="mt-3">
                <Form.Control
                  type="text"
                  placeholder="Nome do motorista..."
                  name="nome_motorista"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="mt-3">
              <Form.Group>
                <Form.Label>Placa {obrigatorio()}</Form.Label>
                <Form.Control
                  type="text"
                  name="placa"
                  value={formData.placa || ""}
                  title="Padrão 'abc1d23' ou 'ABC1234'"
                  pattern="([A-Za-z]{3}[0-9][A-Za-z][0-9]{2})|([A-Za-z]{3}[0-9]{4})"
                  maxLength={7}
                  placeholder="ABC1234 ou ABC1D23"
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase().trim();
                    handleChange(e);
                  }}
                  required
                />
              </Form.Group>
            </div>

            <div className="mt-3 d-flex gap-3">
              <Form.Group className="w-50">
                <Form.Label>KM Inicial {obrigatorio()}</Form.Label>
                <Form.Control type="number" name="km_inicial" onChange={handleChange} placeholder="Km Inicial..." required />
              </Form.Group>

              <Form.Group className="w-50">
                <Form.Label>KM Final {obrigatorio()}</Form.Label>
                <Form.Control type="number" name="km_final" onChange={handleChange} placeholder="Km final..." required />
              </Form.Group>
            </div>

            <div className="mt-3">
              <Form.Label>Destino {obrigatorio()}</Form.Label>
              <Form.Control type="text" name="destino" onChange={handleChange} placeholder="Destino..." required />
            </div>
          </section>

          <hr />

          <section>
            <h4>Checklist {obrigatorio()}</h4>
            {renderRadios("abastecimento", "Abasteceu?", ["sim", "não"])}
            {renderRadios("comprovante_enviado", "Enviou comprovante?", ["sim", "não"])}
            {renderRadios("oleo_motor", "Óleo do motor ok?", ["sim", "não"])}
            {renderRadios("reservatorio_agua", "Nível de água ok?", ["sim", "não"])}
            {renderRadios("sistema_eletrico", "Sistema elétrico ok?", ["sim", "não"])}
            {renderRadios("estado_pneus", "Estado geral dos pneus ok?", ["sim", "não"])}
            {renderRadios("limpeza_bau_sider_cabine", "Limpeza geral ok?", ["sim", "não"])}
            {renderRadios("lubrificacao_suspensoes", "Lubrificação das suspensões ok?", ["sim", "não"])}
            {renderRadios("macaco", "Macaco presente?", ["sim", "não"])}
            {renderRadios("chave_roda", "Chave de roda presente?", ["sim", "não"])}
            {renderRadios("documento_vigente", "Documentação vigente ok?", ["sim", "não"])}
          </section>

          <hr />

          <section>
            <h4>Encerramento da Atividade</h4>
            <Form.Group>
              <Form.Label>Data da finalização {obrigatorio()}</Form.Label>
              <Form.Control
                type="datetime-local"
                name="data_encerramento_atividade"
                onChange={handleChange}
                required
              />
            </Form.Group>
          </section>

          <hr />

          <Form.Group>
            <Form.Label>Observações</Form.Label>
            <Form.Control as="textarea" rows={3} name="observacoes" placeholder="Observações..." onChange={handleChange} />
          </Form.Group>
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
