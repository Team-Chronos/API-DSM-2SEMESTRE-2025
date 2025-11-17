/**
 * Tabela de WEAir Convencional - Rolls Royce
 * (Fontes: Tabela Rolls Royce.xlsx - WEAir Convencional.csv)
 */
const weAirConvencional = [
  { origem: 'NEWE Convencional', cita: 'AJU', destino: 'Aracaju', freteMinimo: 217, valorKiloExcedente: 11.64522, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'BEL', destino: 'Belém', freteMinimo: 217, valorKiloExcedente: 14.5374, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'BPS', destino: 'Porto Seguro', freteMinimo: 217, valorKiloExcedente: 12.85722, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'BSB', destino: 'Brasília', freteMinimo: 217, valorKiloExcedente: 5.2891499999999994, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'BVB', destino: 'Boa Vista', freteMinimo: 217, valorKiloExcedente: 21.077399999999997, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'CGB', destino: 'Cuiabá', freteMinimo: 217, valorKiloExcedente: 6.73722, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'CGR', destino: 'Campo Grande', freteMinimo: 217, valorKiloExcedente: 5.2891499999999994, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'CNF', destino: 'Confins', freteMinimo: 217, valorKiloExcedente: 5.09511, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'CPV', destino: 'Campina Grande', freteMinimo: 217, valorKiloExcedente: 7.6, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'CWB', destino: 'Curitiba', freteMinimo: 217, valorKiloExcedente: 5.09511, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'FLN', destino: 'Florianópolis', freteMinimo: 217, valorKiloExcedente: 5.09511, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'FOR', destino: 'Fortaleza', freteMinimo: 217, valorKiloExcedente: 10.12068, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'GIG', destino: 'Rio de Janeiro (Galeão)', freteMinimo: 217, valorKiloExcedente: 5.09511, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'GYN', destino: 'Goiania', freteMinimo: 217, valorKiloExcedente: 5.2891499999999994, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'JPA', destino: 'João Pessoa', freteMinimo: 217, valorKiloExcedente: 12.62868, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'MAB', destino: 'Marabá', freteMinimo: 217, valorKiloExcedente: 21.8934, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'MAO', destino: 'Manaus', freteMinimo: 217, valorKiloExcedente: 16.4454, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'MCP', destino: 'Macapá', freteMinimo: 217, valorKiloExcedente: 21.077399999999997, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'MCZ', destino: 'Maceió', freteMinimo: 217, valorKiloExcedente: 7.21722, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'NAT', destino: 'Natal', freteMinimo: 217, valorKiloExcedente: 7.60068, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'PLU', destino: 'Belo Horizonte (Pampulha)', freteMinimo: 217, valorKiloExcedente: 5.09511, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'PMW', destino: 'Palmas', freteMinimo: 217, valorKiloExcedente: 13.296600000000002, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'POA', destino: 'Porto Alegre', freteMinimo: 217, valorKiloExcedente: 5.2891499999999994, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'PVH', destino: 'Porto Velho', freteMinimo: 217, valorKiloExcedente: 38.3454, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'RBR', destino: 'Rio Branco', freteMinimo: 217, valorKiloExcedente: 38.3454, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'REC', destino: 'Recife', freteMinimo: 217, valorKiloExcedente: 10.12068, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'SDU', destino: 'Rio de Janeiro (Santos Dumont)', freteMinimo: 217, valorKiloExcedente: 5.09511, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'SLZ', destino: 'São Luís', freteMinimo: 217, valorKiloExcedente: 14.3244, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'SSA', destino: 'Salvador', freteMinimo: 217, valorKiloExcedente: 9.73722, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'STM', destino: 'Santarém', freteMinimo: 217, valorKiloExcedente: 21.8934, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'THE', destino: 'Teresina', freteMinimo: 217, valorKiloExcedente: 14.3244, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'VIX', destino: 'Vitória', freteMinimo: 217, valorKiloExcedente: 6.5131499999999987, pesoMinimo: 10 },
  { origem: 'NEWE Convencional', cita: 'IMP', destino: 'Imperatriz', freteMinimo: 217, valorKiloExcedente: 14.99, pesoMinimo: 10 }
];

/**
 * Tabela de WEAir Expresso - Rolls Royce
 * (Fontes: Tabela Rolls Royce.xlsx - WEAir Expresso .csv)
 */
