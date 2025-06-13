import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JoinForm() {
  const [formId, setFormId] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (formId.trim()) {
      navigate(`/fill/${formId}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Enter Form ID</h2>
      <input
        type="text"
        placeholder="Form ID"
        value={formId}
        onChange={e => setFormId(e.target.value)}
      />
      <button onClick={handleJoin}>Join Form</button>
    </div>
  );
}
