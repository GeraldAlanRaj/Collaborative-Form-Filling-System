const mongoose = require('mongoose');
const { v4 } = require('uuid');

const fieldSchema = new mongoose.Schema({
  label: String,
  type: String,
  required: Boolean
});

const formSchema = new mongoose.Schema({
  formId: { type: String, unique: true, default: v4 },
  title: String,
  fields: [fieldSchema]
});

module.exports = mongoose.model('Form', formSchema);
