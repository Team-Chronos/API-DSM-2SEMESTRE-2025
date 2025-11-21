import { useState, useEffect } from "react";
import axios from "axios";
import { ModalCotacaoFrete } from "./CotacaoFrete";

export default function Cotacao() {
  const [showModalCotacao, setShowModalCotacao] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [cotacoes, setCotacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCotacoes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/cotacao");
      
      const cotacoesComStatus = response.data.map(cotacao => ({
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

  const filteredCotacoes = cotacoes.filter(cotacao => {
    const matchesSearch = 
      cotacao.id.toString().includes(searchTerm) ||
      cotacao.remetente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotacao.origem_cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotacao.destino_cidade?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "TODOS" || 
                         cotacao.status?.toUpperCase() === statusFilter.toUpperCase();
    
    return matchesSearch && matchesStatus;
  });

  const statusClass = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "ABERTA": return "bg-warning text-dark";
      case "APROVADA": return "bg-success text-white";
      case "CANCELADA": return "bg-danger text-white";
      case "FINALIZADA": return "bg-primary text-white";
      default: return "bg-secondary text-white";
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return "N/A";
    
    if (dataString.includes('-')) {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR');
    }
    
    return dataString;
  };

  const formatarValor = (valor) => {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(valor));
  };

  if (loading) {
    return (
      <div className="container-fluid bg-light d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid bg-light d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchCotacoes}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light" style={{ minHeight: "100vh" }}>
      <div className="col-md-12 py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <input 
            type="text" 
            className="form-control w-25" 
            placeholder="Buscar por ID, cliente, origem ou destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="d-flex gap-2 align-items-center">
            <div>
              <label className="form-label me-2 mb-0">Status:</label>
              <select 
                className="form-select d-inline-block w-auto"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="TODOS">Todos</option>
                <option value="ABERTA">Aberta</option>
                <option value="APROVADA">Aprovada</option>
                <option value="CANCELADA">Cancelada</option>
                <option value="FINALIZADA">Finalizada</option>
              </select>
            </div>
            <button 
              className="btn btn-outline-primary me-2" 
              onClick={fetchCotacoes}
              title="Recarregar cotações"
            >
              <i className="bi bi-arrow-clockwise"></i> Atualizar
            </button>
            <button className="btn btn-primary" onClick={() => setShowModalCotacao(true)}>
              + Nova cotação
            </button>
          </div>
        </div>
        
        <div className="card p-4" style={{ boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Cotações ({filteredCotacoes.length})</h5>
            <small className="text-muted">
              Total de cotações: {cotacoes.length}
            </small>
          </div>
          
          {filteredCotacoes.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">Nenhuma cotação encontrada</p>
              {(searchTerm || statusFilter !== "TODOS") && (
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("TODOS");
                  }}
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#ID</th>
                    <th>CLIENTE</th>
                    <th>ORIGEM</th>
                    <th>DESTINO</th>
                    <th>DATA</th>
                    <th>VALOR</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCotacoes.map(cotacao => (
                    <tr key={cotacao.id}>
                      <td>
                        <strong>{cotacao.id}</strong>
                      </td>
                      <td>{cotacao.remetente || "N/A"}</td>
                      <td>
                        {cotacao.origem_cidade ? `${cotacao.origem_cidade}/${cotacao.origem_uf}` : "N/A"}
                      </td>
                      <td>
                        {cotacao.destino_cidade ? `${cotacao.destino_cidade}/${cotacao.destino_uf}` : "N/A"}
                      </td>
                      <td>{formatarData(cotacao.created_at)}</td>
                      <td>
                        <strong>{formatarValor(cotacao.total)}</strong>
                      </td>
                      <td>
                        <span className={`badge ${statusClass(cotacao.status)}`}>
                          {cotacao.status || "ABERTA"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ModalCotacaoFrete
        show={showModalCotacao}
        onClose={() => setShowModalCotacao(false)}
        onCotacaoCriada={fetchCotacoes} 
      />
    </div>
  );
}