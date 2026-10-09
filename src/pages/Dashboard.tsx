import { useEffect, useState } from "react";
import { Dashboard as Dash, api } from "../api";
import { useAuth } from "../auth";

export default function Dashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<Dash | null>(null);

  useEffect(() => {
    api<Dash>("/api/admin/dashboard", {}, token).then(setData).catch(() => setData(null));
  }, [token]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid">
      <div className="card">
        <div className="muted">Products</div>
        <h2>{data.product_count}</h2>
      </div>
      <div className="card">
        <div className="muted">Orders</div>
        <h2>{data.order_count}</h2>
      </div>
      <div className="card">
        <div className="muted">Paid GMV (cents)</div>
        <h2>{data.paid_gmv_cents}</h2>
      </div>
    </div>
  );
}
