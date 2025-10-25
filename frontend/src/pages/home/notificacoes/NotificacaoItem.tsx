import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

interface Props {
  data: any;
  onAceitar: () => void;
  onRecusar: (justificativa: string) => void;
  onConcluir: () => void;
}

export const NotificacaoItem: React.FC<Props> = ({
  data,
  onAceitar,
  onRecusar,
  onConcluir,
}) => {
  const { user } = useAuth()
  const [showDetails, setShowDetails] = useState(false);
  const [showJustificativa, setShowJustificativa] = useState(false);
  const [justificativa, setJustificativa] = useState("");
  const [justificativaSalva, setJustificativaSalva] = useState("");
  const [erroJustificativa, setErroJustificativa] = useState(false);

  const dataFormatada = new Date(data.Data_Evento).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  async function loadJustificativa() {
    if (!user || !data) return
    try{
      const partEvento = await axios.get(`http://localhost:3000/api/participacaoEventos/${user.id}/${data.ID_Evento}`)
      setJustificativaSalva(partEvento.data.justificativa)
    }
    catch (err){
      console.error("Erro ao carregar justificativa salva: " + err)
    }
  }

  useEffect(() => {
    loadJustificativa();
  }, [])

  const handleRecusar = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (justificativa.trim() === "") {
      setErroJustificativa(true);
      return;
    }

    setErroJustificativa(false);
    onRecusar(justificativa.trim());
    setJustificativa("");
    setShowJustificativa(false);
  };

  const podeInteragir = data.ID_Status === 1 || data.ID_Status === 2;

  const getStatusClass = (status: number) => {
    switch (status) {
      case 2:
        return "accept";
      case 3:
        return "reject";
      case 4:
        return "concluded";
      default:
        return "";
    }
  };

  return (
    <div
      id={`evento-${data.ID_Evento}`}
      className={`notification py-2 d-flex flex-row card ${!podeInteragir ? "inactive" : ""} ${getStatusClass(data.ID_Status)}`}
      onClick={() => setShowDetails(!showDetails)}
    >
      <i className={ `bi bi-bell icon px-3 pt-3 ${getStatusClass(data.ID_Status)}`}></i>
      <div className="content pt-2">
        <strong>{data.Nome_Evento}</strong>
        <p>
          Data: {dataFormatada} | Duração: {data.Duracao_Evento}
        </p>

        {showDetails && (
          <div className="details">
            <p>{data.Descricao}</p>

            {data.Local_Evento.startsWith("http") ? (
              <a href={data.Local_Evento} target="_blank" rel="noreferrer">
                {data.Local_Evento}
              </a>
            ) : (
              <div>{data.Local_Evento}</div>
            )}


            {
            data.ID_Status === 3 && justificativaSalva && (
              <div className="mt-3">
                <strong>Motivo da recusa:</strong>
                <p className="mb-0">{justificativaSalva}</p>
              </div>
            )}

            {podeInteragir && (
              <div className="buttons">
                <button
                  className="btn-confirmar"
                  onClick={(e) => {
                    e.stopPropagation();
                    {data.ID_Status === 1 ? (onAceitar()) : (onConcluir())}
                  }}
                >
                  {data.ID_Status === 1 ? ("Aceitar") : (
                    <>
                      Concluir Evento
                      <i className="bi bi-check-circle ps-2"></i>
                    </>
                  )}
                </button>
                <button
                  className="btn-recusar"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowJustificativa(!showJustificativa);
                  }}
                >
                  Recusar
                </button>
              </div>
            )}

            {showJustificativa && (
              <div className="justificativa">
                <textarea
                  placeholder="Digite sua justificativa..."
                  value={justificativa}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    setJustificativa(e.target.value);
                    if (erroJustificativa && e.target.value.trim() !== "")
                      setErroJustificativa(false);
                  }}
                  className={erroJustificativa ? "erro" : ""}
                />
                <button className="send" onClick={handleRecusar}>
                  <i className="bi bi-send"></i>
                </button>
              </div>
            )}

            {erroJustificativa && (
              <p className="text-danger mt-1">Digite uma justificativa antes de enviar.</p>
            )}

            {data.ID_Status === 4 && (
              <p className="text-success mt-2 fw-bold mt-3">
                Concluído <i className="bi bi-check-circle ps-1"></i>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};