const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: String,
  name: String,
  type: String,
  required: Boolean,
  options: [String],
});

const formSchema = new mongoose.Schema({
  formId: { type: String, unique: true },
  title: String,
  fields: [fieldSchema],
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add this
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
