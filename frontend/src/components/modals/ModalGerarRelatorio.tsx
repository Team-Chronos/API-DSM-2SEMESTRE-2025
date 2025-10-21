import { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

interface ModalGerarRelatorioProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalGerarRelatorio = ({ show, onClose, onSuccess }: ModalGerarRelatorioProps) => {
  const [tipoRelatorio, setTipoRelatorio] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGerarRelatorio = async () => {
    if (!tipoRelatorio) {
      setError("Por favor, selecione um tipo de relatório.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("http://localhost:3000/api/relatorios/gerar", { tipo: tipoRelatorio }, {
        responseType: 'blob',
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = 'relatorio.xlsx';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccessMessage("Relatório gerado e download iniciado com sucesso!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erro ao gerar relatório:", err);
      if (err.response && err.response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function() {
          try {
            const errorData = JSON.parse(reader.result as string);
            setError(errorData.message || "Erro desconhecido ao gerar relatório.");
          } catch (e) {
            setError("Erro ao gerar relatório. Resposta inválida do servidor.");
          }
        };
        reader.readAsText(err.response.data);
      } else {
        setError(err.response?.data?.message || "Ocorreu um erro ao gerar o relatório.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setTipoRelatorio('');
    setError(null);
    setSuccessMessage(null);
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gerar Novo Relatório</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        <Form>
          <Form.Group controlId="formTipoRelatorio" className="mb-3">
            <Form.Label>Selecione o Tipo de Relatório</Form.Label>
            <Form.Control
              as="select"
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Selecione...</option>
              <option value="interacoes">Relatório de Interações</option>
              <option value="vendas">Relatório de Vendas</option>
              <option value="clientes">Relatório de Clientes</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGerarRelatorio} disabled={isLoading || !tipoRelatorio}>
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Gerando...</span>
            </>
          ) : (
            "Gerar e Baixar"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
