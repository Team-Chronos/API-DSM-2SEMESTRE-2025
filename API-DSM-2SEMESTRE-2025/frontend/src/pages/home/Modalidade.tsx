import { useEffect, useState } from "react";
import { getHistoricoModalidade } from "../../services/modalidadeService";
import { useAuth } from "../../context/AuthContext";
import type { HistoricoModalidade } from "../../utils/tipos";

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
      return <p className="text-center mt-4">Carregando histórico...</p>;
    }

    if (error) {
      return <div className="alert alert-danger mt-4">{error}</div>;
    }

    if (historico.length === 0) {
      return <p className="text-center mt-4">Nenhum registro de modalidade encontrado.</p>;
    }

    return (
      <div className="table-responsive mt-4">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID do Registro</th>
              <th>Modalidade Escolhida</th>
              <th>Data da Resposta</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.modalidade}</td>
                <td>{new Date(item.data_resposta).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Histórico de Modalidades</h1>
      </div>
      <p>
        Histórico de Modalidade:
      </p>
      
      {renderContent()}
    </div>
  );
};