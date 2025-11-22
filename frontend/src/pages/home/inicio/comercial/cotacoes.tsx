import { useState } from 'react';
import '../../../../css/cotacoes.css';

interface Cotacao {
  id: string;
  cliente: string;
  data: string;
  valor: string;
  status: 'ABERTA' | 'APROVADA' | 'CANCELADA';
}

export const CotacoesList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const cotacoes: Cotacao[] = [
    { id: '345678', cliente: 'EMPRESA A', data: '05/11/2025', valor: 'R$1200,00', status: 'ABERTA' },
    { id: '456789', cliente: 'EMPRESA B', data: '05/11/2025', valor: 'R$1200,00', status: 'APROVADA' },
    { id: '567890', cliente: 'EMPRESA C', data: '05/11/2025', valor: 'R$1200,00', status: 'CANCELADA' },
    { id: '678901', cliente: 'EMPRESA D', data: '05/11/2025', valor: 'R$1200,00', status: 'ABERTA' },
    { id: '789012', cliente: 'EMPRESA E', data: '05/11/2025', valor: 'R$1200,00', status: 'CANCELADA' },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ABERTA':
        return 'status-aberta';
      case 'APROVADA':
        return 'status-aprovada';
      case 'CANCELADA':
        return 'status-cancelada';
      default:
        return '';
    }
  };

  return (
    <div className="cotacoes-container">
      <div className="cotacoes-header">
        <div className="search-box">
          <svg className="search-icon-left" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" strokeWidth="2"/>
          </svg>
          <input
            type="text"
            placeholder=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="header-buttons">
          <button className="btn-nova-cotacao">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Nova cotação
          </button>
          <button className="btn-filtros">
            Filtros
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="cotacoes-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>CLIENTE</th>
              <th>DATA</th>
              <th>VALOR</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {cotacoes.map((cotacao) => (
              <tr key={cotacao.id}>
                <td className="td-id">{cotacao.id}</td>
                <td className="td-cliente">{cotacao.cliente}</td>
                <td className="td-data">{cotacao.data}</td>
                <td className="td-valor">{cotacao.valor}</td>
                <td className={`td-status ${getStatusClass(cotacao.status)}`}>
                  {cotacao.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CotacoesList;
