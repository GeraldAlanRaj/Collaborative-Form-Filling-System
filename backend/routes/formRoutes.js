const express = require('express')
const Form = require ('../models/Form.js');

const router = express.Router();

// Create a form (admin)
router.post('/create', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json({ formId: form.formId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a form by ID
router.get('/:formId', async (req, res) => {
  try {
    const form = await Form.findOne({ formId: req.params.formId });
    if (!form) return res.status(404).json({ error: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
