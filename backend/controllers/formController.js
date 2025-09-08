const Form = require('../models/Form.js');
const Response = require('../models/Response.js');
const { v4: uuidv4 } = require('uuid');

// Get all responses for a form (admin)
const getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;
    if (!formId) {
      return res.status(400).json({ error: 'Form ID is required' });
    }

    const responses = await Response.find({ formId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching responses' });
  }
};

// Create a new form (admin)
const create_Form = async (req, res) => {
  try {
    const { title, fields } = req.body;

    if (!title || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: 'Form must have a title and at least one field' });
    }

    // Validate fields
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

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: Admin ID missing from request' });
    }

    const form = new Form({
      formId: uuidv4(),
      title,
      fields,
      adminId: req.user.id,  // Use req.user.id from decoded JWT
    });

    await form.save();
    res.status(201).json({ formId: form.formId });
  } catch (err) {
    console.error('Form Creation Error:', err);
    res.status(500).json({ error: 'Server error while creating form' });
  }
};

// Get form by formId
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

// Get all forms created by logged-in admin
const mongoose = require('mongoose');

const getFormsByAdmin = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: Admin ID missing from JWT" });
    }

    // Convert string to ObjectId
    const adminId = new mongoose.Types.ObjectId(req.user.id);

    const forms = await Form.find({ adminId }).select('formId title createdAt updatedAt');

    if (!forms || forms.length === 0) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json(forms);
  } catch (err) {
    console.error("getFormsByAdmin error:", err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = { create_Form, getForm_byId, getFormResponses, getFormsByAdmin };
