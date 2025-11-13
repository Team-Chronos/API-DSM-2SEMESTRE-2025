import type { JSX } from "react";
import { useAuth } from "../../context/AuthContext";
import { Administrativo } from "./inicio/Administrativo"
import { Comercial } from "./inicio/Comercial";
import { Operacional } from "./inicio/Operacional";

const setorComponents: Record<number, JSX.Element> = {
  1: <Administrativo />,
  2: <Comercial />,
  3: <Operacional />
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