const weAirExpresso = [
  { servico: 'NEWE EXPRESS', destino: 'AJU', minimo: 283.5, valorKiloExcedente: 12.7964375, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'JPA', minimo: 283.5, valorKiloExcedente: 14.784000000000002, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'SLZ', minimo: 283.5, valorKiloExcedente: 14.784000000000002, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'THE', minimo: 283.5, valorKiloExcedente: 14.784000000000002, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'FOR', minimo: 283.5, valorKiloExcedente: 14.784000000000002, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'PMW', minimo: 283.5, valorKiloExcedente: 12.7964375, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'REC', minimo: 283.5, valorKiloExcedente: 14.784000000000002, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'SSA', minimo: 283.5, valorKiloExcedente: 12.7964375, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'SDU / GIG', minimo: 283.5, valorKiloExcedente: 10.6115625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'PLU / CNF', minimo: 283.5, valorKiloExcedente: 10.6115625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'BSB', minimo: 283.5, valorKiloExcedente: 11.627, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'CGR', minimo: 283.5, valorKiloExcedente: 11.627, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'CWB', minimo: 283.5, valorKiloExcedente: 10.6115625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'FLN', minimo: 283.5, valorKiloExcedente: 10.6115625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'GYN', minimo: 283.5, valorKiloExcedente: 11.627, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'JOI', minimo: 283.5, valorKiloExcedente: 10.6115625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'POA', minimo: 283.5, valorKiloExcedente: 11.627, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'CGB', minimo: 283.5, valorKiloExcedente: 12.7964375, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'VIX', minimo: 283.5, valorKiloExcedente: 11.627, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'BVB', minimo: 283.5, valorKiloExcedente: 17.3105625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'IMP', minimo: 283.5, valorKiloExcedente: 17.31, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'MAB', minimo: 283.5, valorKiloExcedente: 17.3105625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'MCP', minimo: 283.5, valorKiloExcedente: 17.3105625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'PVH', minimo: 283.5, valorKiloExcedente: 17.3105625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'RBR', minimo: 283.5, valorKiloExcedente: 17.3105625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'STM', minimo: 283.5, valorKiloExcedente: 17.3105625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'MCZ', minimo: 283.5, valorKiloExcedente: 12.7964375, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'NAT', minimo: 283.5, valorKiloExcedente: 14.784000000000002, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'BEL', minimo: 283.5, valorKiloExcedente: 17.3105625, pesoMinimo: 10 },
  { servico: 'NEWE EXPRESS', destino: 'MAO', minimo: 283.5, valorKiloExcedente: 17.3105625, pesoMinimo: 10 }
];

/**
 * Generalidades para tabelas WEAir (Convencional e Expresso)
 */
const generalidadesWEAir = {
  coletaHorarioComercial: {
    descricao: "Coleta com antecedencia de 4horas dentro horario comercial",
    valor: 150.00
  },
  coletaEmergencia: {
    descricao: "Coleta Emergencia 24 horas",
    valor: 280.00
  },
  seguro: 0.007, // 0,70%
  gris: 0.0008, // 0,08%
  veiculoDedicadoDestino50km: {
    descricao: "Veiculo Dedicado Entrega no Destino ate 50Km (Fiorino)",
    valor: 480.00
  },
  retiraAeroporto: "Carga Retira Aeroporto sem Custos",
  veiculoDedicadoInteriorKM: {
    descricao: "Veiculo Dedicado Interior Valor por Km",
    valor: 4.50
  },
  obs: "OBS: Exceto Regiões Rural, Indigena e Fluvial."
};

/**
 * Tabela WEAir Proximo Voo - Rolls Royce
 * (Fontes: Tabela Rolls Royce.xlsx - WEAir Proximo Voo.csv)
 * * Nota: Esta é uma tabela de preços por faixas de peso.
 */
