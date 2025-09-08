const express = require('express');
const { create_Form, getForm_byId, getFormResponses, getFormsByAdmin } = require('../controllers/formController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

// Create form
router.post('/create', authenticate, authorizeRoles('admin'), create_Form);

// Get responses of a form (admin)
router.get('/responses/:formId', authenticate, authorizeRoles('admin'), getFormResponses);

// New route: Get all forms created by admin
router.get('/my-forms', authenticate, authorizeRoles('admin'), getFormsByAdmin);

// Then the dynamic route
router.get('/:formId', authenticate, getForm_byId);


module.exports = router;
