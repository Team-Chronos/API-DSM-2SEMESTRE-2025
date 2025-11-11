import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import { formatarDataHora } from "../../../../../utils/formatacoes";
import { ModalVerChecklistPredial } from "../../../../../components/modals/ModalVerPredial";

export function HistoricoFechamentoPredial() {
  const [historico, setHistorico] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState<number | null>(null);

  async function carregarHistorico() {
    try {
      const result = await api.get("/checklistPredios");
      setHistorico(result.data);
    } catch (err) {
      console.error(`Erro ao carregar histórico: `, err);
    }
  }

  useEffect(() => {
    carregarHistorico();
  }, []);

  return (
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
              <tr key={item.CheckPredio}>
                <td>{item.CheckPredio}</td>
                <td>{formatarDataHora(item.DataPredio)}</td>
                <td>{item.NomeFuncPredio}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setIdSelecionado(item.CheckPredio);
                      setShowModal(true);
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

      { 
      <ModalVerChecklistPredial
        show={showModal}
        onClose={() => setShowModal(false)}
        idChecklist={idSelecionado}
      /> 
      }
    </>
  );
}
