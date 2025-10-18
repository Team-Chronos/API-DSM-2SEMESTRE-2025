export const formatarTelefone = (numero: string | number) => {
    const num = numero.toString().replace(/\D/g, "");

    if (num.length === 11) {
        return num.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (num.length === 10) {
        return num.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    return numero;
}

export const formatarDataHora = (dataIso: string) => {
  const data = new Date(dataIso);

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();

  const horas = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${ano} ${horas}:${minutos}`;
}