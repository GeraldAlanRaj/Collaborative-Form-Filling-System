import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { privateApi } from '../utils/AxiosInterceptor';
import socket from '../Socket';
import '../styles/FillForm.css'

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
    <div className="container">
        <h2 className="form-title">{form.title}</h2>
        <div className="form-wrapper">
        {isClosed && <p className="form-closed">Form has been submitted and is locked.</p>}
        <form onSubmit={(e) => e.preventDefault()}>
          {form.fields.map((f, i) => (
            <div className="form-field" key={i}>
              <label><strong>{f.label}{f.required ? ' *' : ''}</strong></label><br />
              {['text', 'number', 'date'].includes(f.type) ? (
                <input
                  type={f.type}
                  value={responses[f.label] || ''}
                  onChange={e => handleChange(f.label, e.target.value)}
                  disabled={isClosed || lockedFields[f.label]}
                  onFocus={() => socket.emit('lockField', { formId, field: f.label })}
                  onBlur={() => socket.emit('unlockField', { formId, field: f.label })}
                  className="input-field"
                />
              ) : f.type === 'textarea' ? (
                <textarea
                  value={responses[f.label] || ''}
                  onChange={e => handleChange(f.label, e.target.value)}
                  disabled={isClosed || lockedFields[f.label]}
                  onFocus={() => socket.emit('lockField', { formId, field: f.label })}
                  onBlur={() => socket.emit('unlockField', { formId, field: f.label })}
                  className="input-field"
                />
              ) : f.type === 'radio' ? (
                f.options?.map((opt, j) => (
                  <label key={j} className="option-label">
                    <input
                      type="radio"
                      name={f.label}
                      value={opt}
                      checked={responses[f.label] === opt}
                      onChange={e => handleChange(f.label, e.target.value)}
                      disabled={isClosed || lockedFields[f.label]}
                      className="option-input"
                    />
                    {opt}
                  </label>
                ))
              ) : f.type === 'checkbox' ? (
                f.options?.map((opt, j) => (
                  <label key={j} className="option-label">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={(responses[f.label] || []).includes(opt)}
                      onChange={() => handleCheckboxChange(f.label, opt)}
                      disabled={isClosed || lockedFields[f.label]}
                      className="option-input"
                    />
                    {opt}
                  </label>
                ))
              ) : f.type === 'select' ? (
                <select
                  value={responses[f.label] || ''}
                  onChange={e => handleChange(f.label, e.target.value)}
                  disabled={isClosed || lockedFields[f.label]}
                  className="input-field"
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
                  className="input-field"
                />
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isClosed}
            className="submit-btn"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
