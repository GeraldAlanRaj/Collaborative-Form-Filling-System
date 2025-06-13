import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import socket from '../Socket';

export default function FillForm() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Load form structure
    axios.get(`http://localhost:8080/api/forms/${formId}`).then((res) => {
      setForm(res.data);
    });

    // Join WebSocket room
    socket.emit('joinForm', { formId });

    // Socket listeners
    socket.on('loadResponse', (data) => {
      if (data) setResponses(data);
    });

    socket.on('formStatus', ({ isClosed }) => {
      setIsClosed(isClosed);
    });

    socket.on('responseUpdated', ({ field, value }) => {
      setResponses((prev) => ({ ...prev, [field]: value }));
    });

    // Cleanup on unmount
    return () => {
      socket.off('loadResponse');
      socket.off('formStatus');
      socket.off('responseUpdated');
    };
  }, [formId]);

  const handleChange = (field, value) => {
    setResponses((prev) => ({ ...prev, [field]: value }));
    socket.emit('updateResponse', { formId, field, value });
  };

  const handleSubmit = () => {
    socket.emit('submitForm', { formId, responses });
  };

  if (!form) return <div>Loading form...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{form.title}</h2>
      {isClosed && <p style={{ color: 'red' }}>Form has been submitted and is locked.</p>}
      <form>
        {form.fields.map((field, idx) => (
          <div key={idx} style={{ marginBottom: 15 }}>
            <label>{field.label}</label>
            <br />
            <input
              type={field.type}
              value={responses[field.label] || ''}
              onChange={(e) => handleChange(field.label, e.target.value)}
              disabled={isClosed}
            />
          </div>
        ))}
        <button type="button" onClick={handleSubmit} disabled={isClosed}>
          Submit
        </button>
      </form>
    </div>
  );
}
