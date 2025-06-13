const Form = require('../models/Form.js');

const create_Form = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Form data is required' });
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
