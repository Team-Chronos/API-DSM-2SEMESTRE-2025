import { useAuth } from "../../context/AuthContext";
import { ListaNotificacoes } from "./notificacoes/ListaNotificacoes";
import "../../css/notificacoes.css";

export const Notificacoes = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-3">Carregando usuário...</p>;
  }

  return (
    <div id="divNotificacoes" className="p-3">
      <ListaNotificacoes idColab={user.id} />
    </div>
  );
};