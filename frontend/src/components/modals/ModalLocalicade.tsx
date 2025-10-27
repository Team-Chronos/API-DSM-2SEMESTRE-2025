import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { registrarModalidadeNoHistorico } from "../../services/modalidadeService";
import api from "../../services/api"; 
import "../../css/LocalidadeModal.css";

interface LocalidadeModalProps {
  onClose?: () => void;
}

export const LocalidadeModal = ({ }: LocalidadeModalProps) => {
  const { user } = useAuth();
  const [localidade, setLocalidade] = useState<string>("");
  const [show, setShow] = useState<boolean>(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const ultimaResposta = localStorage.getItem("localidadeData");
    const hoje = new Date().toLocaleDateString();
    if (ultimaResposta !== hoje) {
      setShow(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localidade) {
      setErrorMessage("Por favor, selecione uma opção.");
      return;
    }
    if (!user?.id) {
      setErrorMessage("Usuário não encontrado. Faça login novamente.");
      return;
    }

    setStatus("sending");
    setErrorMessage("");

    try {
      await Promise.all([
        api.post("/colaboradores/localidade", { colaboradorId: user.id, localidade }),
        registrarModalidadeNoHistorico(user.id, localidade)
      ]);

      setStatus("success");
      localStorage.setItem("localidadeData", new Date().toLocaleDateString());

      window.location.reload();
      
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage("Ocorreu um erro ao enviar. Tente novamente.");
    }
  };

  if (!show) return null;

  return (
    
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
     
      <div className="modal-dialog modal-dialog-centered localidade-modal-custom">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Informe sua modalidade de trabalho</h5>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <p>Olá, {user?.nome}! Por favor, selecione como você está trabalhando hoje.</p>

              <div className="radio-options-group">
                <input type="radio" id="presencial" name="local" value="P" checked={localidade === "P"} onChange={(e) => setLocalidade(e.target.value)} />
                <label htmlFor="presencial">Presencial</label>

                <input type="radio" id="remoto" name="local" value="R" checked={localidade === "R"} onChange={(e) => setLocalidade(e.target.value)} />
                <label htmlFor="remoto">Remoto</label>

                <input type="radio" id="outro" name="local" value="O" checked={localidade === "O"} onChange={(e) => setLocalidade(e.target.value)} />
                <label htmlFor="outro">Outro</label>
              </div>

              {status === "success" && <p className="mt-4 text-success fw-bold">Obrigado! Resposta salva com sucesso.</p>}
              {errorMessage && <p className="mt-4 text-danger">{errorMessage}</p>}

            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === "sending" || status === "success"}
              >
                {status === "sending" ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};