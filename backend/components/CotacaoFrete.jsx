import { useEffect, useState } from "react";
import { buscarEstados, buscarCidades } from "../services/ibgeService";
import { calcularDistancia } from "../services/orsService";
import { tabelasFrete } from "../data/tabelaRollsRoyce";

export default function CotacaoFrete() {
	const [estados, setEstados] = useState([]);
	const [cidadesOrigem, setCidadesOrigem] = useState([]);
	const [cidadesDestino, setCidadesDestino] = useState([]);
	const [ufOrigem, setUfOrigem] = useState("");
	const [ufDestino, setUfDestino] = useState("");
	const [origem, setOrigem] = useState("");
	const [destino, setDestino] = useState("");
	const [distancia, setDistancia] = useState(null);
	const [valorFrete, setValorFrete] = useState(null);
	const [tabela, setTabela] = useState("");
	const valorPorKm = 3.5;

	useEffect(() => {
		buscarEstados().then(setEstados);
	}, []);

	const handleUfOrigem = async (uf) => {
		setUfOrigem(uf);
		setCidadesOrigem(await buscarCidades(uf));
	};

	const handleUfDestino = async (uf) => {
		setUfDestino(uf);
		setCidadesDestino(await buscarCidades(uf));
	};

	const calcular = async () => {
		if (!origem || !destino) {
			alert("Selecione origem e destino");
			return;
		}

		try {
			setDistancia("calculando...");
			const distanciaKm = await calcularDistancia(`${origem}, ${ufOrigem}`, `${destino}, ${ufDestino}`);
			setDistancia(distanciaKm.toFixed(2));
			setValorFrete((distanciaKm * valorPorKm).toFixed(2));
		} catch (e) {
			console.error(e);
			alert(`Erro ao calcular distância:`, e);
			setDistancia(null)
		}
	};

	const tiposDeTabela = [
		{ value: 'convencional', label: 'WEAir Convencional' },
		{ value: 'expresso', label: 'WEAir Expresso' },
		{ value: 'proximoVoo', label: 'WEAir Próximo Voo' },
		{ value: 'rodoviario', label: 'WExpress (Rodoviário)' },
		{ value: 'leadTime', label: 'Tabela de Lead Time' }
	];

	const handleTabela = (event) => {
		setTabela(event.target.value);
	};

	return (
		<div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
			<h1 className="text-2xl font-bold mb-6 text-center">Cotação de Frete</h1>

			<div className="mb-4">
				<label className="block mb-1 font-semibold">Estado de Origem</label>
				<select value={ufOrigem} onChange={e => handleUfOrigem(e.target.value)} className="w-full p-2 border rounded">
					<option value="">Selecione</option>
					{estados.map(uf => <option key={uf.id} value={uf.sigla}>{uf.nome}</option>)}
				</select>

				{cidadesOrigem.length > 0 && (
					<>
						<label className="block mt-2 mb-1 font-semibold">Cidade de Origem</label>
						<select value={origem} onChange={e => setOrigem(e.target.value)} className="w-full p-2 border rounded">
							<option value="">Selecione</option>
							{cidadesOrigem.map(c => <option key={c} value={c}>{c}</option>)}
						</select>
					</>
				)}
			</div>

			<div className="mb-4">
				<label className="block mb-1 font-semibold">Estado de Destino</label>
				<select value={ufDestino} onChange={e => handleUfDestino(e.target.value)} className="w-full p-2 border rounded">
					<option value="">Selecione</option>
					{estados.map(uf => <option key={uf.id} value={uf.sigla}>{uf.nome}</option>)}
				</select>

				{cidadesDestino.length > 0 && (
					<>
						<label className="block mt-2 mb-1 font-semibold">Cidade de Destino</label>
						<select value={destino} onChange={e => setDestino(e.target.value)} className="w-full p-2 border rounded">
							<option value="">Selecione</option>
							{cidadesDestino.map(c => <option key={c} value={c}>{c}</option>)}
						</select>
					</>
				)}
			</div>

			<div className="mb-4">
				{tiposDeTabela.length > 0 && (
					<>
						<label className="block mb-1 font-semibold">Tipo de Serviço</label>
						<select id="tabela-select" value={tabela} onChange={handleTabela}
						>
							<option value="">Selecione o tipo de frete...</option>
							{tiposDeTabela.map((tabela) => (
								<option key={tabela.value} value={tabela.value}>
									{tabela.label}
								</option>
							))}
						</select>
					</>
				)}
			</div>

			<button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">
				Calcular Distância e Frete
			</button>

			{distancia && (
				<div className="mt-6 text-center">
					<p className="text-lg font-semibold">Distância: <span className="text-blue-700">{distancia} km</span></p>
					{valorFrete && (
						<p className="text-lg font-semibold mt-2">Valor estimado: <span className="text-green-700">R$ {valorFrete}</span></p>
					)}
				</div>
			)}
		</div>
	);
}