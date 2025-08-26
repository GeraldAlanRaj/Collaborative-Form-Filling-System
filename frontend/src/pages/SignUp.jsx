import { useState } from "react";
import { publicApi } from "../utils/AxiosInterceptor";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const errors = [];
    if (!username.trim()) errors.push("Username is required");
    if (!email.trim()) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Invalid email format");
    if (!password.trim()) errors.push("Password is required");
    else if (password.length < 6) errors.push("Password must be at least 6 characters");
    if (errors.length) { alert(errors.join("\n")); return false; }
    return true;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      await publicApi.post("/auth/signup", { username, email, password });
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div className="Signup" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f8fa" }}>
      <form
        onSubmit={e => { e.preventDefault(); handleSignup(); }}
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
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#222" }}>Create an Account</h2>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{
          padding: "0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          fontSize: "1rem"
        }} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{
          padding: "0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          fontSize: "1rem"
        }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{
          padding: "0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          fontSize: "1rem"
        }} />
        <button type="submit" style={{
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.8rem",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(22,163,74,0.08)"
        }}>Sign Up</button>
      </form>
    </div>
  );
}
