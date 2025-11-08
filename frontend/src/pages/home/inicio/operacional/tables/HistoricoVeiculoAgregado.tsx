import { useEffect, useState } from "react"
import api from "../../../../../services/api"
import { formatarDataHora } from "../../../../../utils/formatacoes"
import { ModalVerChecklistVeiAgreg } from "../../../../../components/modals/ModalVerChecklistVeiAgreg"

export function HistoricoVeiculoAgregado(){
  const [ historico, setHistorico ] = useState<any>([])
  const [ showModal, setShowModal ] = useState(false)
  const [ idSelecionado, setIdSelecionado ] = useState<number | null>(null)

  async function carregarHistorico(){
    try{
      const result = await api.get("/checklistVeiculoAgregado")
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
              <tr key={item.ID_cva}>
                <td>{item.ID_cva}</td>
                <td>{formatarDataHora(item.criado_em)}</td>
                <td>{!!item.Nome_Col ? item.Nome_Col : item.nome_responsavel_vistoria}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setIdSelecionado(item.ID_cva)
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
      
      <ModalVerChecklistVeiAgreg
        show={showModal}
        onClose={() => setShowModal(false)}
        idChecklist={idSelecionado}
      />
    </>
  )
}