import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';

interface ModalGerarRelatorioProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ModalGerarRelatorio = ({ show, onClose, onSuccess }: ModalGerarRelatorioProps) => {
  const [tipoRelatorio, setTipoRelatorio] = useState<string>('');
  const [dataInicio, setDataInicio] = useState<string>('');
  const [dataFim, setDataFim] = useState<string>('');
  const [cidade, setCidade] = useState<string>('');
  const [segmento, setSegmento] = useState<string>('');
  
  const [cidades, setCidades] = useState<string[]>([]); 
  const [segmentos, setSegmentos] = useState<string[]>([]);
  const [isLoadingCidades, setIsLoadingCidades] = useState(false); 
  const [isLoadingSegmentos, setIsLoadingSegmentos] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (show) { 
  
        setIsLoadingCidades(true); 
        setError(null); 
        try {
          const resCidades = await axios.get("http://localhost:3000/api/clientes/cidades"); 
          if (Array.isArray(resCidades.data)) {
            setCidades(resCidades.data);
          } else {
             console.error("Resposta cidades não é array:", resCidades.data);
             setError("Erro ao carregar cidades.");
             setCidades([]);
          }
        } catch (err: any) {
          console.error("Erro ao buscar cidades:", err.response || err.message || err); 
          setError("Não foi possível carregar cidades."); 
          setCidades([]); 
        } finally {
          setIsLoadingCidades(false); 
        }

        setIsLoadingSegmentos(true);
        try {
          const resSegmentos = await axios.get("http://localhost:3000/api/clientes/segmentos");
           if (Array.isArray(resSegmentos.data)) {
             setSegmentos(resSegmentos.data);
           } else {
              console.error("Resposta segmentos não é array:", resSegmentos.data);
              setError(prev => prev ? `${prev} Erro ao carregar segmentos.` : "Erro ao carregar segmentos.");
              setSegmentos([]);
           }
        } catch (err: any) {
          console.error("Erro ao buscar segmentos:", err.response || err.message || err);
          setError(prev => prev ? `${prev} Não foi possível carregar segmentos.` : "Não foi possível carregar segmentos."); 
          setSegmentos([]); 
        } finally {
          setIsLoadingSegmentos(false);
        }
      }
    };

    fetchData(); 
  }, [show]); 

  const handleGerarRelatorio = async () => {

     if (!tipoRelatorio) {
      setError("Por favor, selecione um tipo de relatório.");
      return;
    }

    setIsLoading(true);
    setError(null); 

    const payload = {
      tipo: tipoRelatorio,
      dataInicio: dataInicio || null, 
      dataFim: dataFim || null,    
      cidade: cidade || null,       
      segmento: segmento || null,   
    };
    console.log("Enviando payload para gerar relatório:", payload); 

    try {
      const response = await axios.post("http://localhost:3000/api/relatorios/gerar", payload, {
        responseType: 'blob',
      });
      console.log("Relatório gerado, status:", response.status);

      const contentDisposition = response.headers['content-disposition'];
      let filename = `relatorio-${tipoRelatorio}.xlsx`; 
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      console.log("Iniciando download do ficheiro:", filename);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onSuccess(); 
      handleCloseModal(); 
      
    } catch (err: any) {
      console.error("Erro ao gerar relatório:", err.response || err.message || err); 
      if (err.response) {
          if (err.response.data instanceof Blob) {
              const reader = new FileReader();
              reader.onload = function() {
                  try {
                      const errorData = JSON.parse(reader.result as string);
                      setError(errorData.message || "Erro desconhecido ao gerar relatório.");
                  } catch (e) {
                       setError("Erro ao gerar relatório. Resposta inválida.");
                  }
              };
              reader.onerror = () => setError("Erro ao ler a resposta de erro.");
              reader.readAsText(err.response.data);
          } else if (err.response.data?.message) {
              setError(err.response.data.message);
          } else {
               setError(`Erro ${err.response.status} ao gerar o relatório.`);
          }
      } else {
           setError("Erro de rede ao gerar o relatório.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
     setTipoRelatorio('');
    setDataInicio('');
    setDataFim('');
    setCidade('');
    setSegmento('');
    setError(null); 
    onClose(); 
  };

  return (
    <Modal show={show} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Gerar Novo Relatório</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>} 
        
        <Form>
          <Form.Group controlId="formTipoRelatorio" className="mb-3">
            <Form.Label>Selecione o Tipo</Form.Label>
            <Form.Control as="select" value={tipoRelatorio} onChange={(e) => setTipoRelatorio(e.target.value)} disabled={isLoading}>
              <option value="">Selecione...</option>
              <option value="interacoes">Interações</option>
              <option value="vendas">Vendas (Clientes Finalizados)</option>
              <option value="clientes">Clientes</option>
            </Form.Control>
          </Form.Group>

          <hr />
          <p className="text-muted">Filtros (Opcional)</p>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formDataInicio" className="mb-3">
                <Form.Label>Data Início</Form.Label>
                <Form.Control type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} disabled={isLoading} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formDataFim" className="mb-3">
                <Form.Label>Data Fim</Form.Label>
                <Form.Control type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} disabled={isLoading} />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group controlId="formCidade" className="mb-3">
                <Form.Label>Cidade</Form.Label>
                <Form.Control 
                  as="select" 
                  value={cidade} 
                  onChange={(e) => setCidade(e.target.value)} 
                  disabled={isLoading || isLoadingCidades} 
                >
                  <option value="">{isLoadingCidades ? 'A carregar...' : 'Todas as Cidades'}</option>
                  {!isLoadingCidades && cidades.map((c) => ( 
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Control>
                {isLoadingCidades && <Spinner size="sm" className="ms-2" />}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formSegmento" className="mb-3">
                <Form.Label>Segmento</Form.Label>
                <Form.Control 
                    as="select" 
                    value={segmento} 
                    onChange={(e) => setSegmento(e.target.value)} 
                    disabled={isLoading || isLoadingSegmentos}
                >
                   <option value="">{isLoadingSegmentos ? 'A carregar...' : 'Todos os Segmentos'}</option> 
                   {!isLoadingSegmentos && segmentos.map((s) => (
                     <option key={s} value={s}>
                       {s}
                     </option>
                   ))}
                </Form.Control>
                 {isLoadingSegmentos && <Spinner size="sm" className="ms-2" />} 
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleGerarRelatorio} disabled={isLoading || isLoadingCidades || isLoadingSegmentos || !tipoRelatorio}> 
          {isLoading ? (
            <><Spinner size="sm" /> Gerando...</>
          ) : (
            "Gerar e Baixar"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

