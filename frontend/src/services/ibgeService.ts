export const buscarEstados = async () => {
  const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados");
  const estados = await res.json();
  return estados.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
};

export const buscarCidades = async (uf: any) => {
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
  const cidades = await res.json();
  return cidades.map((c: any) => c.nome).sort((a: any, b: any) => a.localeCompare(b));
};