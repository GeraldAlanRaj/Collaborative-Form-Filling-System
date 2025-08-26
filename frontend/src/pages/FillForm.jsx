import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { privateApi } from '../utils/AxiosInterceptor';
import socket from '../Socket';

export default function FillForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isClosed, setIsClosed] = useState(false);
  const [lockedFields, setLockedFields] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    privateApi.get(`/forms/${formId}`)
      .then(res => setForm(res.data))
      .catch(() => alert("Error loading form"));
  }, [formId]);

  useEffect(() => {
    socket.emit('joinForm', { formId });

    socket.on('formStatus', data => setIsClosed(data.isClosed));
    socket.on('loadResponse', data => {
      if (data) setResponses(data.responses || {});
    });

    socket.on('responseUpdated', ({ field, value }) => {
      setResponses(prev => ({ ...prev, [field]: value }));
    });

    socket.on('fieldLocked', ({ field }) => {
      setLockedFields(prev => ({ ...prev, [field]: true }));
    });

    socket.on('fieldUnlocked', ({ field }) => {
      setLockedFields(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    });

    return () => {
      socket.off('formStatus');
      socket.off('loadResponse');
      socket.off('responseUpdated');
      socket.off('fieldLocked');
      socket.off('fieldUnlocked');
    };
  }, [formId]);

  const handleChange = (label, value) => {
    setResponses(prev => ({ ...prev, [label]: value }));
    socket.emit('updateResponse', { formId, field: label, value });
  };

  const handleCheckboxChange = (label, option) => {
    const current = responses[label] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    handleChange(label, updated);
  };

  const handleSubmit = () => {
    const missingFields = form.fields.filter(f => {
      if (!f.required) return false;
      const value = responses[f.label];

      if (f.type === 'checkbox') return !value || value.length === 0;
      return value === undefined || value === '';
    });

    if (missingFields.length > 0) {
      alert("Please fill all required fields: " + missingFields.map(f => f.label).join(', '));
      return;
    }

    socket.emit('submitForm', { formId, responses });
    alert("Form submitted!");
    navigate("/home");
  };

  if (!form) return <div>Loading form...</div>;
  if (!Array.isArray(form.fields)) return <div>Error: Form has no fields defined.</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f8fa" }}>
        <div style={{
          background: "#fff",
          padding: "2rem 2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          minWidth: "400px",
          maxWidth: "600px",
          width: "100%"
        }}>
          <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#222" }}>{form.title}</h2>
          {isClosed && <p style={{ color: 'red', textAlign: 'center' }}>Form has been submitted and is locked.</p>}
          <form onSubmit={(e) => e.preventDefault()}>
            {form.fields.map((f, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <label><strong>{f.label}{f.required ? ' *' : ''}</strong></label><br />
                {f.type === 'text' || f.type === 'number' || f.type === 'date' ? (
                  <input
                    type={f.type}
                    value={responses[f.label] || ''}
                    onChange={e => handleChange(f.label, e.target.value)}
                    disabled={isClosed || lockedFields[f.label]}
                    onFocus={() => socket.emit('lockField', { formId, field: f.label })}
                    onBlur={() => socket.emit('unlockField', { formId, field: f.label })}
                    style={{ width: '100%', padding: "0.7rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", fontSize: "1rem" }}
                  />
                ) : f.type === 'textarea' ? (
                  <textarea
                    value={responses[f.label] || ''}
                    onChange={e => handleChange(f.label, e.target.value)}
                    disabled={isClosed || lockedFields[f.label]}
                    onFocus={() => socket.emit('lockField', { formId, field: f.label })}
                    onBlur={() => socket.emit('unlockField', { formId, field: f.label })}
                    style={{ width: '100%', padding: "0.7rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", fontSize: "1rem" }}
                  />
                ) : f.type === 'radio' ? (
                  f.options?.map((opt, j) => (
                    <label key={j} style={{ display: 'block', marginBottom: 4 }}>
                      <input
                        type="radio"
                        name={f.label}
                        value={opt}
                        checked={responses[f.label] === opt}
                        onChange={e => handleChange(f.label, e.target.value)}
                        disabled={isClosed || lockedFields[f.label]}
                        style={{ marginRight: 6 }}
                      />
                      {opt}
                    </label>
                  ))
                ) : f.type === 'checkbox' ? (
                  f.options?.map((opt, j) => (
                    <label key={j} style={{ display: 'block', marginBottom: 4 }}>
                      <input
                        type="checkbox"
                        value={opt}
                        checked={(responses[f.label] || []).includes(opt)}
                        onChange={() => handleCheckboxChange(f.label, opt)}
                        disabled={isClosed || lockedFields[f.label]}
                        style={{ marginRight: 6 }}
                      />
                      {opt}
                    </label>
                  ))
                ) : f.type === 'select' ? (
                  <select
                    value={responses[f.label] || ''}
                    onChange={e => handleChange(f.label, e.target.value)}
                    disabled={isClosed || lockedFields[f.label]}
                    style={{ width: '100%', padding: "0.7rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", fontSize: "1rem" }}
                  >
                    <option value="">Select...</option>
                    {f.options?.map((opt, j) => (
                      <option key={j} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={responses[f.label] || ''}
                    onChange={e => handleChange(f.label, e.target.value)}
                    disabled={isClosed || lockedFields[f.label]}
                    style={{ width: '100%', padding: "0.7rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", fontSize: "1rem" }}
                  />
                )}
              </div>
            ))}
            <button type="button" onClick={handleSubmit} disabled={isClosed} style={{ width: "100%", padding: "0.9rem", borderRadius: "0.5rem", background: "#2563eb", color: "#fff", border: "none", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
