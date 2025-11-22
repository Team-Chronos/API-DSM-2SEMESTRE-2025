import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { buscarCidades, buscarEstados } from "../../../../../services/ibgeService";
import { calcularDistancia } from "../../../../../services/orsService";
import api from "../../../../../services/api";

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Veiculo {
  id: number;
  veiculo: string;
  peso_min: number;
  peso_max: number;
  frete_minimo: number;
  diaria_veiculo: number;
  km_minimo: number;
  km_excedente: number;
  seguro_com_ddr: number;
  seguro_sem_ddr: number;
  gris: number;
}

interface valorFreteProps {
  imposto: number;
  total: number;
  custo: number;
  frete: number;
  liquido: number;
  margem: number;
}

interface Props {
  show: boolean;
  onClose: () => void;
}

export function ModalCotacaoFrete({ show, onClose }: Props) {

  const [estados, setEstados] = useState<Estado[]>([]);

  const [ufOrigem, setUfOrigem] = useState("SP");
  const [cidadesOrigem, setCidadesOrigem] = useState<string[]>([]);
  const [origem, setOrigem] = useState("São José dos Campos");

  const [ufDestino, setUfDestino] = useState("");
  const [cidadesDestino, setCidadesDestino] = useState<string[]>([]);
  const [destino, setDestino] = useState("");
  const [remetente, setRemetente] = useState("");

  const [pesoCarga, setPesoCarga] = useState<string>("");
  const [valorCarga, setValorCarga] = useState<string>("");
  const [tipoCarga, setTipoCarga] = useState<string>("");

  const [pedagio, setPedagio] = useState<string>("");

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<Veiculo | null>(null);

  const [drop, setDrop] = useState(false);

  const [calculando, setCalculando] = useState<boolean | null>(null);
  const [distancia, setDistancia] = useState<string | null>(null);
  const [valorFrete, setValorFrete] = useState<valorFreteProps | null>(null);

  useEffect(() => {
    buscarEstados().then((data) => setEstados(data));

    async function inicial() {
      const cidades = await buscarCidades(ufOrigem);
      setCidadesOrigem(cidades);

      const res = await api.get("/cotacao/wexVeiculos");
      setVeiculos(res.data ?? []);
    }

    inicial();
  }, []);

  useEffect(() => {
    if (veiculos.length > 0) setVeiculoSelecionado(veiculos[0]);
  }, [veiculos]);

  const handleUfOrigem = async (uf: string) => {
    setUfOrigem(uf);
    setCidadesOrigem(await buscarCidades(uf));
  };

  const handleUfDestino = async (uf: string) => {
    setUfDestino(uf);
    setCidadesDestino(await buscarCidades(uf));
  };

  const handleSubmit = async () => {
    if (!valorFrete) {
      alert("Calcule o frete antes de cadastrar.");
      return;
    }

    try {
      const payload = {
        origem_uf: ufOrigem,
        origem_cidade: origem,

        destino_uf: ufDestino,
        destino_cidade: destino,
        remetente,

        peso_carga: Number(pesoCarga),
        valor_carga: Number(valorCarga),
        tipo_carga: tipoCarga,

        pedagio: Number(pedagio),

        distancia_km: Number(distancia),

        veiculo_id: veiculoSelecionado?.id,

        drop_servico: drop,

        imposto: valorFrete.imposto,
        total: valorFrete.total,
        custo: valorFrete.custo,
        frete: valorFrete.frete,
        liquido: valorFrete.liquido,
        margem: valorFrete.margem,
      };
      
      const res = await api.post("/cotacao", payload);

      alert("Cotação cadastrada com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar cotação.");
    }
  };

  function calcFrete(distanciaDireta?: number) {
    if (!veiculoSelecionado) return null;

    const num = (v: any) => Number(v ?? 0);

    const dist = typeof distanciaDireta === "number" ? distanciaDireta : Number(distancia);
    if (Number.isNaN(dist)) return null;

    const dias = 1;

    const Vbase = num(veiculoSelecionado.frete_minimo);
    const Vdias = num(veiculoSelecionado.diaria_veiculo) * dias;

    const km_minimo = num(veiculoSelecionado.km_minimo);
    const km_excedente = num(veiculoSelecionado.km_excedente);

    const VKmExc = dist > km_minimo ? (dist - km_minimo) * km_excedente : 0;

    const Vfrete = Vbase + VKmExc;

    const Vcarga = num(valorCarga);
    const seguro_com_ddr = num(veiculoSelecionado.seguro_com_ddr);
    const gris = num(veiculoSelecionado.gris);

    const Vimposto =
      Vcarga * (ufDestino === "RJ" ? seguro_com_ddr : 0.0035) +
      Vcarga * gris;

      
    const Vdrop = drop ? 150 : 0;

    const Vcusto = Vfrete + Vdias + Vimposto + num(pedagio) + Vdrop;

    const VmargemOperacao = Vfrete * 0.2;

    const Vtotal = Vcusto + VmargemOperacao;
    
    const Vliquido = Vtotal - Vcusto

    const pagar: valorFreteProps = {
      imposto: Vimposto,
      total: Vtotal,
      custo: Vcusto,
      frete: Vfrete,
      liquido: Vliquido,
      margem: Vtotal !== 0 ? Vliquido / Vtotal : 0,
    };

    setValorFrete(pagar);
    setCalculando(false);
  }


  const calcular = async () => {
    if (!origem || !destino) {
      alert("Selecione origem e destino");
      return;
    }

    try {
      setCalculando(true);

      const distanciaKm = await calcularDistancia(
        `${origem}, ${ufOrigem}`,
        `${destino}, ${ufDestino}`
      );

      const dist = Number(distanciaKm.toFixed(2));
      setDistancia(dist.toString());

      calcFrete(dist);
    } catch (e) {
      console.error(e);
      alert("Erro ao calcular distância");
      setDistancia(null);
      setValorFrete(null);
    }
  };

  const veiculosFiltrados = veiculos.filter((v) =>
    pesoCarga ? v.peso_min <= Number(pesoCarga) && Number(pesoCarga) <= v.peso_max : true
  );

  useEffect(() => {
    if (veiculosFiltrados.length === 1) {
      setVeiculoSelecionado(veiculosFiltrados[0]);
    }
  }, [pesoCarga, veiculos]);

  return (
    <Modal show={show} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Cotação de Frete</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <h3>Origem</h3>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Estado</Form.Label>
            <Form.Select value={ufOrigem} onChange={(e) => handleUfOrigem(e.target.value)}>
              <option value="">Selecione...</option>
              {estados.map((uf) => (
                <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
              ))}
            </Form.Select>

            {cidadesOrigem.length > 0 && (
              <>
                <Form.Label className="fw-semibold mt-3">Cidade</Form.Label>
                <Form.Select value={origem} onChange={(e) => setOrigem(e.target.value)}>
                  <option value="">Selecione...</option>
                  {cidadesOrigem.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Select>
              </>
            )}
          </Form.Group>

          <hr className="my-3" />

          <h3>Destino</h3>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Estado</Form.Label>
            <Form.Select value={ufDestino} onChange={(e) => handleUfDestino(e.target.value)}>
              <option value="">Selecione...</option>
              {estados.map((uf) => (
                <option key={uf.id} value={uf.sigla}>{uf.nome}</option>
              ))}
            </Form.Select>

            {cidadesDestino.length > 0 && (
              <>
                <Form.Label className="fw-semibold mt-3">Cidade</Form.Label>
                <Form.Select value={destino} onChange={(e) => setDestino(e.target.value)}>
                  <option value="">Selecione...</option>
                  {cidadesDestino.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Select>

                <Form.Label className="fw-semibold mt-3">Remetente</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nome do remetente"
                  value={remetente}
                  onChange={(e) => setRemetente(e.target.value)}
                />
              </>
            )}
          </Form.Group>

          <hr className="my-3" />

          <section>
            <h4>Carga</h4>

            <Form.Group>
              <Form.Label>Peso (Kg)</Form.Label>
              <Form.Control
                type="number"
                value={pesoCarga}
                onChange={(e) => setPesoCarga(e.target.value)}
                min={0}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Valor da Carga (R$)</Form.Label>
              <Form.Control
                type="number"
                value={valorCarga}
                onChange={(e) => setValorCarga(e.target.value)}
                min={0}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Tipo de Carga</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ex: Eletrônicos, alimentos..."
                value={tipoCarga}
                onChange={(e) => setTipoCarga(e.target.value)}
              />
            </Form.Group>
          </section>

          <hr className="my-3" />

          <section>
            <Form.Group>
              <Form.Label>Taxa de Pedágio (R$)</Form.Label>
              <Form.Control
                type="number"
                value={pedagio}
                onChange={(e) => setPedagio(e.target.value)}
                min={0}
              />
            </Form.Group>
          </section>

          <hr className="my-3" />

          <section>
            <h6 className="fw-semibold">Tipo de Serviço</h6>
            <p>WExpress (Rodoviário)</p>

            <Form.Group>
              <Form.Label className="fw-semibold">Veículo</Form.Label>

              <Form.Select
                value={veiculoSelecionado?.id ?? ""}
                onChange={(e) => {
                  const found = veiculos.find((v) => v.id === Number(e.target.value));
                  setVeiculoSelecionado(found ?? null);
                }}
              >
                {veiculosFiltrados.length === 0 && (
                  <option value="">Nenhum veículo compatível</option>
                )}

                {veiculosFiltrados.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.veiculo} ({v.peso_min}–{v.peso_max} kg)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </section>

          <section className="mt-3">
            <Form.Check
              id="drop-check"
              type="checkbox"
              label="DROP - R$ 150"
              checked={drop}
              onChange={(e) => setDrop(e.target.checked)}
            />
          </section>

          {calculando === true && (
            <div className="text-center pt-2">Calculando...</div>
          )}

          {calculando === false && valorFrete && (
            <>
              <hr className="my-3" />
              <div className="text-center">
                <p className="fs-5 fw-semibold mt-2">
                  Imposto: <span className="text-success">R$ {valorFrete.imposto.toFixed(2)}</span><br />
                  Total do frete: <span className="text-success">R$ {valorFrete.total.toFixed(2)}</span><br />
                  (-) Custo Estimado: <span className="text-success">R$ {valorFrete.custo.toFixed(2)}</span>
                </p>
                <hr className="my-3" />
                <p>
                  Valor Líquido: <span className="text-success">R$ {valorFrete.liquido.toFixed(2)}</span><br />
                  Margem: <span className="text-success">{(valorFrete.margem * 100).toFixed(2)}%</span>
                </p>
              </div>
            </>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>Fechar</Button>
        <Button variant="secondary" onClick={calcular}>Calcular</Button>
        <Button variant="primary" onClick={handleSubmit}>Cadastrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
