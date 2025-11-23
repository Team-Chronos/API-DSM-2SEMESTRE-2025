import { useEffect, useState } from "react";
import { getHistoricoModalidade } from "../../services/modalidadeService";
import { useAuth } from "../../context/AuthContext";
import type { HistoricoModalidade } from "../../utils/tipos";
import { dataHora } from "../../utils/facilidades";
import { formatarDataHora } from "../../utils/formatacoes";
import "../../css/modalidade.css";

export const Modalidade = () => {
  const { user } = useAuth();
  const [historico, setHistorico] = useState<HistoricoModalidade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const carregarHistorico = async () => {
      if (!user?.id) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getHistoricoModalidade(user.id);
        console.log(data);
        setHistorico(data);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
        setError("Não foi possível carregar o histórico. Tente recarregar a página.");
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, [user]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="historico-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando histórico...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="historico-error">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <p>{error}</p>
        </div>
      );
    }

    if (historico.length === 0) {
      return (
        <div className="historico-empty">
          <i className="bi bi-inbox"></i>
          <p>Nenhum registro de modalidade encontrado.</p>
        </div>
      );
    }

    return (
      <div className="historico-modalidade-table">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>ID do Registro</th>
              <th>Modalidade Escolhida</th>
              <th>Data da Resposta</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td>
                  <span className="badge-modalidade">{item.modalidade}</span>
                </td>
                <td>{formatarDataHora(dataHora(item.criado_em))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="historico-modalidade-container">
        <div className="historico-header">
          <h1 className="historico-modalidade-title">Histórico de Modalidades</h1>
        </div>
        <p className="historico-modalidade-info">
          Acompanhe todas as alterações de modalidade realizadas em sua conta.
        </p>
        {renderContent()}
      </div>
    </div>
  );
};
