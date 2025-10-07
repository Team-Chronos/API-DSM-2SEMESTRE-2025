import { useEffect, useState } from "react";
import { formatarTelefone } from "../../../../utils/formatacoes";

interface Colaborador {
  ID_colaborador: number;
  Nome_Col: string;
  Email: string;
  Setor: number;
  Localidade: string;
  Telefone: string;
}

export const ColaboradoresList = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarColaboradores = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/colaboradores");
        const data = await response.json();
        setColaboradores(data);
      } catch (error) {
        console.error("Erro ao carregar colaboradores:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarColaboradores();
  }, []);

  if (loading) return <p>Carregando...</p>;

  if (colaboradores.length === 0)
    return <p className="text-center mt-3">Nenhum colaborador cadastrado.</p>;

  const getNomeSetor = (id: number) =>
    id === 1 ? "Administrativo" : id === 2 ? "Comercial" : "Operacional";

  const getNomeLocalidade = (char: string) => {
    switch (char) {
      case "P":
        return "Presencial";
      case "R":
        return "Remoto";
      case "O":
        return "Outro";
      default:
        return "Não informado";
    }
  };

  return (
    <table className="table table-hover align-middle">
      <thead className="table-light">
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Setor</th>
          <th>Modalidade</th>
          <th>Telefone</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {colaboradores.map((colab) => (
          <tr key={colab.ID_colaborador}>
            <td>{colab.ID_colaborador}</td>
            <td>{colab.Nome_Col}</td>
            <td>{colab.Email}</td>
            <td>{getNomeSetor(colab.Setor)}</td>
            <td>{getNomeLocalidade(colab.Localidade)}</td>
            <td>{formatarTelefone(colab.Telefone)}</td>
            <td>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => console.log("editar", colab.ID_colaborador)}
              >
                Editar
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => console.log("excluir", colab.ID_colaborador)}
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
