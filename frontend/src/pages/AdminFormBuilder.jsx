import { useState } from 'react';
import { privateApi } from '../utils/AxiosInterceptor';
import '../styles/AdminFormBuilder.css'
import AdminFormsList from './AdminFormList';

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
      if (!Array.isArray(field.options) || field.options.length < 2) return false;
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
    <div className="container">
      <div className="form-box">
        <h2>Create a new form</h2>
        <input
          placeholder="Form Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="input"
        />

        <div className="field-box">
          <h3>Add Field</h3>
          <input
            placeholder="Field Label"
            value={newField.label}
            onChange={e => setNewField({ ...newField, label: e.target.value })}
            className="input"
          />
          <input
            placeholder="Field Name (unique)"
            value={newField.name}
            onChange={e => setNewField({ ...newField, name: e.target.value })}
            className="input"
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
            className="input"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="select">Dropdown</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={newField.required}
              onChange={e => setNewField({ ...newField, required: e.target.checked })}
            /> Required
          </label>

          {['checkbox', 'radio', 'select'].includes(newField.type) && (
            <div className="option-input-box">
              <input
                placeholder="Add option"
                value={optionInput}
                onChange={e => setOptionInput(e.target.value)}
                className="option-input"
              />
              <button type="button" onClick={addOption} className="button-blue">
                Add Option
              </button>
              <ul>
                {newField.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            </div>
          )}

          <button type="button" onClick={addField} className="button-green">
            Add Field
          </button>
        </div>

        <h3>Preview Fields</h3>
        <ul className="preview-list">
          {fields.map((f, i) => (
            <li key={i}>
              {f.label} ({f.type}) {f.required ? '*' : ''}{" "}
              {f.options?.length > 0 && `[${f.options.join(', ')}]`}
            </li>
          ))}
        </ul>

        <button type="button" onClick={submitForm} className="button-submit">
          Create Form
        </button>
      </div>
      <div>
        <AdminFormsList />
      </div>
    </div>
  );
}
