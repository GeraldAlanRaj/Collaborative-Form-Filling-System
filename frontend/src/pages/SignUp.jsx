import { useState } from "react";
import axios from "axios";
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
      await axios.post("http://localhost:8080/api/auth/signup", { username, email, password });
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error signing up");
    }
  };

  return (
    <div className="Signup">
      <h2>Create an Account</h2>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
