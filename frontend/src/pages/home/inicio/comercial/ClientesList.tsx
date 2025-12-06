import { useEffect, useState, useMemo } from "react";
import { Button, Table, Form, InputGroup, Spinner, Alert } from "react-bootstrap";
import { ModalCadastroCliente } from "../../../../components/modals/ModalCadastroCliente";
import type { Cliente } from "../../../../utils/tipos";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaPlus, FaEye, FaUsers, FaFilter, FaBuilding, FaBriefcase, FaTimes, FaSlidersH } from 'react-icons/fa';
import "../../../../css/ClienteList.css";
import api from "../../../../services/api";

const etapaConfig = {
    Prospects: { background: "#6c757d", color: "#fff" },
    Inicial: { background: "#0dcaf0", color: "#000" },
    Potencial: { background: "#198754", color: "#fff" },
    "Em Manutenção": { background: "#ffc107", color: "#000" },
    "Em Negociação": { background: "#fd7e14", color: "#fff" },
    "Follow Up": { background: "#6610f2", color: "#fff" },
    default: { background: "#e9ecef", color: "#495057" },
};

export const ClientesList = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroEtapa, setFiltroEtapa] = useState<string>("todos");
    const [filtroDepartamento, setFiltroDepartamento] = useState<string>("todos");
    const [filtroSegmento, setFiltroSegmento] = useState<string>("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Cliente; direction: 'ascending' | 'descending' }>({ key: 'Nome_Cliente', direction: 'ascending' });
    
    const [isFiltrosOpen, setIsFiltrosOpen] = useState(false);
    
    const navigate = useNavigate();

    const carregarClientes = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/clientes");
            setClientes(res.data);
        } catch (err) {
            console.error(err);
            setError("Falha ao carregar clientes. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarClientes();
    }, []);

    const departamentosUnicos = useMemo(() => {
        const departamentos = new Set(clientes.map(c => c.depart_responsavel).filter(Boolean));
        return Array.from(departamentos).sort();
    }, [clientes]);

    const segmentosUnicos = useMemo(() => {
        const segmentos = new Set(clientes.map(c => c.Segmento).filter(Boolean));
        return Array.from(segmentos).sort();
    }, [clientes]);

    const clientesFiltradosEOrdenados = useMemo(() => {
        let clientesProcessados = [...clientes];

        if (filtroEtapa !== "todos") {
            clientesProcessados = clientesProcessados.filter((c) => c.Etapa === filtroEtapa);
        }
        if (filtroDepartamento !== "todos") {
            clientesProcessados = clientesProcessados.filter((c) => c.depart_responsavel === filtroDepartamento);
        }
        if (filtroSegmento !== "todos") {
            clientesProcessados = clientesProcessados.filter((c) => c.Segmento === filtroSegmento);
        }

        if (searchTerm) {
             clientesProcessados = clientesProcessados.filter((c) =>
                Object.values(c).some(val => 
                    String(val).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (sortConfig.key) {
            clientesProcessados.sort((a, b) => {
                const valA = a[sortConfig.key] || '';
                const valB = b[sortConfig.key] || '';
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return clientesProcessados;
    }, [clientes, filtroEtapa, filtroDepartamento, filtroSegmento, searchTerm, sortConfig]);

    const requestSort = (key: keyof Cliente) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') direction = 'descending';
        setSortConfig({ key, direction });
    };

    const handleResetFilters = () => {
        setSearchTerm("");
        setFiltroEtapa("todos");
        setFiltroDepartamento("todos");
        setFiltroSegmento("todos");
    };

    const isFiltroDropdownAtivo = filtroEtapa !== "todos" || filtroDepartamento !== "todos" || filtroSegmento !== "todos";

    const SortableHeader = ({ label, columnKey }: { label: string, columnKey: keyof Cliente }) => {
        const icon = sortConfig.key === columnKey ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) : <FaSort />;
        return <th onClick={() => requestSort(columnKey)} className="sortable-header">{label} {icon}</th>;
    };
    
    const formatarData = (data: string) => new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    const renderContent = () => {
        if (loading) return <div className="feedback-container"><Spinner animation="border" /> <p>Carregando clientes...</p></div>;
        if (error) return <div className="feedback-container"><Alert variant="danger">{error}</Alert></div>;
        if (clientesFiltradosEOrdenados.length === 0) return <div className="feedback-container"><p>Nenhum cliente encontrado para os filtros selecionados.</p></div>;
        
        return (
            <Table hover responsive className="tabela-clientes">
                <thead>
                    <tr>
                        <SortableHeader label="Nome" columnKey="Nome_Cliente" />
                        <SortableHeader label="Segmento" columnKey="Segmento" />
                        <SortableHeader label="Departamento" columnKey="depart_responsavel" />
                        <SortableHeader label="Etapa" columnKey="Etapa" />
                        <SortableHeader label="Data Cadastro" columnKey="criado_em" />
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientesFiltradosEOrdenados.map((c) => {
                       const etapaStyle = etapaConfig[c.Etapa as keyof typeof etapaConfig] || etapaConfig.default;
                       return (
                        <tr key={c.ID_Cliente}>
                            <td>{c.Nome_Cliente}</td>
                            <td>{c.Segmento}</td>
                            <td>{c.depart_responsavel}</td>
                            <td>
                                <span className="etapa-tag" style={{ backgroundColor: etapaStyle.background, color: etapaStyle.color }}>
                                    {c.Etapa || "—"}
                                </span>
                            </td>
                            <td>{formatarData(c.criado_em)}</td>
                            <td>
                                <Button
                                    variant="outline-primary" size="sm" className="btn-acao"
                                    onClick={() => navigate(`/comercial/cliente/${c.ID_Cliente}`)}
                                >
                                    <FaEye /> Ver Detalhes
                                </Button>
                            </td>
                        </tr>
                       )
                    })}
                </tbody>
            </Table>
        );
    }

    return (
        <div className="clientes-page-container">
            <div className="clientes-header">
                <h3><FaUsers /> Clientes Cadastrados</h3>
                <Button className="btn-novo" onClick={() => setShowModal(true)}>
                    <FaPlus /> Novo Cliente
                </Button>
            </div>

            <div className="controles-wrapper">
                <InputGroup className="search-bar">
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                    <Form.Control type="text" placeholder="Buscar em tudo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </InputGroup>
                <Button 
                    variant="outline-secondary" 
                    className={`btn-toggle-filtros ${isFiltroDropdownAtivo ? 'filtros-ativos' : ''}`}
                    onClick={() => setIsFiltrosOpen(!isFiltrosOpen)}
                >
                    <FaSlidersH /> Filtros
                </Button>
            </div>

            <div className={`filtros-panel-container ${isFiltrosOpen ? 'open' : ''}`}>
                <div className="filtros-panel-content">
                    <div className="filtros-header">
                        <h4>Opções de Filtro</h4>
                        {isFiltroDropdownAtivo && (
                            <Button variant="link" size="sm" className="btn-limpar-filtros" onClick={handleResetFilters}>
                                <FaTimes /> Limpar
                            </Button>
                        )}
                    </div>
                    <div className="filtros-grid">
                        <InputGroup>
                            <InputGroup.Text><FaFilter /></InputGroup.Text>
                            <Form.Select value={filtroEtapa} onChange={(e) => setFiltroEtapa(e.target.value)}>
                                <option value="todos">Todas as Etapas</option>
                                {Object.keys(etapaConfig).filter(k => k !== 'default').map(etapa => <option key={etapa} value={etapa}>{etapa}</option>)}
                            </Form.Select>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text><FaBuilding /></InputGroup.Text>
                            <Form.Select value={filtroDepartamento} onChange={(e) => setFiltroDepartamento(e.target.value)}>
                                <option value="todos">Todos os Departamentos</option>
                                {departamentosUnicos.map(depto => <option key={depto} value={depto}>{depto}</option>)}
                            </Form.Select>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text><FaBriefcase /></InputGroup.Text>
                            <Form.Select value={filtroSegmento} onChange={(e) => setFiltroSegmento(e.target.value)}>
                                <option value="todos">Todos os Segmentos</option>
                                {segmentosUnicos.map(segmento => <option key={segmento} value={segmento}>{segmento}</option>)}
                            </Form.Select>
                        </InputGroup>
                    </div>
                </div>
            </div>

            <div className="tabela-wrapper">
                {renderContent()}
            </div>

            <ModalCadastroCliente
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={carregarClientes}
            />
        </div>
    );
};