import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../auth";

export default function Login() {
  const { setAuth } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin1234");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await api<{ access_token: string; user: any }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (res.user.role !== "admin") {
        setError("Admin account required");
        return;
      }
      setAuth(res.access_token, res.user);
      nav("/");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <form className="card stack" style={{ maxWidth: 420 }} onSubmit={submit}>
      <h2>Admin Login</h2>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <div className="error">{error}</div>}
      <button className="btn">Login</button>
    </form>
  );
}
