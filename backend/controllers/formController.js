const Form = require('../models/Form.js');

const create_Form = async (req, res) => {
  try {
    const { title, fields } = req.body;

    if (!title || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: 'Form must have a title and at least one field' });
    }

    // Validate each field
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      if (!field.label || !field.name || !field.type) {
        return res.status(400).json({ error: `Field ${i + 1} is missing label, name, or type` });
      }

      if (['radio', 'checkbox', 'select'].includes(field.type)) {
        if (!Array.isArray(field.options) || field.options.length === 0) {
          return res.status(400).json({
            error: `Field ${i + 1} of type ${field.type} must have a non-empty options array`
          });
        }
      }
    }

    const form = new Form(req.body);
    await form.save();
    res.status(201).json({ formId: form.formId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getForm_byId = async (req, res) => {
  try {
    const { formId } = req.params;
    if (!formId) {
      return res.status(400).json({ error: 'Form ID is required' });
    }

    const form = await Form.findOne({ formId });
    if (!form) return res.status(404).json({ error: 'Form not found' });

    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { create_Form, getForm_byId };