const weAirProximoVoo = [
  { pesoAte: '0,5Kg', valor: 164.81345749919996 },
  { pesoAte: '1,0Kg', valor: 201.43867027679994 },
  { pesoAte: '1,5Kg', valor: 222.6555028368 },
  { pesoAte: '2,0Kg', valor: 222.6555028368 },
  { pesoAte: '2,5Kg', valor: 318.05547495480005 },
  { pesoAte: '3,0Kg', valor: 318.05547495480005 },
  { pesoAte: '3,5Kg', valor: 413.5009117140001 },
  { pesoAte: '4,0Kg', valor: 413.5009117140001 },
  { pesoAte: '4,5Kg', valor: 459.4656639672 },
  { pesoAte: '5,0Kg', valor: 459.4656639672 },
  { pesoAte: '5,5Kg', valor: 505.36979669880003 },
  { pesoAte: '6,0Kg', valor: 505.36979669880003 },
  { pesoAte: '6,5Kg', valor: 551.31939407160007 },
  { pesoAte: '7,0Kg', valor: 551.31939407160007 },
  { pesoAte: '7,5Kg', valor: 597.26899144440006 },
  { pesoAte: '8,0Kg', valor: 597.26899144440006 },
  { pesoAte: '8,5Kg', valor: 643.2034339368 },
  { pesoAte: '9,0Kg', valor: 643.2034339368 },
  { pesoAte: '9,5Kg', valor: 689.1530313095999 },
  { pesoAte: '10,0Kg', valor: 689.1530313095999 },
  { pesoAte: '10,5Kg', valor: 830.26012271400009 },
  { pesoAte: '11,0Kg', valor: 830.26012271400009 },
  { pesoAte: '11,5Kg', valor: 885.87853378199986 },
  { pesoAte: '12,0Kg', valor: 885.87853378199986 },
  { pesoAte: '12,5Kg', valor: 941.49694485 },
  { pesoAte: '13,0Kg', valor: 941.49694485 },
  { pesoAte: '13,5Kg', valor: 997.10020103760019 },
  { pesoAte: '14,0Kg', valor: 997.10020103760019 },
  { pesoAte: '14,5Kg', valor: 1052.6883023448 },
  { pesoAte: '15,0Kg', valor: 1052.6883023448 },
  { pesoAte: '15,5Kg', valor: 957.201 }, // <-- Atenção: este valor é menor que o anterior no arquivo original.
  { pesoAte: '16,0Kg', valor: 957.20015637720007 },
  { pesoAte: '16,5Kg', valor: 1005.2080620516 },
  { pesoAte: '17,0Kg', valor: 1005.2080620516 },
  { pesoAte: '17,5Kg', valor: 1053.2421443376 },
  { pesoAte: '18,0Kg', valor: 1053.2421443376 },
  { pesoAte: '18,5Kg', valor: 1101.2762266236 },
  { pesoAte: '19,0Kg', valor: 1101.2762266236 },
  { pesoAte: '19,5Kg', valor: 1149.3233972154 },
  { pesoAte: '20,0Kg', valor: 1149.3233972154 },
  { pesoAte: '20,5Kg', valor: 1197.3443911955999 },
  { pesoAte: '21,0Kg', valor: 1197.3443911955999 },
  { pesoAte: '21,5Kg', valor: 1245.3784734816 },
  { pesoAte: '22,0Kg', valor: 1245.3784734816 },
  { pesoAte: '22,5Kg', valor: 1293.4125557676 },
  { pesoAte: '23,0Kg', valor: 1293.4125557676 },
  { pesoAte: '23,5Kg', valor: 1305.5715918558 },
  { pesoAte: '24,0Kg', valor: 1305.5715918558 },
  { pesoAte: '24,5Kg', valor: 1335.3474875508 },
  { pesoAte: '25,0Kg', valor: 1335.3474875508 },
  { pesoAte: '25,5Kg', valor: 1362.6366051437997 },
  { pesoAte: '26,0Kg', valor: 1362.6366051437997 },
  { pesoAte: '26,5Kg', valor: 1389.9518993484 },
  { pesoAte: '27,0Kg', valor: 1389.9518993484 },
  { pesoAte: '27,5Kg', valor: 1422.2276614512002 },
  { pesoAte: '28,0Kg', valor: 1422.2276614512002 },
  { pesoAte: '28,5Kg', valor: 1447.0561775538 },
  { pesoAte: '29,0Kg', valor: 1447.0561775538 },
  { pesoAte: '29,5Kg', valor: 1476.818984943 },
  { pesoAte: '30,0Kg', valor: 1476.818984943 }
];

/**
 * Generalidades para WEAir Proximo Voo
 * (São semelhantes às outras 'WEAir', mas com uma linha a mais)
 */
