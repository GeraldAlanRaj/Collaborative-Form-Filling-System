const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: { type: String, required: true },
  responses: {}, // To store the responses
  isClosed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Response', responseSchema);
