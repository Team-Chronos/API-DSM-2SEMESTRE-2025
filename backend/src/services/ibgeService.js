export const buscarEstados = async () => {
  const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
  const estados = await res.json();
  return estados.sort((a, b) => a.nome.localeCompare(b.nome));
};

export const buscarCidades = async (uf) => {
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
  const cidades = await res.json();
  return cidades.map(c => c.nome).sort((a, b) => a.localeCompare(b));
};