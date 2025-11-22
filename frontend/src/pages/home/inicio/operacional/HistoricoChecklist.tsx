import { useState } from "react"
import type { HistoricoTabs } from "../../../../utils/tipos"
import "../../../../css/historicoChecklist.css"
import { HistoricoVeiculoAgregado } from "./tables/HistoricoVeiculoAgregado"
import { HistoricoFechamentoPredial } from "./tables/HistoricoFechamentoPredial"
import { HistoricoVeiculoFrota } from "./tables/HistoricoVeiculoFrota"

export function HistoricoChecklist(){
  const [ activeTab, setActiveTab ] = useState<HistoricoTabs>("Veículo Agregado")

  return(
    <>
      <div className={``} id="historicoChecklist">
        <div className={`historicoTabs`}>
          <button className={`historicoTab btn ${activeTab === "Veículo Agregado" ? "active" : ""}`} onClick={() => setActiveTab("Veículo Agregado")}>
            Veículo Agregado
          </button>
          <button className={`historicoTab btn ${activeTab === "Veículo Frota" ? "active" : ""}`} onClick={() => setActiveTab("Veículo Frota")}>
            Veículo Frota
          </button>
          <button className={`historicoTab btn ${activeTab === "Fechamento Predial" ? "active" : ""}`} onClick={() => setActiveTab("Fechamento Predial")}>
            Fechamento Predial
          </button>
        </div>
        <div className={`mt-4`}>
          {
            activeTab === "Veículo Agregado" ? (
              <HistoricoVeiculoAgregado />
            ) : activeTab === "Fechamento Predial" ? (
              <HistoricoFechamentoPredial />
            ) : activeTab === "Veículo Frota" ? (
              <HistoricoVeiculoFrota />
            ) : null
          }
        </div>
      </div>
    </>
  )
}