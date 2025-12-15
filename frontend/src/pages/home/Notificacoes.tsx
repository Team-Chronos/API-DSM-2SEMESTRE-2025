import { useAuth } from "../../context/AuthContext";
import { ListaNotificacoes } from "./notificacoes/ListaNotificacoes";
import "../../css/notificacoes.css";

export const Notificacoes = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Carregando usuário...</p>;
  }

  return (
    <div id="divNotificacoes">
      <ListaNotificacoes idColab={user.id} />
    </div>
  );
};
