import { useState } from "react";
import { publicApi } from "../utils/AxiosInterceptor";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await publicApi.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      if (res.data.role === "admin") {
        navigate("/admin/create");
      } else {
        navigate("/home");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f8fa" }}>
      <form
        onSubmit={e => { e.preventDefault(); handleLogin(); }}
        style={{
          background: "#fff",
          padding: "2rem 2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          minWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#222" }}>WELCOME</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{
          padding: "0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          fontSize: "1rem"
        }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{
          padding: "0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          fontSize: "1rem"
        }} />
        <button type="submit" style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.8rem",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(37,99,235,0.08)"
        }}>Sign In</button>
        <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
          Don't have an account? <a href="/signup" style={{ color: "#2563eb", textDecoration: "underline" }}>Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
