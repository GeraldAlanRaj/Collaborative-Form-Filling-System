import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/JoinForm.css'

export default function JoinForm() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      alert("Please enter a form code");
      return;
    }
    navigate(`/fill/${code}`);
  };

  return (
    <div className="joinform-container">
      <form className="joinform-form">
        <h2>Enter Form Code</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={handleJoin}>Join</button>
      </form>
    </div>
  );
}
