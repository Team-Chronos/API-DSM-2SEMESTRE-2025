import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner, Alert } from "react-bootstrap";
import { ModalGerarRelatorio } from "../../../../components/modals/ModalGerarRelatorio";

interface Relatorio {
  ID_Relatorio: number;
  Nome_Relatorio: string;
  Tipo_Relatorio: string;
  Data_Geracao: string;
  Gerado_Por: string;
  URL_Relatorio?: string;
}

export const RelatorioList = () => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGerarRelatorioModal, setShowGerarRelatorioModal] = useState(false);

  const carregarRelatorios = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await axios.get("http://localhost:3000/api/relatorios");
      setRelatorios(res.data);
    } catch (err) {
      console.error("Erro ao carregar relatórios:", err);
      setError("Não foi possível carregar a lista de relatórios. Tente novamente mais tarde.");
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


  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={5} className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">A carregar...</span>
            </Spinner>
          </td>
        </tr>
      );
    }

    if (error && relatorios.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center">
            <Alert variant="danger" className="m-0">{error}</Alert>
          </td>
        </tr>
      );
    }

    if (relatorios.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="text-center">
            Nenhum relatório encontrado.
          </td>
        </tr>
      );
    }

    return relatorios.map((r) => (
      <tr key={r.ID_Relatorio}>
        <td>{r.Nome_Relatorio}</td>
        <td>{r.Tipo_Relatorio}</td>
        <td>{new Date(r.Data_Geracao).toLocaleString("pt-BR")}</td>
        <td>{r.Gerado_Por}</td>
        <td>
          {r.URL_Relatorio ? (
            <Button
              variant="outline-success"
              size="sm"
              href={r.URL_Relatorio}
              target="_blank"
              
            >
              Baixar
            </Button>
          ) : (
            <span className="text-muted">N/D</span>
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

      {error && relatorios.length > 0 && <Alert variant="danger">{error}</Alert>}


      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nome do Relatório</th>
            <th>Tipo</th>
            <th>Data de Geração</th>
            <th>Gerado Por</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {renderContent()}
        </tbody>
      </Table>

      <ModalGerarRelatorio
        show={showGerarRelatorioModal}
        onClose={handleCloseGerarRelatorioModal}
        onSuccess={handleSuccessGerarRelatorio}
      />
    </div>
  );
};

