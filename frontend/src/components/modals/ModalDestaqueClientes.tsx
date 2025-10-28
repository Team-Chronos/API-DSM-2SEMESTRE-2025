import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosContact, IoIosAddCircle } from "react-icons/io";
import { ModalCadastroCliente } from "./ModalCadastroCliente";
import "../../css/ModalDestaqueClientes.css";
import { useNavigate } from "react-router-dom";

interface Cliente {
  ID_Cliente: number;
  Nome_Cliente: string;
  Data_Cadastro: string;
}

export const ModalDestaqueClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const carregarClientes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const ultimosClientes = [...clientes]
    .sort(
      (a, b) =>
        new Date(b.Data_Cadastro).getTime() -
        new Date(a.Data_Cadastro).getTime()
    )
    .slice(0, 6);

  const formatarNome = (nome: string, limite = 12) => {
    return nome.length > limite ? nome.slice(0, limite) + "..." : nome;
  };

  return (
    <div className="destaque-clientes-wrapper">
      <div className="destaque-clientes">
        <div className="destaque-left">
          <h5 className="titulo">Clientes</h5>
          <h1 className="contador">{clientes.length}</h1>
        </div>

        <div className="destaque-right">
          <div
            className="cliente-add"
            onClick={() => setShowModal(true)}
            title="Novo Cliente"
          >
            <div className="cliente-circle">
              <IoIosAddCircle className="cliente-icon" />
            </div>
            <p className="cliente-nome">Novo Cliente</p>
          </div>

          {ultimosClientes.map((c) => (
            <div
              key={c.ID_Cliente}
              className="cliente-card"
              onClick={() => navigate(`/comercial/cliente/${c.ID_Cliente}`)}
              title={`Ver histórico de ${c.Nome_Cliente}`}
              style={{ cursor: "pointer" }}
            >
              <div className="cliente-circle">
                <IoIosContact className="cliente-icon" />
              </div>
              <p className="cliente-nome">{formatarNome(c.Nome_Cliente)}</p>
            </div>
          ))}
        </div>
      </div>

      <ModalCadastroCliente
        show={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={carregarClientes}
      />
    </div>
  );
};
