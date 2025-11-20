const API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjA5OGQxYzY0MWE2ZDQ0MjRiZTg0MTM4ODMwYjBhYzcxIiwiaCI6Im11cm11cjY0In0=";

export const calcularDistancia = async (origem: string, destino: string) => {
  const getCoords = async (cidade: string) => {
    const res = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${API_KEY}&text=${encodeURIComponent(cidade + ", Brasil")}`
    );
    const data = await res.json();
    if (!data.features.length) throw new Error("Cidade não encontrada: " + cidade);
    return data.features[0].geometry.coordinates;
  };

  const origemCoords = await getCoords(origem);
  const destinoCoords = await getCoords(destino);

  const res = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
    method: "POST",
    headers: {
      "Authorization": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [origemCoords, destinoCoords],
      radiuses: [5000, 5000],
    }),
  });

  const data = await res.json();

  if (!data.routes) throw new Error("Falha ao calcular rota");

  const distanciaKm = data.routes[0].summary.distance / 1000;
  return distanciaKm;
};
