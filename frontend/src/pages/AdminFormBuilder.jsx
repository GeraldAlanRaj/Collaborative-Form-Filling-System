import { useState } from 'react';
import { privateApi } from '../utils/AxiosInterceptor';

export default function FormBuilder() {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ label: '', name: '', type: 'text', required: false, options: [] });
  const [optionInput, setOptionInput] = useState('');

  const addOption = () => {
    if (optionInput.trim() === '') return;
    setNewField(prev => ({
      ...prev,
      options: [...(prev.options || []), optionInput.trim()]
    }));
    setOptionInput('');
  };

  const addField = () => {
    if (!newField.label || !newField.name || !newField.type) return alert("Fill in all field details");
    setFields([...fields, newField]);
    setNewField({ label: '', name: '', type: 'text', required: false, options: [] });
  };

  const submitForm = async () => {
    if (!title || fields.length === 0) return alert("Title and at least one field are required");
    try {
      const res = await privateApi.post('/forms/create', { title, fields });
      alert('Form created! ID: ' + res.data.formId);
    } catch (err) {
      alert('Error creating form');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Form Builder (Admin)</h2>
      <input
        placeholder="Form Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: 10 }}
      />
      <div style={{ border: '1px solid #ccc', padding: 10 }}>
        <h3>Add Field</h3>
        <input
          placeholder="Field Label"
          value={newField.label}
          onChange={e => setNewField({ ...newField, label: e.target.value })}
        /><br />
        <input
          placeholder="Field Name (unique)"
          value={newField.name}
          onChange={e => setNewField({ ...newField, name: e.target.value })}
        /><br />
        <select
          value={newField.type}
          onChange={e => setNewField({ ...newField, type: e.target.value, options: [] })}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio</option>
          <option value="select">Dropdown</option>
        </select><br />
        <label>
          <input
            type="checkbox"
            checked={newField.required}
            onChange={e => setNewField({ ...newField, required: e.target.checked })}
          /> Required
        </label><br />

        {/* Show options input only for types that need it */}
        {['checkbox', 'radio', 'select'].includes(newField.type) && (
          <div>
            <input
              placeholder="Add option"
              value={optionInput}
              onChange={e => setOptionInput(e.target.value)}
            />
            <button type="button" onClick={addOption}>Add Option</button>
            <ul>
              {newField.options.map((opt, i) => <li key={i}>{opt}</li>)}
            </ul>
          </div>
        )}

        <button type="button" onClick={addField}>Add Field</button>
      </div>

      <h3>Preview Fields</h3>
      <ul>
        {fields.map((f, i) => (
          <li key={i}>
            {f.label} ({f.type}) {f.required ? '*' : ''} {f.options?.length > 0 && ` [${f.options.join(', ')}]`}
          </li>
        ))}
      </ul>

      <button onClick={submitForm}>Create Form</button>
    </div>
  );
}
