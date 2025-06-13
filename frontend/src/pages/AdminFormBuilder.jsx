import React, { useState } from 'react';
import axios from 'axios';

const inputTypes = ['text', 'email', 'number', 'textarea', 'date', 'password'];

export default function AdminFormBuilder() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [formId, setFormId] = useState(null);

  const handleAddField = () => {
    setFields([...fields, { label: '', type: 'text', required: false }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleRemoveField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const handleSubmit = async () => {
    if (!title.trim() || fields.length === 0) {
      alert("Please add a form title and at least one field.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/forms/create', {
        title,
        fields
      });
      setFormId(res.data.formId);
    } catch (err) {
      alert("Error creating form");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create a Form (Admin)</h2>

      <input
        type="text"
        placeholder="Form Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      {fields.map((field, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <input
            type="text"
            placeholder="Field Label"
            value={field.label}
            onChange={e => handleFieldChange(idx, 'label', e.target.value)}
            style={{ marginRight: 10 }}
          />
          <select
            value={field.type}
            onChange={e => handleFieldChange(idx, 'type', e.target.value)}
            style={{ marginRight: 10 }}
          >
            {inputTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={field.required}
              onChange={e => handleFieldChange(idx, 'required', e.target.checked)}
            /> Required
          </label>
          <button onClick={() => handleRemoveField(idx)} style={{ marginLeft: 10 }}>Remove</button>
        </div>
      ))}

      <button onClick={handleAddField}>Add Field</button>
      <br /><br />
      <button onClick={handleSubmit}>Create Form</button>

      {formId && (
        <div style={{ marginTop: 20 }}>
          <strong>Form Created!</strong><br />
          Share this ID with users: <code>{formId}</code><br />
          <a href={`/fill/${formId}`}>Open Form</a>
        </div>
      )}
    </div>
  );
}
