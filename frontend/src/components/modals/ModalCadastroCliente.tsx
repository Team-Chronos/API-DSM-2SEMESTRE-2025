import { useState, useEffect } from "react"; 
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap"; 
import axios from "axios";
// Verifica se o caminho para formatacoes está correto na sua estrutura
import { formatarTelefone } from "../../utils/formatacoes"; 

interface ModalCadastroClienteProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Define o tipo para o estado do formulário (correspondendo à BD)
interface ClienteFormState {
    nome: string;
    email: string; 
    telefone: string; 
    segmento: string; // <- CORRIGIDO
    cidade: string;   // <- CORRIGIDO
}

// Define o tipo para o payload enviado à API
interface ClientePayload {
    nome: string;
    email: string | null; 
    telefone: string | null; 
    segmento: string;
    cidade: string;
    criadoPor?: number; // Opcional, se for enviar o ID do user
}


export const ModalCadastroCliente = ({show, onClose, onSuccess}: ModalCadastroClienteProps) => {
  // CORRIGIDO: Estado inicial usa os nomes corretos
  const [form, setForm] = useState<ClienteFormState>({
    nome: "",
    email: "",
    telefone: "",
    segmento: "", // <- CORRIGIDO
    cidade: "",   // <- CORRIGIDO
  });
  const [error, setError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState(false); 

  // Limpa o formulário e erros
  function limparForm(){
    setForm({
      nome: "",
      email: "",
      telefone: "",
      segmento: "", // <- CORRIGIDO
      cidade: "",   // <- CORRIGIDO
    });
    setError(null);
  }

  // Limpa ao fechar
  useEffect(() => {
      if (!show) {
          limparForm();
      }
  }, [show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "telefone") {
      setForm(prevForm => ({ ...prevForm, [name]: formatarTelefone(value) }));
    } else {
      setForm(prevForm => ({ ...prevForm, [name]: value as string })); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    setIsLoading(true); 

    try {
      // Cria o payload com os nomes corretos esperados pelo backend
      const payload: ClientePayload = {
        nome: form.nome,
        email: form.email || null, // Envia null se vazio
        telefone: form.telefone.replace(/\D/g, '') || null, // Remove formatação, envia null se vazio
        segmento: form.segmento, // <- CORRIGIDO
        cidade: form.cidade,     // <- CORRIGIDO
        // criadoPor: 1 // Adicione se o backend esperar (e ajuste o valor)
      };

      console.log("Enviando payload para cadastrar cliente:", payload); 

      await axios.post("http://localhost:3000/api/clientes", payload);
      onSuccess(); 
      onClose();   
    } catch (err: any) {
      console.error("Erro ao cadastrar cliente:", err.response || err.message || err);
      // Mostra a mensagem de erro vinda do backend (ex: "Nome, Segmento e Cidade são obrigatórios.")
      setError(err.response?.data?.mensagem || "Erro desconhecido ao cadastrar cliente."); 
    } finally {
        setIsLoading(false); 
    }
  };

  return (
    <Modal show={show} centered onHide={onClose}> 
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Cliente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Campos Nome, Email, Telefone mantidos */}
          <Form.Group className="mb-3">
            <Form.Label>Nome*</Form.Label>
            <Form.Control type="text" name="nome" placeholder="Nome do Cliente" value={form.nome} onChange={handleChange} required disabled={isLoading}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} autoComplete="off" disabled={isLoading}/>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control type="tel" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(99) 99999-9999" maxLength={15} disabled={isLoading}/>
          </Form.Group>

          {/* CORRIGIDO: Campo Segmento */}
          <Form.Group className="mb-3">
            <Form.Label>Segmento*</Form.Label>
            <Form.Control
              type="text"
              name="segmento" // <- CORRIGIDO (era segmento_atuacao)
              value={form.segmento} // <- CORRIGIDO
              onChange={handleChange}
              placeholder="Ex: Varejo, Indústria, Logística"
              required
              disabled={isLoading}
            />
          </Form.Group>
          
          {/* CORRIGIDO: Campo Cidade */}
          <Form.Group className="mb-3">
            <Form.Label>Cidade*</Form.Label>
            <Form.Control
              type="text"
              name="cidade" // <- CORRIGIDO (era endereco)
              value={form.cidade} // <- CORRIGIDO
              onChange={handleChange}
              placeholder="Cidade do cliente" // Placeholder atualizado
              required
              disabled={isLoading}
            />
          </Form.Group>

          {/* REMOVIDOS: Campos Endereço completo, Atividade, Departamento Responsável */}

        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner as="span" size="sm" /> : "Cadastrar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

