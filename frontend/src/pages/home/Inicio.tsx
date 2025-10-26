import type { JSX } from "react";
import { useAuth } from "../../context/AuthContext";
import { Administrativo } from "./inicio/Administrativo"
import { Comercial } from "./inicio/Comercial";

const setorComponents: Record<number, JSX.Element> = {
  1: <Administrativo />,
  2: <Comercial />,
};

export const Inicio = () => {
  const { user } = useAuth();

  if (!user) return null;

  return setorComponents[user.setor] ?? (
    <div className="text-center mt-5">
      <h4>Setor não identificado</h4>
    </div>
  );
};
