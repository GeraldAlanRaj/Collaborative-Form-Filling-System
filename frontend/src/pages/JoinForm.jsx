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
    <div>
      <h2>Enter Form Code</h2>
      <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
}
