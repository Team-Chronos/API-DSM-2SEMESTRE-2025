import { useState } from "react"
import "../../../css/operacional.css"
import { ModalChecklistVeiAgreg } from "../../../components/modals/ModalChecklistVeiAgreg"

export function Operacional(){
  const [ showModalVeiAgreg, setShowModalVeiAgreg ] = useState(false)

  return(
    <>
      <div className={`checklists d-flex flex-column row-gap-4`}>
        <div role="button" className={`btn-azul checklist py-2 ps-4 pe-3`} onClick={() => setShowModalVeiAgreg(true)}>Checklist de veículo agregado</div>
      </div>
      
      <ModalChecklistVeiAgreg
        show={showModalVeiAgreg}
        onClose={() => {
          setShowModalVeiAgreg(false)
        }}
      />
    </>
  )
}