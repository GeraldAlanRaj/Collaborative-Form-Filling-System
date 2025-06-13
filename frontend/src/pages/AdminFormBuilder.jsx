import { useState } from 'react';
import axiosInstance from '../utils/AxiosInterceptor';

const inputTypes = ['text', 'email', 'number', 'textarea', 'date', 'password'];

export default function AdminFormBuilder() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [formId, setFormId] = useState(null);

  const handleAddField = () => {
    setFields([...fields, { label: '', type: 'text', required: false }]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleSubmit = async () => {
    if (!title.trim() || fields.length === 0) {
      alert("Please add title and at least one field.");
      return;
    }
    try {
      const res = await axiosInstance.post('/forms/create', { title, fields });
      console.log("Response:", res.data);
      setFormId(res.data.formId || res.data.form?._id);
    } catch (err) {
      console.error("Form creation error:", err.response || err);
      alert(err.response?.data?.message || "Error creating form");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create a Form (Admin)</h2>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Form Title"
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />

      {fields.map((f, i) => (
        <div key={i} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <input
            value={f.label}
            onChange={e => handleFieldChange(i, 'label', e.target.value)}
            placeholder="Field Label"
            style={{ marginRight: 10 }}
          />
          <select
            value={f.type}
            onChange={e => handleFieldChange(i, 'type', e.target.value)}
            style={{ marginRight: 10 }}
          >
            {inputTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={f.required}
              onChange={e => handleFieldChange(i, 'required', e.target.checked)}
            /> Required
          </label>
          <button onClick={() => handleRemoveField(i)} style={{ marginLeft: 10 }}>Remove</button>
        </div>
      ))}

      <button onClick={handleAddField}>Add Field</button><br /><br />
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
