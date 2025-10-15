import { useState } from "react";
import { Tabs, Tab as BSTabs } from "react-bootstrap";
import { ComercialDashboard } from "./comercial/ComercialDashboard";
import { ClientesList } from "./comercial/ClientesList";

export const Comercial = () => {
  const [key, setKey] = useState("dashboard");

  return (
    <div>
      <Tabs
        id="comercial-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || "dashboard")}
        className="mb-3"
      >
        <BSTabs eventKey="dashboard" title="Dashboard">
          <ComercialDashboard />
        </BSTabs>
        <BSTabs eventKey="clientes" title="Clientes">
          <ClientesList />
        </BSTabs>
      </Tabs>
    </div>
  );
};
