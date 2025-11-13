import { useState } from "react"
import "../../../css/operacional.css"
import { ModalChecklistVeiAgreg } from "../../../components/modals/ModalChecklistVeiAgreg"
import { useNavigate } from "react-router-dom"
import { ModalMensagem } from "../../../components/modals/ModalMensagem"
import { ModalChecklistPredios } from "../../../components/modals/ModalChecklistPredios"
import ChecklistPage  from "../../../components/modals/ModalChecklistPredial"

export function Operacional(){
  const [ showModalVeiAgreg, setShowModalVeiAgreg ] = useState(false)
  const [ showModalPredial, setShowModalPredial ] = useState(false)
  const [showModalChecklistPage, setShowModalChecklistPage] = useState(false)
  const [showMessage, setShowMessage] = useState(false);
  const [tituloMessage, setTituloMessage] = useState<"Sucesso" | "Erro" | "Aviso">("Aviso");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate()

  return(
    <>
      <div className={`historicoChecklists d-flex mb-4 py-3 justify-content-center`} onClick={() => navigate("/historicoCheckLists")}>Visualizar Histórico</div>
      <div className={`checklists d-flex flex-column row-gap-4`}>
        <div role="button" className={`btn-azul checklist py-2 ps-4 pe-3`} onClick={() => setShowModalVeiAgreg(true)}>Checklist de veículo agregado</div>
        <div role="button" className={`btn-azul checklist py-2 ps-4 pe-3`} onClick={() => setShowModalPredial(true)}>Checklist de fechamento predial</div>
        <div role="button" className={`btn-azul checklist py-2 ps-4 pe-3`} onClick={() => setShowModalChecklistPage(true)}>Gestão de Checklist Predial</div>
      </div>
      
      <ModalChecklistVeiAgreg
        show={showModalVeiAgreg}
        onClose={() => {
          setShowModalVeiAgreg(false)
        }}
        onSucces={() => {
          setTituloMessage("Sucesso");
          setShowMessage(true)
        }}
        onErro={() => {
          setTituloMessage("Erro")
          setShowMessage(true)
        }}
        setMensagem={setMensagem}
      />

      <ModalChecklistPredios
        show={showModalPredial}
        onClose={() => {
          setShowModalPredial(false)
        }}
        onSucces={() => {
          setTituloMessage("Sucesso");
          setShowMessage(true)
        }}
        onErro={() => {
          setTituloMessage("Erro")
          setShowMessage(true)
        }}
        setMensagem={setMensagem}
      />

      {/* Modal para o ChecklistPage */}
      {showModalChecklistPage && (
        <div className="modal-backdrop show">
          <div className="modal d-block">
            <div className="modal-dialog modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Gestão de Checklist Predial</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModalChecklistPage(false)}
                  ></button>
                </div>
                <div className="modal-body" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                  <ChecklistPage />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalMensagem 
        show={showMessage}
        titulo={tituloMessage}
        mensagem={mensagem}
        onClose={() => setShowMessage(false)}
      />
    </>
  )
}