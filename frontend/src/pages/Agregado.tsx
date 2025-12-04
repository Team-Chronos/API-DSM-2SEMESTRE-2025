import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "../css/agregado.css";
import { ModalMensagem } from "../components/modals/ModalMensagem";
import api from "../services/api";

export default function CadastroAgregado() {
  const [formData, setFormData] = useState({
    genero: "",
    nome: "",
    cnpj: "",
    cpf: "",
    nascimento: "",
    cidadeNascimento: "",
    telefone: "",
    email: "",
    rg: "",
    emissaoRG: "",
    orgaoExp: "",
    pai: "",
    mae: "",
    pis: "",
    cep: "",
    endereco: "",
    nomeProprietario: "",
    placa: "",
    marca: "",
    modelo: "",
    cor: "",
    anoFabricacao: "",
    cilindrada: "",
    bauSuporte: "",
    seguro: "",
    valorMinSaida: "",
    valorKmRodado: "",
    cursoMotoFrete: ""
  });

  const [showMensagemModal, setShowMensagemModal] = useState(false);
  const [tituloModal, setTituloModal] = useState<"Sucesso" | "Erro" | "Aviso">("Aviso");
  const [mensagemModal, setMensagemModal] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const mascaraCPF = (v: string) =>
    v.replace(/\D/g, "").slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  const mascaraCNPJ = (v: string) =>
    v.replace(/\D/g, "").slice(0, 14)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");

  const mascaraCEP = (v: string) =>
    v.replace(/\D/g, "").slice(0, 8)
      .replace(/^(\d{5})(\d)/, "$1-$2");

  const mascaraTelefone = (v: string) =>
    v.replace(/\D/g, "").slice(0, 11)
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");

  const mascaraRG = (v: string) =>
    v.toUpperCase().replace(/[^0-9X]/g, "").slice(0, 9)
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{2}\.\d{3}\.\d{3})([0-9X])/, "$1-$2");

  const handleMaskedChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    
    try {
      const response = await api.post("/agregados", formData);

      setTituloModal("Sucesso")
      setMensagemModal(response.data.mensagem);
      setShowMensagemModal(true);
      setFormData({ ...formData, genero: "" });
    } catch (err) {
      setTituloModal("Erro")
      setMensagemModal("Erro ao se comunicar com o servidor.");
      setShowMensagemModal(true);
    }
  };

  function obrigatorio() {
    return (
      <span className={`text-danger`}>*</span>
    )
  }

  return (
    <Container className="d-flex flex-column align-items-center mt-4">

      <h1 className="mt-4">Cadastro de Agregado</h1>

      <Form className="col-10 col-md-9 col-lg-8 col-xl-7 col-xxl-6" onSubmit={handleSubmit}>
        <div className="section-box">
          <section>
            <p className={`text-danger`}>* Indica um campo obrigatório</p>
          </section>
          <h2>Dados pessoais</h2>

          <Form.Label>Gênero {obrigatorio()}</Form.Label>
          <Form.Check
            label="Masculino"
            name="genero"
            id="Masculino"
            type="radio"
            value="Masculino"
            checked={formData.genero === "Masculino"}
            onChange={handleChange}
            required
          />
          <Form.Check
            label="Feminino"
            name="genero"
            id="Feminino"
            type="radio"
            value="Feminino"
            checked={formData.genero === "Feminino"}
            onChange={handleChange}
          />
          <Form.Check
            label="Prefiro não informar"
            name="genero"
            id="Outro"
            type="radio"
            value="Outro"
            checked={formData.genero === "Outro"}
            onChange={handleChange}
          />

          <Form.Group className="mt-3">
            <Form.Label>Nome completo do motorista {obrigatorio()}</Form.Label>
            <Form.Control name="nome" value={formData.nome} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>CNPJ (Obrigatório apena para pessoa jurídica)</Form.Label>
            <Form.Control
              name="cnpj"
              value={formData.cnpj}
              onChange={e => handleMaskedChange("cnpj", mascaraCNPJ(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>CPF {obrigatorio()}</Form.Label>
            <Form.Control
              name="cpf"
              required
              value={formData.cpf}
              onChange={e => handleMaskedChange("cpf", mascaraCPF(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Data de nascimento {obrigatorio()}</Form.Label>
            <Form.Control type="date" name="nascimento" required value={formData.nascimento} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Cidade de nascimento {obrigatorio()}</Form.Label>
            <Form.Control name="cidadeNascimento" required value={formData.cidadeNascimento} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Telefone {obrigatorio()}</Form.Label>
            <Form.Control
              name="telefone"
              required
              value={formData.telefone}
              onChange={e => handleMaskedChange("telefone", mascaraTelefone(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>E-mail {obrigatorio()}</Form.Label>
            <Form.Control type="email" name="email" required value={formData.email} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>RG {obrigatorio()}</Form.Label>
            <Form.Control
              name="rg"
              required
              value={formData.rg}
              onChange={e => handleMaskedChange("rg", mascaraRG(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Data de emissão {obrigatorio()}</Form.Label>
            <Form.Control type="date" name="emissaoRG" required value={formData.emissaoRG} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Órgão expedidor {obrigatorio()}</Form.Label>
            <Form.Control name="orgaoExp" required value={formData.orgaoExp} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Nome do pai {obrigatorio()}</Form.Label>
            <Form.Control name="pai" required value={formData.pai} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Nome da mãe {obrigatorio()}</Form.Label>
            <Form.Control name="mae" required value={formData.mae} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>PIS/PASEP {obrigatorio()}</Form.Label>
            <Form.Control name="pis" required value={formData.pis} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>CEP {obrigatorio()}</Form.Label>
            <Form.Control
              name="cep"
              required
              value={formData.cep}
              onChange={e => handleMaskedChange("cep", mascaraCEP(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Endereço {obrigatorio()}</Form.Label>
            <Form.Control name="endereco" required value={formData.endereco} onChange={handleChange} />
          </Form.Group>
        </div>

        <div className="section-box">
          <h2>Dados da Moto</h2>

          <Form.Group className="mt-3">
            <Form.Label>Nome do proprietário {obrigatorio()}</Form.Label>
            <Form.Control name="nomeProprietario" required value={formData.nomeProprietario} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Placa {obrigatorio()}</Form.Label>
            <Form.Control name="placa" required value={formData.placa} maxLength={7} title="Padrão 'abc1d23' ou 'ABC1234'" pattern="([A-Za-z]{3}[0-9][A-Za-z][0-9]{2})|([A-Za-z]{3}[0-9]{4})" onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Marca {obrigatorio()}</Form.Label>
            <Form.Control name="marca" required value={formData.marca} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Modelo {obrigatorio()}</Form.Label>
            <Form.Control name="modelo" required value={formData.modelo} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Cor {obrigatorio()}</Form.Label>
            <Form.Control name="cor" required value={formData.cor} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Ano de fabricação {obrigatorio()}</Form.Label>
            <Form.Control type="number" name="anoFabricacao" required value={formData.anoFabricacao} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Cilindrada {obrigatorio()}</Form.Label>
            <Form.Control name="cilindrada" required value={formData.cilindrada} onChange={handleChange} />
          </Form.Group>

          <Form.Label className="mt-3">Possui baú? {obrigatorio()}</Form.Label>
          <Form.Check
            label="Sim"
            type="radio"
            name="bauSuporte"
            id="bausim"
            value="Sim"
            checked={formData.bauSuporte === "Sim"}
            onChange={handleChange}
            required
          />
          <Form.Check
            label="Não"
            type="radio"
            name="bauSuporte"
            id="baunao"
            value="Não"
            checked={formData.bauSuporte === "Não"}
            onChange={handleChange}
          />

          <Form.Label className="mt-3">Possui seguro?</Form.Label>
          <Form.Check
            label="Sim"
            type="radio"
            name="seguro"
            id="segurosim"
            value="Sim"
            checked={formData.seguro === "Sim"}
            onChange={handleChange}
            required
          />
          <Form.Check
            label="Não"
            type="radio"
            name="seguro"
            id="seguronao"
            value="Não"
            checked={formData.seguro === "Não"}
            onChange={handleChange}
          />
        </div>

        <div className="section-box">
          <h2>Dados de Frete</h2>

          <Form.Group className="mt-3">
            <Form.Label>Valor mínimo por saída {obrigatorio()}</Form.Label>
            <Form.Control type="number" step="0.01" name="valorMinSaida" required value={formData.valorMinSaida} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Valor mínimo por km {obrigatorio()}</Form.Label>
            <Form.Control type="number" step="0.01" name="valorKmRodado" required value={formData.valorKmRodado} onChange={handleChange} />
          </Form.Group>

          <Form.Label className="mt-3">Possui curso moto frete? {obrigatorio()}</Form.Label>
          <Form.Check
            label="Sim"
            type="radio"
            name="cursoMotoFrete"
            id="cursosim"
            value="Sim"
            checked={formData.cursoMotoFrete === "Sim"}
            onChange={handleChange}
            required
          />
          <Form.Check
            label="Não"
            type="radio"
            name="cursoMotoFrete"
            id="cursonao"
            value="Não"
            checked={formData.cursoMotoFrete === "Não"}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="mb-4 float-end" variant="primary">
          Enviar
        </Button>
      </Form>

      <ModalMensagem
        show={showMensagemModal}
        titulo={tituloModal}
        mensagem={mensagemModal}
        onClose={
          () => {
            setShowMensagemModal(false)
          }
        }
      />
    </Container>
  );
}