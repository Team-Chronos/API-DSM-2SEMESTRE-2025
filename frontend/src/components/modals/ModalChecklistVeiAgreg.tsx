import { Button, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { formatarCpf } from "../../utils/formatacoes";
import api from "../../services/api";

interface Props {
  show: boolean;
  onClose: () => void;
  onSucces: () => void
  onErro: () => void
  setMensagem: (x: string) => void
}

export function ModalChecklistVeiAgreg({ show, onClose, onSucces, onErro, setMensagem }: Props) {
  const [formData, setFormData] = useState<any>({});
  const [ responsaveisVistoria, setResponsaveisVistoria ] = useState<any>(null)

  useEffect(() => {
    const getResponsaveis = async () => {
      try{
        const response = await api.get("/checklistVeiculoAgregado/responsaveis")
        setResponsaveisVistoria(response.data)
      } catch(error){
        console.error("Erro ao carregar responáveis pela vistoria:", error);
      }
    }
    getResponsaveis()
  }, [show])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    let { name, value } = e.target;

    switch (name){
      case "cpf":
        value = formatarCpf(value)
        break
      case "placa_veiculo":
        value = value.toUpperCase().trim()
        break
    }

    setFormData({ ...formData, [name]: value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      if (formData[key] instanceof FileList) {
        Array.from(formData[key]).forEach((file) => data.append(key, file));
      } else if (key === "cpf") {
        data.append(key, formData[key].replace(/\D/g, ''));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await api.post("/checklistVeiculoAgregado", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMensagem(response.data.mensagem);
      onSucces()
      onClose()
    } catch (err) {
      console.error("Erro ao enviar checklist", err);
      setMensagem("Erro ao enviar checklist")
      onErro()
      onClose()
    }
  }

  function renderRadios(name: string, label: string, options: string[]){
    return(
      <div key={name} className="d-flex justify-content-between align-items-center border-bottom py-2">
        <span key={label} className="text-capitalize">{label}</span>
        <div key={name} className="d-flex gap-3">
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
    )
  }

  function obrigatorio(){
    return(
      <span className={`text-danger`}>*</span>
    )
  }

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Form encType="multipart/form-data" onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Checklist de Veículo Agregado</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <section>
            <p className={`text-danger`}>* Indica uma pergunta obrigatória</p>
          </section>
          
          <hr />

          <section className={`mt-4`}>
            <h4>Dados do Veículo</h4>
            <div className="mb-4 mx-1 d-flex flex-column row-gap-3">
              <div className={`ps-0`}>
                <Form.Group>
                  <Form.Label>Nome Completo do Motorista {obrigatorio()}</Form.Label>
                  <Form.Control type="text" name="nome_motorista" placeholder="Nome..." onChange={handleChange} required />
                </Form.Group>
              </div>
              <div className={`ps-0`}>
                <Form.Group>
                  <Form.Label>CPF {obrigatorio()}</Form.Label>
                  <Form.Control type="text" name="cpf" value={formData.cpf || ""} maxLength={14} onChange={handleChange} placeholder="000.000.000-00"required />
                </Form.Group>
              </div>
              <div className={`ps-0`}>
                <Form.Group>
                  <Form.Label>Placa {obrigatorio()}</Form.Label>
                  <Form.Control type="text" name="placa_veiculo" title="Padrão 'abc1d23' ou 'ABC1234'" pattern="([A-Za-z]{3}[0-9][A-Za-z][0-9]{2})|([A-Za-z]{3}[0-9]{4})" placeholder="ABC1234 ou ABC1D23" value={formData.placa_veiculo || ""} maxLength={7} onChange={handleChange} required />
                </Form.Group>
              </div>
            </div>

            <div className="mb-3 mx-1 d-flex flex-column">
              <Form.Label>Tipo do Veículo {obrigatorio()}</Form.Label>
              {["FIORINO", "VAN", "VUC", "3/4", "TOCO", "TRUCK", "CARRETA"].map((opt) => (
                <Form.Check
                  className={`ms-2`}
                  key={opt}
                  inline
                  type="radio"
                  name={"tipo_veiculo"}
                  id={opt}
                  label={opt.toUpperCase()}
                  value={opt}
                  onChange={handleChange}
                  checked={formData["tipo_veiculo"] === opt}
                  required
                />
              ))}
            </div>
          </section>

          <hr />

          <section>
            <h4 className="mt-4">Motor e Nível de Óleo</h4>
            {renderRadios("nivel_oleo", "Nível de ÓLEO está bom?", ["sim", "não", "na"])}
            {renderRadios("vazamento_oleo", "Livre de vazamentos de ÓLEO?", ["sim", "não", "na"])}
            {renderRadios("nivel_agua", "Nível de ÁGUA reservatório está bom?", ["sim", "não", "na"])}

            <div className="mb-3 mx-1">
              <div className={`mt-4`}>
                <Form.Group className={`d-flex flex-column h-100`}>
                  <Form.Label><strong>Foto do Motor</strong> {obrigatorio()}</Form.Label>
                  <img className={`py-4`} src="/images/exemplosChecklistVeiculoAgregado/motor.jpg" alt="Exemplo de foto do motor para envio" style={{maxWidth: "400px"}} />
                  <Form.Control className={`mt-auto`} type="file" name="foto_motor" onChange={handleFileChange} required />
                </Form.Group>
              </div>
              <div className={`mt-4`}>
                <Form.Group className={`d-flex flex-column h-100`}>
                  <Form.Label><strong>Foto da Etiqueta da Última Troca de Óleo</strong></Form.Label>
                  <img className={`py-4`} src="/images/exemplosChecklistVeiculoAgregado/etiqueta_troca_oleo.jpg" alt="Exemplo de foto da etiqueta de troca de óleo para envio" style={{maxWidth: "400px"}} />
                  <Form.Control className={`mt-auto`} type="file" name="foto_etiqueta_troca_oleo" onChange={handleFileChange} />
                </Form.Group>
              </div>
            </div>
          </section>

          <hr />

          <section>
            <h4 className="mt-4">Pneus</h4>
            <h5 className={`mt-4`}><strong>Pneus estão lisos?</strong>{obrigatorio()}</h5>
            {[{name: "pne_liso", label: "Pneu Dianteiro Esquerdo"}, {name: "pte_liso", label: "Pneu Traseiro Esquerdo"}, {name: "ptd_liso", label: "Pneu Traseiro Direito"}, {name: "pdd_liso", label: "Pneu Dianteiro Direito"}].map((campo) => renderRadios(campo.name, campo.label, ["sim", "não"]))}

            <h5 className={`mt-4`}><strong>FOTOS GERAIS - Comprobatórias</strong>{obrigatorio()}</h5>
            <p>(Adicione 4 fotos do veiculo)</p>
            <div className="my-3 mx-1 d-flex flex-column row-gap-4">
              {[{name: "pne_foto", label: "Pneu Dianteiro Esquerdo"}, {name: "pte_foto", label: "Pneu Traseiro Esquerdo"}, {name: "ptd_foto", label: "Pneu Traseiro Direito"}, {name: "pdd_foto", label: "Pneu Dianteiro Direito"}].map((campo) => (
                <div key={campo.name}>
                  <Form.Group>
                    <Form.Label>Foto - {campo.label}</Form.Label>
                    <Form.Control type="file" name={campo.name} onChange={handleFileChange} required />
                  </Form.Group>
                </div>
              ))}
            </div>
          </section>

          <hr />

          <section>
            <h4 className="mt-4">Conservação e Estrutura</h4>
            <h5 className={`mt-3`}><strong>Limpeza e Aparência externa do veículo</strong>{obrigatorio()}</h5>
            {[
              {name: "parabrisa_perfeito", label: "Para-Brisa em perfeito estado?"},
              {name: "cabine_externa_limpa", label: "Cabine (externa) está limpa?"},
              {name: "veiculo_externo_limpo", label: "Veículo (externo) está limpo?"},
              {name: "sem_amassado_ferrugem", label: "Livre de amassado ou ferrugem?"},
              {name: "assoalho_conservado", label: "Assoalho está conservado?"},
              {name: "faixas_refletivas", label: "Possui FAIXAS REFLETIVAS?"},
            ].map((campo) => renderRadios(campo.name, campo.label, ["sim", "não", "na"]))}
          </section>

          <hr />

          <section>
            <h4 className="mt-4"><strong>Sistema Elétrico</strong>{obrigatorio()}</h4>
            {[
                {name: "parabrisa_funcionando", label: "Limpador Para-Brisa funcionando?"},
                {name: "buzina_funciona", label: "Buzina funciona?"},
                {name: "farol_alto", label: "Farol ALTO (dois lados)?"},
                {name: "farol_baixo", label: "Farol BAIXO (dois lados)?"},
                {name: "setas_dianteiras", label: "Setas dianteiras (dois lados)?"},
                {name: "setas_traseiras", label: "Setas traseiras (dois lados)?"},
                {name: "pisca_alerta", label: "Pisca-Alerta (dois lados)?"},
                {name: "luz_freio", label: "Luz de freio (dois lados)?"},
                {name: "luz_re", label: "Luz de Ré (dois lados)?"},
                {name: "sirene_re", label: "Sirene de Ré funciona?"},
              ].map((campo) => renderRadios(campo.name, campo.label, ["sim", "não", "na"]))}
          </section>

          <hr />

          <section>
            <h4 className="mt-4"><strong>Itens Obrigatórios e Segurança Individual</strong>{obrigatorio()}</h4>
            {[
              {name: "extintor", label: "Possui EXTINTOR?"},
              {name: "step", label: "Possui STEP?"},
              {name: "triangulo", label: "Possui TRIANGULO?"},
              {name: "macaco", label: "Possui MACACO?"},
              {name: "chave_roda", label: "Possui CHAVE DE RODA?"},
              {name: "capacete_seguranca", label: "Possui CAPACETE SEGURANÇA?"},
              {name: "colete_seguranca", label: "Possui COLETE SEGURANÇA?"},
              {name: "bota_seguranca", label: "Possui BOTA DE SEGURANÇA?"},
            ].map((campo) => renderRadios(campo.name, campo.label, ["sim", "não", "na"]))}
          </section>

          <hr />

          <section>
            <h4 className="mt-4">Fotos do Veículo {obrigatorio()}</h4>
            <div className="my-4 mx-1 d-flex flex-column row-gap-3">
              <img src="/images/exemplosChecklistVeiculoAgregado/veiculo.jpg" alt="Exemplo de foto do veículo para envio" />
              {[
                { name: "foto_frente", label: "Frente" },
                { name: "foto_lateral_direita", label: "Lateral Direita" },
                { name: "foto_lateral_esquerda", label: "Lateral Esquerda" },
                { name: "foto_traseira", label: "Traseira com a porta ABERTA" },
              ].map(({ name, label }) => (
                <Form.Group key={name}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control type="file" name={name} onChange={handleFileChange} required />
                </Form.Group>
              ))}
            </div>
          </section>

          <hr />
          
          <section>
            <h4 className="mt-4">Responsável e Observações</h4>
            <div className="mb-3 mx-1">
              <Form.Group>
                <Form.Label>Responsável pela Vistoria {obrigatorio()}</Form.Label>

                <div className="d-flex flex-column gap-2 mt-2">
                  {responsaveisVistoria?.map((resp: any) => (
                    <Form.Check
                      key={resp.id_responsavel}
                      type="radio"
                      name="id_responsavel_vistoria"
                      id={`${resp.id_responsavel}-${resp.Nome_col}`}
                      label={resp.Nome_col}
                      value={resp.id_responsavel}
                      onChange={handleChange}
                      checked={Number(formData.id_responsavel_vistoria) === resp.id_responsavel}
                      required
                    />
                  ))}

                  <Form.Check
                    type="radio"
                    name="id_responsavel_vistoria"
                    id="outro"
                    label="Outro"
                    value="outro"
                    onChange={handleChange}
                    checked={formData.id_responsavel_vistoria === "outro"}
                    required
                  />
                </div>

                {formData.id_responsavel_vistoria === "outro" && (
                  <div className="mt-3">
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome do responsável"
                      name="nome_responsavel_vistoria"
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </Form.Group>
            </div>
          </section>

          <Form.Group className="mb-3">
            <Form.Label>Observações</Form.Label>
            <Form.Control as="textarea" rows={3} name="observacoes" onChange={handleChange} />
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