const generalidadesProximoVoo = {
  valorAtualizado: 33.95, // "Valor Atualizado R$ 33,95"
  coletaHorarioComercial: {
    descricao: "Coleta com antecedencia de 4horas dentro horario comercial",
    valor: 150.00
  },
  coletaEmergencia: {
    descricao: "Coleta Emergencia 24 horas",
    valor: 280.00
  },
  seguro: 0.007, // 0,70%
  gris: 0.0008, // 0,08%
  veiculoDedicadoDestino50km: {
    descricao: "Veiculo Dedicado Entrega no Destino ate 50Km (Fiorino)",
    valor: 480.00
  },
  retiraAeroporto: "Carga Retira Aeroporto sem Custos",
  veiculoDedicadoInteriorKM: {
    descricao: "Veiculo Dedicado Interior Valor por Km",
    valor: 4.50
  },
  obs: "OBS: Exceto Regiões Rural, Indigena e Fluvial."
};


/**
 * Tabela WExpress - Rolls Royce (Transporte Rodoviário Dedicado)
 * (Fontes: Tabela Rolls Royce.xlsx - WEXPRESS.csv)
 */
const wExpress = [
  { veiculo: 'Fiorino', capacidadePeso: '0 a 550', freteMinimo: 398, kmMinimo: 154, kmExcedente: 2.6, diariaVeiculo: 220, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 },
  { veiculo: 'Van', capacidadePeso: '600 a 1200', freteMinimo: 655, kmMinimo: 145, kmExcedente: 3.55, diariaVeiculo: 300, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 },
  { veiculo: 'VUC', capacidadePeso: '1200 a 3000', freteMinimo: 980, kmMinimo: 200, kmExcedente: 5, diariaVeiculo: 390, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 },
  { veiculo: '03/04.', capacidadePeso: '3000 a 6000', freteMinimo: 1417.76, kmMinimo: 200, kmExcedente: 6, diariaVeiculo: 500, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 },
  { veiculo: 'Truck', capacidadePeso: '6000 a 14000', freteMinimo: 2904.79, kmMinimo: 175, kmExcedente: 8.33, diariaVeiculo: 700, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 },
  { veiculo: 'Carreta 2 eixos', capacidadePeso: '14000 a 33000', freteMinimo: 3304.95, kmMinimo: 175, kmExcedente: 12.82, diariaVeiculo: 1800, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 },
  { veiculo: 'Carreta 3 eixos', capacidadePeso: '33000 a 41000', freteMinimo: 3672.15, kmMinimo: 175, kmExcedente: 13.5, diariaVeiculo: 1800, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 },
  { veiculo: 'Carreta Cavalo Trucado', capacidadePeso: '41000 a 45000', freteMinimo: 4637.3, kmMinimo: 175, kmExcedente: 10.99, diariaVeiculo: 1800, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 },
  { veiculo: 'Carreta Prancha', capacidadePeso: '45000 a 50000', freteMinimo: 3970.67, kmMinimo: 175, kmExcedente: 15.52, diariaVeiculo: 1800, seguroComDDR: 0.001, seguroSemDDR: 0.001, gris: 0.0008 }
];

/**
 * Generalidades para WExpress
 */
const generalidadesWExpress = {
  adValoremRJ: 0.0035, // "ADValorem Estado Rio de Janeiro - RJ 0,35%"
  batedorNaoIncluso: true,
  tapNaoIncluso: true,
  drop: 150.00, // "DROP 150,00"
  faturamento: "Mensal mais 15 dias",
  escoltaNaoIncluso: true
};


/**
 * Tabela LT (Lead Time) WEAir Nacional
 * (Fontes: Tabela Rolls Royce.xlsx - LT WEAir NEWE .csv)
 * * Nota: Os valores são dias de 'Lead Time'. Células vazias foram marcadas como 'null'.
 */
