const express = require('express');
const { create_Form, getForm_byId } = require('../controllers/formController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware.js');

const router = express.Router();

// Create a form (admin)
router.post('/create', authenticate, authorizeRoles('admin'), create_Form);

// Get a form by ID (user)
router.get('/:formId', authenticate, getForm_byId);

module.exports = router;
