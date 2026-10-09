import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product, api } from "../api";
import { useAuth } from "../auth";

export default function Products() {
  const { token } = useAuth();
  const [items, setItems] = useState<Product[]>([]);

  const load = () => api<Product[]>("/api/admin/products", {}, token).then(setItems);
  useEffect(() => {
    load();
  }, [token]);

  return (
    <div className="stack">
      <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Products</h2>
        <Link className="btn" to="/products/new">
          New product
        </Link>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name (en)</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name_i18n?.en}</td>
                <td>{(p.price_cents / 100).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.is_active ? "yes" : "no"}</td>
                <td>
                  <Link to={`/products/${p.id}`}>Edit</Link>{" "}
                  <button
                    className="btn danger"
                    onClick={async () => {
                      await api(`/api/admin/products/${p.id}`, { method: "DELETE" }, token);
                      load();
                    }}
                  >
                    Del
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
