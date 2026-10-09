import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Product, api } from "../api";
import { useAuth } from "../auth";

const empty = {
  sku: "",
  price: "9.99",
  stock: "10",
  category: "general",
  is_active: true,
  name_zh: "",
  name_en: "",
  name_id: "",
  desc_zh: "",
  desc_en: "",
  desc_id: "",
};

export default function ProductForm() {
  const { id } = useParams();
  const isNew = !id;
  const { token } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api<Product>(`/api/admin/products/${id}`, {}, token).then((p) => {
      setForm({
        sku: p.sku,
        price: String(p.price_cents / 100),
        stock: String(p.stock),
        category: p.category,
        is_active: p.is_active,
        name_zh: p.name_i18n?.zh || "",
        name_en: p.name_i18n?.en || "",
        name_id: p.name_i18n?.id || "",
        desc_zh: p.description_i18n?.zh || "",
        desc_en: p.description_i18n?.en || "",
        desc_id: p.description_i18n?.id || "",
      });
    });
  }, [id, token]);

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const body = {
      sku: form.sku,
      price_cents: Math.round(parseFloat(form.price) * 100),
      stock: parseInt(form.stock, 10),
      category: form.category,
      is_active: form.is_active,
      name_i18n: { zh: form.name_zh, en: form.name_en, id: form.name_id },
      description_i18n: { zh: form.desc_zh, en: form.desc_en, id: form.desc_id },
    };
    try {
      if (isNew) {
        await api("/api/admin/products", { method: "POST", body: JSON.stringify(body) }, token);
      } else {
        await api(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(body) }, token);
      }
      nav("/products");
    } catch (err: any) {
      setError(err?.message || "Save failed");
    }
  };

  return (
    <form className="card stack" onSubmit={submit}>
      <h2>{isNew ? "New product" : `Edit #${id}`}</h2>
      <label>
        SKU
        <input value={form.sku} onChange={(e) => set("sku", e.target.value)} required />
      </label>
      <label>
        Price
        <input value={form.price} onChange={(e) => set("price", e.target.value)} required />
      </label>
      <label>
        Stock
        <input value={form.stock} onChange={(e) => set("stock", e.target.value)} required />
      </label>
      <label>
        Category
        <input value={form.category} onChange={(e) => set("category", e.target.value)} />
      </label>
      <label>
        <span>Active</span>
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => set("is_active", e.target.checked)}
        />
      </label>
      {(["zh", "en", "id"] as const).map((lng) => (
        <div key={lng} className="card stack">
          <strong>{lng.toUpperCase()}</strong>
          <label>
            Name
            <input
              value={(form as any)[`name_${lng}`]}
              onChange={(e) => set(`name_${lng}`, e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={(form as any)[`desc_${lng}`]}
              onChange={(e) => set(`desc_${lng}`, e.target.value)}
              required
            />
          </label>
        </div>
      ))}
      {error && <div className="error">{error}</div>}
      <button className="btn">Save</button>
    </form>
  );
}
