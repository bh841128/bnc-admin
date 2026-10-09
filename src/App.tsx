import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import ProductForm from "./pages/ProductForm";
import Products from "./pages/Products";

function Guard({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth();
  if (!token || user?.role !== "admin") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, logout } = useAuth();
  return (
    <div className="shell">
      <nav className="nav">
        <div className="brand">BNC Admin</div>
        <div className="nav-links">
          {user?.role === "admin" && (
            <>
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/products">Products</NavLink>
              <NavLink to="/orders">Orders</NavLink>
              <button className="btn secondary" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Guard><Dashboard /></Guard>} />
        <Route path="/products" element={<Guard><Products /></Guard>} />
        <Route path="/products/new" element={<Guard><ProductForm /></Guard>} />
        <Route path="/products/:id" element={<Guard><ProductForm /></Guard>} />
        <Route path="/orders" element={<Guard><Orders /></Guard>} />
      </Routes>
    </div>
  );
}
