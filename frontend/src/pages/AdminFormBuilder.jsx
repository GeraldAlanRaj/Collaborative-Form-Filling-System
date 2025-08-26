import { useState } from 'react';
import { privateApi } from '../utils/AxiosInterceptor';

export default function FormBuilder() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    label: '',
    name: '',
    type: 'text',
    required: false,
    options: []
  });
  const [optionInput, setOptionInput] = useState('');

  const resetNewField = () => {
    setNewField({
      label: '',
      name: '',
      type: 'text',
      required: false,
      options: []
    });
  };

  const addOption = () => {
    const trimmed = optionInput.trim();
    if (!trimmed) return;
    if (newField.options.includes(trimmed)) return alert("Duplicate option");
    setNewField(prev => ({
      ...prev,
      options: [...prev.options, trimmed]
    }));
    setOptionInput('');
  };

  const validateField = (field) => {
    if (!field.label || !field.name || !field.type) return false;

    const needsOptions = ['checkbox', 'radio', 'select'].includes(field.type);
    if (needsOptions) {
      if (!Array.isArray(field.options) || field.options.length < 2) {
        return false;
      }
      const hasEmpty = field.options.some(opt => !opt.trim());
      if (hasEmpty) return false;
    }

    return true;
  };

  const addField = () => {
    if (!validateField(newField)) {
      return alert("Invalid field. Make sure all required fields are filled, and options are valid (min 2 for checkbox/radio/select).");
    }

    setFields([...fields, newField]);
    resetNewField();
  };

  const submitForm = async () => {
    if (!title.trim()) return alert("Title is required.");
    if (fields.length === 0) return alert("Add at least one field.");

    try {
      const res = await privateApi.post('/forms/create', { title, fields });
      alert('Form created! ID: ' + res.data.formId);
      setTitle('');
      setFields([]);
    } catch (err) {
      console.error(err);
      alert('Error creating form');
    }
  };

  return (
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
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#222" }}>Form Builder (Admin)</h2>
        <input
          placeholder="Form Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', marginBottom: 10, padding: "0.8rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", fontSize: "1rem" }}
        />
        <div style={{ border: '1px solid #d1d5db', padding: 16, borderRadius: "0.75rem", marginBottom: 20 }}>
          <h3 style={{ marginBottom: "0.5rem" }}>Add Field</h3>
          <input
            placeholder="Field Label"
            value={newField.label}
            onChange={e => setNewField({ ...newField, label: e.target.value })}
            style={{ width: '100%', marginBottom: 8, padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <input
            placeholder="Field Name (unique)"
            value={newField.name}
            onChange={e => setNewField({ ...newField, name: e.target.value })}
            style={{ width: '100%', marginBottom: 8, padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          />
          <select
            value={newField.type}
            onChange={e => {
              const newType = e.target.value;
              setNewField({
                ...newField,
                type: newType,
                options: ['radio', 'checkbox', 'select'].includes(newType) ? [] : []
              });
            }}
            style={{ width: '100%', marginBottom: 8, padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="select">Dropdown</option>
          </select>
          <label style={{ marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={newField.required}
              onChange={e => setNewField({ ...newField, required: e.target.checked })}
              style={{ marginRight: 6 }}
            /> Required
          </label>
          {/* Options input for checkbox/radio/select */}
          {['checkbox', 'radio', 'select'].includes(newField.type) && (
            <div style={{ marginBottom: 8 }}>
              <input
                placeholder="Add option"
                value={optionInput}
                onChange={e => setOptionInput(e.target.value)}
                style={{ width: '70%', padding: "0.6rem", borderRadius: "0.5rem", border: "1px solid #d1d5db", marginRight: 8 }}
              />
              <button type="button" onClick={addOption} style={{ padding: "0.6rem 1rem", borderRadius: "0.5rem", background: "#2563eb", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" }}>Add Option</button>
              <ul style={{ marginTop: 8 }}>
                {newField.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          )}
          <button type="button" onClick={addField} style={{ padding: "0.7rem 1.2rem", borderRadius: "0.5rem", background: "#16a34a", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", marginTop: 8 }}>Add Field</button>
        </div>
        <h3 style={{ marginBottom: "0.5rem" }}>Preview Fields</h3>
        <ul style={{ marginBottom: 20 }}>
          {fields.map((f, i) => (
            <li key={i}>
              {f.label} ({f.type}) {f.required ? '*' : ''}{" "}
              {f.options?.length > 0 && ` [${f.options.join(', ')}]`}
            </li>
          ))}
        </ul>
        <button onClick={submitForm} style={{ width: "100%", padding: "0.9rem", borderRadius: "0.5rem", background: "#2563eb", color: "#fff", border: "none", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}>Create Form</button>
      </div>
    </div>
  );
}
