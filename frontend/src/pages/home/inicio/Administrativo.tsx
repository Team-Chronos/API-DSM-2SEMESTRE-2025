import { Header } from "./administrativo/Header"
import '../../../css/adm.css'
import { useState } from "react";
import { ColaboradoresList } from "./administrativo/ColaboradoresList";
import { EventosList } from "./administrativo/EventosList";

export const Administrativo = () => {
  const [activeTab, setActiveTab] = useState("colaboradores");
	return (
		<div id="adm-module">
			<Header activeTab={activeTab} setActiveTab={setActiveTab}></Header>
			
			<div id="lista-colaboradores-eventos">
				{activeTab === "colaboradores" ? (
          <ColaboradoresList />
        ) : (
          <EventosList />
        )}
			</div>
		</div>
	)
}