const ltWEAir = [
  { iata: 'AJU', cidade: 'Aracaju', uf: 'SE', convencional: 4, expresso: 3, proximo: 1, conexao: null },
  { iata: 'BEL', cidade: 'Belém', uf: 'PA', convencional: 5, expresso: 3, proximo: 1, conexao: null },
  { iata: 'BNU', cidade: 'Blumenau', uf: 'SC', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'BSB', cidade: 'Brasília', uf: 'DF', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'BVB', cidade: 'Boa Vista', uf: 'RR', convencional: 7, expresso: 4, proximo: 2, conexao: 'X' },
  { iata: 'CGB', cidade: 'Cuiaba', uf: 'MT', convencional: 5, expresso: 3, proximo: 1, conexao: null },
  { iata: 'CGR', cidade: 'Campo Grande', uf: 'MS', convencional: 5, expresso: 3, proximo: 1, conexao: null },
  { iata: 'CWB', cidade: 'Curitiba', uf: 'PR', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'CXJ', cidade: 'Caxias do Sul', uf: 'RS', convencional: 3, expresso: 2, proximo: 1, conexao: null },
  { iata: 'FLN', cidade: 'Florianópolis', uf: 'SC', convencional: 3, expresso: 2, proximo: 1, conexao: null },
  { iata: 'FOR', cidade: 'Fortaleza', uf: 'CE', convencional: 4, expresso: 3, proximo: 1, conexao: null },
  { iata: 'GIG', cidade: 'Rio de Janeiro (Galeão)', uf: 'RJ', convencional: 3, expresso: 2, proximo: 1, conexao: null },
  { iata: 'GYN', cidade: 'Goiania', uf: 'GO', convencional: 4, expresso: 3, proximo: 1, conexao: null },
  { iata: 'IMP', cidade: 'Imperatriz', uf: 'MA', convencional: 4, expresso: null, proximo: 1, conexao: null },
  { iata: 'IOS', cidade: 'Ilhéus', uf: 'BA', convencional: 4, expresso: 3, proximo: 1, conexao: null },
  { iata: 'JOI', cidade: 'Joinville', uf: 'SC', convencional: 3, expresso: 2, proximo: 1, conexao: null },
  { iata: 'JPA', cidade: 'João Pessoa', uf: 'PB', convencional: 4, expresso: 4, proximo: 1, conexao: null },
  { iata: 'LDB', cidade: 'Londrina', uf: 'PR', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'MAB', cidade: 'Marabá', uf: 'PA', convencional: 6, expresso: 4, proximo: 2, conexao: 'x' },
  { iata: 'MAO', cidade: 'Manaus', uf: 'AM', convencional: 6, expresso: 4, proximo: 1, conexao: null },
  { iata: 'MCP', cidade: 'Macapá', uf: 'AP', convencional: 7, expresso: 3, proximo: 2, conexao: 'x' },
  { iata: 'MGF', cidade: 'Maringá', uf: 'PR', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'NAT', cidade: 'Natal', uf: 'RN', convencional: 4, expresso: 3, proximo: 1, conexao: null },
  { iata: 'NVT', cidade: 'Navegantes', uf: 'SC', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'PMW', cidade: 'Palmas', uf: 'TO', convencional: 4, expresso: 3, proximo: 1, conexao: null },
  { iata: 'POA', cidade: 'Porto Alegre', uf: 'RS', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'PVH', cidade: 'Porto Velho', uf: 'RO', convencional: 7, expresso: 4, proximo: 2, conexao: 'x' },
  { iata: 'RBR', cidade: 'Rio Branco', uf: 'AC', convencional: 7, expresso: 4, proximo: 2, conexao: 'x' },
  { iata: 'REC', cidade: 'Recife', uf: 'PE', convencional: 5, expresso: 3, proximo: 1, conexao: null },
  { iata: 'SDU', cidade: 'Rio de Janeiro (Santos Dumont)', uf: 'RJ', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'SLZ', cidade: 'São Luís', uf: 'MA', convencional: 5, expresso: 4, proximo: 1, conexao: null },
  { iata: 'SSA', cidade: 'Salvador', uf: 'BA', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'STM', cidade: 'Santarém', uf: 'PA', convencional: 6, expresso: 4, proximo: 2, conexao: 'x' },
  { iata: 'THE', cidade: 'Teresina', uf: 'PI', convencional: 5, expresso: 4, proximo: 1, conexao: null },
  { iata: 'UDI', cidade: 'Uberlândia', uf: 'MG', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'VIX', cidade: 'Vitória', uf: 'ES', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'CNF', cidade: 'Belo Horizonte', uf: 'MG', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'PLU', cidade: 'Belo Horizonte (Pampulha)', uf: 'MG', convencional: 3, expresso: 3, proximo: 1, conexao: null },
  { iata: 'MCZ', cidade: 'Maceió', uf: 'AL', convencional: 4, expresso: 3, proximo: 1, conexao: null },
  { iata: 'LFR', cidade: 'Lauro de Freitas', uf: 'BA', convencional: 4, expresso: 3, proximo: 1, conexao: null }
];

export const tabelasFrete = {
  convencional: weAirConvencional,
  expresso: weAirExpresso,
  proximoVoo: weAirProximoVoo,
  rodoviario: wExpress,
  leadTime: ltWEAir,
  regras: {
    weAir: generalidadesWEAir,
    proximoVoo: generalidadesProximoVoo,
    wExpress: generalidadesWExpress
  }
};