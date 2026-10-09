const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data as T;
}

export type Product = {
  id: number;
  sku: string;
  price_cents: number;
  stock: number;
  category: string;
  is_active: boolean;
  name_i18n: Record<string, string>;
  description_i18n: Record<string, string>;
  image_url?: string | null;
};

export type Order = {
  id: number;
  order_no: string;
  status: string;
  total_cents: number;
  shipping_name: string;
  items: Array<{ product_name_snapshot: string; quantity: number; unit_price_cents: number }>;
};

export type Dashboard = {
  product_count: number;
  order_count: number;
  paid_gmv_cents: number;
};
