const mongoose = require('mongoose');
const { v4 } = require('uuid');

const fieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: { type: [String], default: [] }
});

const formSchema = new mongoose.Schema({
  formId: { type: String, unique: true, default: v4 },
  title: { type: String, required: true },
  fields: [fieldSchema]
});

module.exports = mongoose.model('Form', formSchema);
