import { useAuth } from "../../context/AuthContext";
import { ListaNotificacoes } from "./notificacoes/ListaNotificacoes";

export const Notificacoes = () => {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-3">Carregando usuário...</p>;
  }

  return (
    <div className="p-3">
      <ListaNotificacoes idColab={user.id} />
    </div>
  );
};
