import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ModalCotacaoFrete } from "./CotacaoFrete";
import { ModalDetalhesCotacao } from "../../../../../components/modals/ModalDetalhesCotacao";
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaPlus, FaSlidersH, FaTimes, FaSync, FaMapMarkerAlt, FaEye, FaTrash } from 'react-icons/fa';
import "../../../../../css/cotacao.css";

interface Cotacao {
  id: number;
  remetente: string;
  origem_cidade: string;
  origem_uf: string;
  destino_cidade: string;
  destino_uf: string;
  criado_em: string;
  total: number;
  status: string;
  cliente_id?: number;
}

type SortKey = keyof Cotacao;
type SortDirection = 'ascending' | 'descending';

export default function Cotacao() {
  const [showModalCotacao, setShowModalCotacao] = useState(false);
  const [showModalDetalhes, setShowModalDetalhes] = useState(false);
  const [cotacaoSelecionada, setCotacaoSelecionada] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [filtroOrigem, setFiltroOrigem] = useState("todos");
  const [filtroDestino, setFiltroDestino] = useState("todos");
  const [cotacoes, setCotacoes] = useState<Cotacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltrosOpen, setIsFiltrosOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ 
    key: 'id', 
    direction: 'ascending' 
  });

  const fetchCotacoes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/cotacao");
      
      console.log("Dados recebidos do backend:", response.data);
      
      const cotacoesComStatus = response.data.map((cotacao: Cotacao) => ({
        ...cotacao,
        status: cotacao.status || "ABERTA" 
      }));
      
      setCotacoes(cotacoesComStatus);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar cotações:", err);
      setError("Erro ao carregar cotações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCotacoes();
  }, []);

  useEffect(() => {
    if (!showModalCotacao) {
      fetchCotacoes();
    }
  }, [showModalCotacao]);

  const origensUnicas = useMemo(() => {
    const origens = new Set(cotacoes.map(c => c.origem_cidade).filter(Boolean));
    return Array.from(origens).sort();
  }, [cotacoes]);

  const destinosUnicos = useMemo(() => {
    const destinos = new Set(cotacoes.map(c => c.destino_cidade).filter(Boolean));
    return Array.from(destinos).sort();
  }, [cotacoes]);

  const cotacoesFiltradas = useMemo(() => {
    let resultado = [...cotacoes];

    if (searchTerm) {
      resultado = resultado.filter(cotacao =>
        cotacao.id.toString().includes(searchTerm) ||
        cotacao.remetente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotacao.origem_cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cotacao.destino_cidade?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "TODOS") {
      resultado = resultado.filter(c => c.status?.toUpperCase() === statusFilter.toUpperCase());
    }

    if (filtroOrigem !== "todos") {
      resultado = resultado.filter(c => c.origem_cidade === filtroOrigem);
    }

    if (filtroDestino !== "todos") {
      resultado = resultado.filter(c => c.destino_cidade === filtroDestino);
    }

    if (sortConfig.key) {
      resultado.sort((a, b) => {
        let valA: any = a[sortConfig.key];
        let valB: any = b[sortConfig.key];

        if (sortConfig.key === 'total') {
          valA = parseFloat(valA) || 0;
          valB = parseFloat(valB) || 0;
        }

        if (sortConfig.key === 'criado_em') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [cotacoes, searchTerm, statusFilter, filtroOrigem, filtroDestino, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("TODOS");
    setFiltroOrigem("todos");
    setFiltroDestino("todos");
  };

  const handleVerDetalhes = (id: number) => {
    setCotacaoSelecionada(id);
    setShowModalDetalhes(true);
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta cotação?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/cotacao/${id}`);
      alert("Cotação excluída com sucesso!");
      fetchCotacoes();
    } catch (err) {
      console.error("Erro ao excluir cotação:", err);
      alert("Erro ao excluir cotação.");
    }
  };

  const isFiltroAtivo = statusFilter !== "TODOS" || filtroOrigem !== "todos" || filtroDestino !== "todos";

  const SortableHeader = ({ label, columnKey }: { label: string; columnKey: SortKey }) => {
    const icon = sortConfig.key === columnKey 
      ? (sortConfig.direction === 'ascending' ? <FaSortUp /> : <FaSortDown />) 
      : <FaSort />;
    
    return (
      <th onClick={() => requestSort(columnKey)} className="sortable-header">
        {label} {icon}
      </th>
    );
  };

  const getStatusClass = (status: string) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "ABERTA": return "status-aberta";
      case "APROVADA": return "status-aprovada";
      case "CANCELADA": return "status-cancelada";
      case "FINALIZADA": return "status-finalizada";
      default: return "status-default";
    }
  };

  const formatarData = (dataString: string) => {
    console.log("Data na listagem:", dataString);
    
    if (!dataString || dataString === "0000-00-00 00:00:00") return "N/A";
    
    try {
      const data = new Date(dataString.replace(' ', 'T'));
      
      if (isNaN(data.getTime())) {
        return "Data inválida";
      }
      
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      console.error("Erro ao formatar data:", err);
      return "Erro";
    }
  };

  const formatarValor = (valor: number) => {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(valor.toString()));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert-error">
          {error}
          <button className="btn-retry" onClick={fetchCotacoes}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cotacoes-container">
      <div className="controles-wrapper">
        <div className="search-box-wrapper">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por ID, cliente, origem ou destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="header-buttons">
          <button 
            className={`btn-toggle-filtros ${isFiltroAtivo ? 'filtros-ativos' : ''}`}
            onClick={() => setIsFiltrosOpen(!isFiltrosOpen)}
          >
            <FaSlidersH />
            Filtros
          </button>

          <button className="btn-nova-cotacao" onClick={() => setShowModalCotacao(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Nova cotação
          </button>
        </div>
      </div>

      <div className={`filtros-panel-container ${isFiltrosOpen ? 'open' : ''}`}>
        <div className="filtros-panel-content">
          <div className="filtros-header">
            <h4>Opções de Filtro</h4>
            {isFiltroAtivo && (
              <button className="btn-limpar-filtros" onClick={handleResetFilters}>
                <FaTimes />
                Limpar
              </button>
            )}
          </div>
          <div className="filtros-grid">
            <div className="filter-input-group">
              <span className="filter-icon"><FaSync /></span>
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="TODOS">Todos os Status</option>
                <option value="ABERTA">Aberta</option>
                <option value="APROVADA">Aprovada</option>
                <option value="CANCELADA">Cancelada</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>

            <div className="filter-input-group">
              <span className="filter-icon"><FaMapMarkerAlt /></span>
              <select 
                className="filter-select"
                value={filtroOrigem}
                onChange={(e) => setFiltroOrigem(e.target.value)}
              >
                <option value="todos">Todas as Origens</option>
                {origensUnicas.map(origem => (
                  <option key={origem} value={origem}>{origem}</option>
                ))}
              </select>
            </div>

            <div className="filter-input-group">
              <span className="filter-icon"><FaMapMarkerAlt /></span>
              <select 
                className="filter-select"
                value={filtroDestino}
                onChange={(e) => setFiltroDestino(e.target.value)}
              >
                <option value="todos">Todos os Destinos</option>
                {destinosUnicos.map(destino => (
                  <option key={destino} value={destino}>{destino}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="table-info">
        <span>Cotações ({cotacoesFiltradas.length})</span>
        <span className="total-info">Total de cotações: {cotacoes.length}</span>
      </div>

      {cotacoesFiltradas.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma cotação encontrada</p>
          {(searchTerm || isFiltroAtivo) && (
            <button 
              className="btn-clear-filters"
              onClick={() => {
                setSearchTerm("");
                handleResetFilters();
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="cotacoes-table">
            <thead>
              <tr>
                <SortableHeader label="#ID" columnKey="id" />
                <SortableHeader label="CLIENTE" columnKey="remetente" />
                <SortableHeader label="ORIGEM" columnKey="origem_cidade" />
                <SortableHeader label="DESTINO" columnKey="destino_cidade" />
                <SortableHeader label="DATA" columnKey="criado_em" />
                <SortableHeader label="VALOR" columnKey="total" />
                <th>STATUS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {cotacoesFiltradas.map(cotacao => (
                <tr key={cotacao.id}>
                  <td className="td-id">{cotacao.id}</td>
                  <td className="td-cliente">{cotacao.remetente || "N/A"}</td>
                  <td className="td-origem">
                    {cotacao.origem_cidade ? `${cotacao.origem_cidade}/${cotacao.origem_uf}` : "N/A"}
                  </td>
                  <td className="td-destino">
                    {cotacao.destino_cidade ? `${cotacao.destino_cidade}/${cotacao.destino_uf}` : "N/A"}
                  </td>
                  <td className="td-data">{formatarData(cotacao.criado_em)}</td>
                  <td className="td-valor">{formatarValor(cotacao.total)}</td>
                  <td className={`td-status ${getStatusClass(cotacao.status)}`}>
                    {cotacao.status || "ABERTA"}
                  </td>
                  <td className="td-acoes">
                    <button 
                      className="btn-acao btn-ver"
                      onClick={() => handleVerDetalhes(cotacao.id)}
                      title="Ver Detalhes"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="btn-acao btn-excluir"
                      onClick={() => handleExcluir(cotacao.id)}
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ModalCotacaoFrete
        show={showModalCotacao}
        onClose={() => setShowModalCotacao(false)}
        onCotacaoCriada={fetchCotacoes}
      />

      <ModalDetalhesCotacao
        show={showModalDetalhes}
        onClose={() => {
          setShowModalDetalhes(false);
          setCotacaoSelecionada(null);
        }}
        cotacaoId={cotacaoSelecionada}
        onAtualizar={fetchCotacoes}
      />
    </div>
  );
}
