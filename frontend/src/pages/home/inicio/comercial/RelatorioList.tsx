import { useEffect, useState } from "react";
import axios, { type AxiosRequestConfig } from "axios";
import { ModalGerarRelatorio } from "../../../../components/modals/ModalGerarRelatorio";
import { useAuth } from "../../../../context/AuthContext";
import "../../../../css/relatorio.css";
import api from "../../../../services/api";

interface Relatorio {
  ID_Relatorio: number;
  Nome_Relatorio: string;
  Tipo_Relatorio: string;
  Data_Geracao: string;
  Gerado_Por: string;
}

export const RelatorioList = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGerarRelatorioModal, setShowGerarRelatorioModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const { user } = useAuth();
  
  if (!user) return null;

  const carregarRelatorios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get("/relatorios");
      setRelatorios(res.data);
    } catch (err: any) {
      console.error("Erro ao carregar relatórios:", err);
      setError("Não foi possível carregar a lista de relatórios.");
      setRelatorios([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarRelatorios();
  }, []);

  const handleCloseGerarRelatorioModal = () => {
    setShowGerarRelatorioModal(false);
  };

  const handleSuccessGerarRelatorio = () => {
    setShowGerarRelatorioModal(false);
    carregarRelatorios();
  };

  const handleDownload = async (reportId: number, filename: string) => {
    setDownloadingId(reportId);
    setError(null);
    try {
      const config: AxiosRequestConfig = { responseType: "blob" };
      const response = await api.get(
        `/relatorios/download/${filename}`,
        config
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (downloadError: any) {
      console.error("Erro ao descarregar o relatório:", downloadError);
      if (downloadError.response && downloadError.response.status === 404) {
        setError("Não foi possível descarregar: Ficheiro não encontrado no servidor.");
      } else {
        setError("Erro ao descarregar o relatório.");
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handleExcluir = async (reportId: number) => {
    setDeletingId(reportId);
    setConfirmingDeleteId(null);
    setError(null);
    try {
      await api.delete(`/relatorios/${reportId}`);
      carregarRelatorios();
    } catch (err: any) {
      console.error("Erro ao excluir o relatório:", err);
      if (err.response && err.response.status === 404) {
        setError("Não foi possível excluir: Relatório não encontrado.");
      } else {
        setError("Erro ao excluir o relatório.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4} className="relatorio-loading-cell">
            <div className="relatorio-spinner"></div>
            <span>Carregando...</span>
          </td>
        </tr>
      );
    }

    if (error && relatorios.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="relatorio-error-cell">
            <i className="bi bi-exclamation-triangle"></i>
            <span>{error}</span>
          </td>
        </tr>
      );
    }

    if (relatorios.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="relatorio-empty-cell">
            <i className="bi bi-inbox"></i>
            <span>Nenhum relatório gerado ainda.</span>
          </td>
        </tr>
      );
    }

    return relatorios.map((r) => (
      <tr key={r.ID_Relatorio}>
        <td>{r.Nome_Relatorio}</td>
        <td>
          <span className="relatorio-tipo-badge">{r.Tipo_Relatorio}</span>
        </td>
        <td>{new Date(r.Data_Geracao).toLocaleString("pt-BR")}</td>
        <td className="relatorio-acoes">
          {confirmingDeleteId === r.ID_Relatorio ? (
            <div className="relatorio-confirm-group">
              <button
                className="relatorio-btn relatorio-btn-confirmar"
                onClick={() => handleExcluir(r.ID_Relatorio)}
                disabled={deletingId === r.ID_Relatorio}
              >
                {deletingId === r.ID_Relatorio ? (
                  <span className="relatorio-spinner-sm"></span>
                ) : (
                  "Confirmar"
                )}
              </button>
              <button
                className="relatorio-btn relatorio-btn-cancelar"
                onClick={() => setConfirmingDeleteId(null)}
                disabled={deletingId === r.ID_Relatorio}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="relatorio-action-group">
              <button
                className="relatorio-btn relatorio-btn-download"
                disabled={downloadingId === r.ID_Relatorio || deletingId !== null}
                onClick={() => handleDownload(r.ID_Relatorio, r.Nome_Relatorio)}
              >
                {downloadingId === r.ID_Relatorio ? (
                  <span className="relatorio-spinner-sm"></span>
                ) : (
                  <>
                    <i className="bi bi-download"></i> Baixar
                  </>
                )}
              </button>
              <button
                className="relatorio-btn relatorio-btn-excluir"
                disabled={downloadingId !== null || deletingId !== null}
                onClick={() => setConfirmingDeleteId(r.ID_Relatorio)}
              >
                <i className="bi bi-trash"></i> Excluir
              </button>
            </div>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="relatorio-container">
      <div className="relatorio-header">
        <div className="relatorio-title-group">
          <h3 className="relatorio-title">Relatórios Gerados</h3>
        </div>
        <button
          className="relatorio-btn relatorio-btn-novo"
          onClick={() => setShowGerarRelatorioModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Gerar Novo Relatório
        </button>
      </div>

      {error && relatorios.length > 0 && (
        <div className="relatorio-alert">
          <i className="bi bi-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="relatorio-table-wrapper">
        <table className="relatorio-table">
          <thead>
            <tr>
              <th>Nome Ficheiro</th>
              <th>Tipo</th>
              <th>Data Geração</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>{renderContent()}</tbody>
        </table>
      </div>

      <ModalGerarRelatorio
        setor={user.setor}
        show={showGerarRelatorioModal}
        onClose={handleCloseGerarRelatorioModal}
        onSuccess={handleSuccessGerarRelatorio}
      />
    </div>
  );
};
