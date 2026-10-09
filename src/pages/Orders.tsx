import { useEffect, useState } from "react";
import { Order, api } from "../api";
import { useAuth } from "../auth";

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api<Order[]>("/api/admin/orders", {}, token).then(setOrders).catch(() => setOrders([]));
  }, [token]);

  return (
    <div className="card">
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Status</th>
            <th>Total</th>
            <th>Ship to</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.order_no}</td>
              <td>{o.status}</td>
              <td>{(o.total_cents / 100).toFixed(2)}</td>
              <td>{o.shipping_name}</td>
              <td>
                {o.items?.map((i, idx) => (
                  <div key={idx}>
                    {i.product_name_snapshot} × {i.quantity}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
