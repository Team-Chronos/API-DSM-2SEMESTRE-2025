export const formatarTelefone = (numero: string = ""): string => {
    numero = numero.replace(/\D/g, "");

    numero = numero.slice(0, 11);
    numero = numero.replace(/^(\d{2})(\d)/g, '($1) $2');
    numero = numero.replace(/(\d{5})(\d)/, '$1-$2');

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

export function formatarCpf(cpf: string = ""){
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.slice(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}