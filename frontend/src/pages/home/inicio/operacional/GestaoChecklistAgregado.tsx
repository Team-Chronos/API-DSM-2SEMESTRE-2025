import { useState, useEffect } from 'react';
import { Button, Spinner, Card, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../../../services/api';
import { formatarDataHora } from '../../../../utils/formatacoes';
import { ModalChecklistVeiAgreg } from '../../../../components/modals/ModalChecklistVeiAgreg';
import { ModalVerChecklistVeiAgreg } from '../../../../components/modals/ModalVerChecklistVeiAgreg';
import { ModalMensagem } from '../../../../components/modals/ModalMensagem';

interface DashboardStats {
    totalChecklists: number;
    checklistsMes: number;
    problemasIdentificados: number;
    statusGeral: string;
    percentualConformidade: number;
}

export function GestaoChecklistAgregado() {
    const navigate = useNavigate();
    const [checklists, setChecklists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalView, setShowModalView] = useState(false);
    const [idSelecionado, setIdSelecionado] = useState<number | null>(null);

    const [showMessage, setShowMessage] = useState(false);
    const [tituloMessage, setTituloMessage] = useState<"Sucesso" | "Erro" | "Aviso">("Aviso");
    const [mensagem, setMensagem] = useState("");

    const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
        totalChecklists: 0,
        checklistsMes: 0,
        problemasIdentificados: 0,
        statusGeral: 'Bom',
        percentualConformidade: 100
    });

    const normalizarTexto = (texto: string | null) => {
        if (!texto) return "";
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    };

    const fetchChecklists = async () => {
        try {
            setLoading(true);
            const response = await api.get("/checklistVeiculoAgregado");
            setChecklists(response.data);
            calcularEstatisticas(response.data);
        } catch (err) {
            console.error('Erro ao carregar checklists:', err);
            setMensagem("Erro ao carregar os dados.");
            setTituloMessage("Erro");
            setShowMessage(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklists();
    }, []);

    const calcularEstatisticas = (dados: any[]) => {
        const agora = new Date();
        const primeiroDiaMes = new Date(agora.getFullYear(), agora.getMonth(), 1);

        const checklistsMes = dados.filter(c => new Date(c.criado_em) >= primeiroDiaMes).length;

        let problemas = 0;

        dados.forEach(c => {
            if (normalizarTexto(c.pne_liso) === 'sim') problemas++;
            if (normalizarTexto(c.pte_liso) === 'sim') problemas++;
            if (normalizarTexto(c.ptd_liso) === 'sim') problemas++;
            if (normalizarTexto(c.pdd_liso) === 'sim') problemas++;
            if (normalizarTexto(c.vazamento_oleo) === 'nao') problemas++;
            if (normalizarTexto(c.nivel_oleo) === 'nao') problemas++;
            if (normalizarTexto(c.nivel_agua) === 'nao') problemas++;
            if (normalizarTexto(c.parabrisa_perfeito) === 'nao') problemas++;
            if (normalizarTexto(c.sem_amassado_ferrugem) === 'nao') problemas++;
            const itensSeguranca = [
                c.extintor, c.luz_freio, c.buzina_funciona, c.farol_alto,
                c.farol_baixo, c.setas_dianteiras, c.setas_traseiras,
                c.pisca_alerta, c.luz_re, c.sirene_re, c.step,
                c.triangulo, c.macaco, c.chave_roda, c.capacete_seguranca,
                c.colete_seguranca, c.bota_seguranca
            ];

            itensSeguranca.forEach(item => {
                if (normalizarTexto(item) === 'nao') problemas++;
            });
        });
        const totalPerguntasPorChecklist = 30;
        const totalPerguntasAvaliadas = Math.max(1, dados.length * totalPerguntasPorChecklist);

        const percentualConformidade = dados.length > 0
            ? Math.max(0, 100 - (problemas / totalPerguntasAvaliadas) * 100)
            : 100;

        let statusGeral = 'Bom';
        if (percentualConformidade < 80) statusGeral = 'Crítico';
        else if (percentualConformidade < 95) statusGeral = 'Atenção';

        setDashboardStats({
            totalChecklists: dados.length,
            checklistsMes,
            problemasIdentificados: problemas,
            statusGeral,
            percentualConformidade: Math.round(percentualConformidade)
        });
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Bom': return 'success';
            case 'Atenção': return 'warning';
            case 'Crítico': return 'danger';
            default: return 'secondary';
        }
    };

    const temProblemas = (c: any): boolean => {
        const pneuRuim = [c.pne_liso, c.pte_liso, c.ptd_liso, c.pdd_liso]
            .some(val => normalizarTexto(val) === 'sim');

        const vazamento = normalizarTexto(c.vazamento_oleo) === 'nao';

        const niveisRuins = normalizarTexto(c.nivel_oleo) === 'nao' ||
            normalizarTexto(c.nivel_agua) === 'nao';

        const segurancaRuim = normalizarTexto(c.extintor) === 'nao' ||
            normalizarTexto(c.luz_freio) === 'nao';

        return pneuRuim || vazamento || niveisRuins || segurancaRuim;
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Button
                        variant="outline-secondary"
                        className="border-0 rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }}
                        onClick={() => navigate(-1)}
                        title="Voltar"
                    >
                        <i className="bi bi-arrow-left fs-5"></i>
                    </Button>
                    <div>
                        <h1 className="h3 mb-1">Checklist Veículo Agregado</h1>
                        <p className="text-muted mb-0">Gestão e monitoramento da frota agregada</p>
                    </div>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowModalAdd(true)}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Novo Checklist
                </Button>
            </div>
            <Row className="mb-4">
                <Col xl={3} md={6} className="mb-4">
                    <Card className={`border-0 bg-${getStatusClass(dashboardStats.statusGeral)} text-white h-100`}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="h6">Status da Frota</Card.Title>
                                    <h2 className="mb-0">{dashboardStats.statusGeral}</h2>
                                    <small>Conformidade: {dashboardStats.percentualConformidade}%</small>
                                </div>
                                <div className="fs-1">
                                    {dashboardStats.statusGeral === 'Bom' && '✓'}
                                    {dashboardStats.statusGeral === 'Atenção' && '⚠'}
                                    {dashboardStats.statusGeral === 'Crítico' && '❗'}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6} className="mb-4">
                    <Card className="border-0 bg-info text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="h6">Total Realizado</Card.Title>
                                    <h2 className="mb-0">{dashboardStats.totalChecklists}</h2>
                                    <small>Desde o início</small>
                                </div>
                                <div className="fs-1">
                                    <i className="bi bi-truck"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6} className="mb-4">
                    <Card className="border-0 bg-secondary text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="h6">Este Mês</Card.Title>
                                    <h2 className="mb-0">{dashboardStats.checklistsMes}</h2>
                                    <small>Vistorias recentes</small>
                                </div>
                                <div className="fs-1">
                                    <i className="bi bi-calendar-check"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xl={3} md={6} className="mb-4">
                    <Card className="border-0 bg-warning text-dark h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title className="h6">Problemas/Alertas</Card.Title>
                                    <h2 className="mb-0">{dashboardStats.problemasIdentificados}</h2>
                                    <small>Itens irregulares detectados</small>
                                </div>
                                <div className="fs-1">
                                    <i className="bi bi-exclamation-triangle"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light py-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">
                            <i className="bi bi-list-ul me-2"></i>
                            Histórico de Vistorias
                        </h5>
                        <Badge bg="primary" pill>{checklists.length}</Badge>
                    </div>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Carregando dados...</p>
                        </div>
                    ) : checklists.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-muted">Nenhum checklist encontrado.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Data</th>
                                        <th>Motorista / Responsável</th>
                                        <th>Placa</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checklists.map((item) => {
                                        const problematico = temProblemas(item);
                                        return (
                                            <tr key={item.ID_cva} className={problematico ? 'table-warning' : ''}>
                                                <td><Badge bg="secondary">#{item.ID_cva}</Badge></td>
                                                <td>{formatarDataHora(item.criado_em)}</td>
                                                <td>
                                                    <div className="fw-bold">{item.nome_motorista}</div>
                                                    <small className="text-muted">
                                                        Vistoria: {item.Nome_Col || item.nome_responsavel_vistoria}
                                                    </small>
                                                </td>
                                                <td>
                                                    <Badge bg="light" text="dark" className="border">
                                                        {item.placa_veiculo}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg={problematico ? 'warning' : 'success'}>
                                                        {problematico ? 'Atenção' : 'Aprovado'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => {
                                                            setIdSelecionado(item.ID_cva);
                                                            setShowModalView(true);
                                                        }}
                                                    >
                                                        <i className="bi bi-eye me-1"></i>
                                                        Ver Detalhes
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card.Body>
            </Card>

            <ModalChecklistVeiAgreg
                show={showModalAdd}
                onClose={() => setShowModalAdd(false)}
                onSucces={() => {
                    fetchChecklists();
                    setTituloMessage("Sucesso");
                    setMensagem("Checklist cadastrado com sucesso!");
                    setShowMessage(true);
                }}
                onErro={() => {
                    setTituloMessage("Erro");
                    setMensagem("Erro ao cadastrar checklist.");
                    setShowMessage(true);
                }}
                setMensagem={setMensagem}
            />
            <ModalVerChecklistVeiAgreg
                show={showModalView}
                onClose={() => setShowModalView(false)}
                idChecklist={idSelecionado}
            />
            <ModalMensagem
                show={showMessage}
                titulo={tituloMessage}
                mensagem={mensagem}
                onClose={() => setShowMessage(false)}
            />
        </div>
    );
}