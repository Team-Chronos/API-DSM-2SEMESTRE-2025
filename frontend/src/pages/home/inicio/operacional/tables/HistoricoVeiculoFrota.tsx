import { useEffect, useState } from "react"
import api from "../../../../../services/api"
import { formatarDataHora } from "../../../../../utils/formatacoes"
import { ModalVerChecklistVeiFrota } from "../../../../../components/modals/ModalVerChecklistVeiFrota"

export function HistoricoVeiculoFrota(){
  const [ historico, setHistorico ] = useState<any>([])
  const [ showModal, setShowModal ] = useState(false)
  const [ idSelecionado, setIdSelecionado ] = useState<number | null>(null)

  async function carregarHistorico(){
    try{
      const result = await api.get("/checklistVeiculoFrota")
      setHistorico(result.data)
    } catch (err) {
      console.error(`Erro ao carregar histórico: `, err)
    }
  }

  useEffect(() => {
    carregarHistorico()
  }, [])

  return(
    <>
      <div className={`table-responsive`}>
        <table className={`table`}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Respondido em</th>
              <th>Respondido por</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((item: any) => (
              <tr key={item.id_cvf}>
                <td>{item.id_cvf}</td>
                <td>{formatarDataHora(item.criado_em)}</td>
                <td>{item.nome_motorista}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setIdSelecionado(item.id_cvf)
                      setShowModal(true)
                    }}
                  >
                    Ver checklist
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ModalVerChecklistVeiFrota
        show={showModal}
        onClose={() => setShowModal(false)}
        idChecklist={idSelecionado}
      />
    </>
  )
}