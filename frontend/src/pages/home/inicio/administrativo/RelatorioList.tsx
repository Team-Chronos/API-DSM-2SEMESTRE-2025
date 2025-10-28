import { useEffect, useState } from "react";
import axios, { type AxiosRequestConfig } from "axios";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { ModalGerarRelatorio } from "../../../../components/modals/ModalGerarRelatorio"; 
import { useAuth } from "../../../../context/AuthContext";

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
  const { user } = useAuth()
  if (!user) return null

  const carregarRelatorios = async () => {
    setIsLoading(true);
    setError(null); 
    try {

      const res = await axios.get("http://localhost:3000/api/relatorios"); 
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
      const config: AxiosRequestConfig = { responseType: 'blob' };
      const response = await axios.get(`http://localhost:3000/api/relatorios/download/${filename}`, config);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
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
      await axios.delete(`http://localhost:3000/api/relatorios/${reportId}`); 
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
        <tr><td colSpan={4} className="text-center"><Spinner /></td></tr>
      );
    }

    if (error && relatorios.length === 0) { 
      return (
        <tr><td colSpan={4} className="text-center"><Alert variant="danger">{error}</Alert></td></tr>
      );
    }

    if (relatorios.length === 0) {
      return (
        <tr><td colSpan={4} className="text-center">Nenhum relatório gerado ainda.</td></tr>
      );
    }

    return relatorios.map((r) => (
      <tr key={r.ID_Relatorio}>
        <td>{r.Nome_Relatorio}</td>
        <td>{r.Tipo_Relatorio}</td>
        <td>{new Date(r.Data_Geracao).toLocaleString("pt-BR")}</td>
        <td>
          {confirmingDeleteId === r.ID_Relatorio ? (
            <>
              <Button variant="danger" size="sm" onClick={() => handleExcluir(r.ID_Relatorio)} disabled={deletingId === r.ID_Relatorio}>
                {deletingId === r.ID_Relatorio ? <Spinner size="sm" /> : "Confirmar"}
              </Button>
              <Button variant="secondary" size="sm" className="ms-2" onClick={() => setConfirmingDeleteId(null)} disabled={deletingId === r.ID_Relatorio}>
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline-success" size="sm" disabled={downloadingId === r.ID_Relatorio || deletingId !== null} onClick={() => handleDownload(r.ID_Relatorio, r.Nome_Relatorio)}>
                {downloadingId === r.ID_Relatorio ? <Spinner size="sm" /> : "Baixar"}
              </Button>
              <Button variant="outline-danger" size="sm" className="ms-2" disabled={downloadingId !== null || deletingId !== null} onClick={() => setConfirmingDeleteId(r.ID_Relatorio)}>
                Excluir
              </Button>
            </>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Relatórios Gerados</h3>
        <Button onClick={() => setShowGerarRelatorioModal(true)}>
          + Gerar Novo Relatório
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>} 

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome Ficheiro</th>
            <th>Tipo</th>
            <th>Data Geração</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {renderContent()}
        </tbody>
      </Table>

      <ModalGerarRelatorio
        setor={user.setor}
        show={showGerarRelatorioModal}
        onClose={handleCloseGerarRelatorioModal}
        onSuccess={handleSuccessGerarRelatorio}
      />
    </div>
  );
};

