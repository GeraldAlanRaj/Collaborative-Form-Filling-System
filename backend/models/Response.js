const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  responses: {}, // field: value map
  isClosed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Response', responseSchema);
