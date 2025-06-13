import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { privateApi } from '../utils/AxiosInterceptor';
import socket from '../Socket';

export default function FillForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isClosed, setIsClosed] = useState(false);
  const navigate = useNavigate();
  //Lock-Field Feature State
  const [lockedFields, setLockedFields] = useState({});

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
    //Lock Filed Listeners
    socket.on('fieldLocked', ({ field }) => {
      setLockedFields((prev) => ({ ...prev, [field]: true }));
    });

    socket.on('fieldUnlocked', ({ field }) => {
      setLockedFields((prev) => {
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

  const handleSubmit = () => {
    socket.emit('submitForm', { formId, responses });
    alert("Form submitted!");
    navigate("/home");
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{form.title}</h2>
      {isClosed && <p style={{ color: 'red' }}>Form has been submitted and is locked.</p>}
      <form onSubmit={(e) => e.preventDefault()}>
        {form.fields.map((f, i) => (
          <div key={i} style={{ marginBottom: 15 }}>
            <label>{f.label}</label><br />
            <input
              type={f.type}
              required={f.required}
              value={responses[f.label] || ''}
              onChange={e => handleChange(f.label, e.target.value)}
              disabled={isClosed || lockedFields[f.label]}
              onFocus={() =>
                socket.emit('lockField', { formId, field: f.label })
              }
              onBlur={() =>
                socket.emit('unlockField', { formId, field: f.label })
              }
            />
          </div>
        ))}
        <button type="button" onClick={handleSubmit} disabled={isClosed}>Submit</button>
      </form>
    </div>
  );
}
