import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinForm() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!code.trim()) {
      alert("Please enter a form code");
      return;
    }
    navigate(`/fill/${code}`);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f8fa" }}>
      <form style={{
        background: "#fff",
        padding: "2rem 2.5rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        minWidth: "320px",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem", color: "#222" }}>Enter Form Code</h2>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} style={{
          padding: "0.8rem",
          borderRadius: "0.5rem",
          border: "1px solid #d1d5db",
          fontSize: "1rem"
        }} />
        <button onClick={handleJoin} style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          padding: "0.8rem",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(37,99,235,0.08)"
        }}>Join</button>
      </form>
    </div>
  );
}
