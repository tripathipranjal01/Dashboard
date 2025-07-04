const { body, param, validationResult } = require('express-validator');

// Validation middleware to check for errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Job validation rules
const validateJob = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string')
    .trim(),
  
  body('jobTitle')
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Job title must be between 1 and 200 characters')
    .trim(),
  
  body('company')
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name must be between 1 and 100 characters')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'])
    .withMessage('Status must be one of: Saved, Applied, Interviewing, Offer, Rejected'),
  
  body('jobLink')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Please provide a valid URL');
      }
    }),
  
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
    .trim(),
  
  body('salary')
    .optional()
    .trim(),
  
  body('location')
    .optional()
    .trim(),
  
  body('applicationDate')
    .optional()
    .isISO8601()
    .withMessage('Application date must be a valid date'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),
  
  handleValidationErrors
];

// Job update validation (allows partial updates)
const validateJobUpdate = [
  body('jobTitle')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Job title must be between 1 and 200 characters')
    .trim(),
  
  body('company')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Company name must be between 1 and 100 characters')
    .trim(),
  
  body('status')
    .optional()
    .isIn(['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'])
    .withMessage('Status must be one of: Saved, Applied, Interviewing, Offer, Rejected'),
  
  body('jobLink')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Please provide a valid URL');
      }
    }),
  
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
    .trim(),
  
  body('salary')
    .optional()
    .trim(),
  
  body('location')
    .optional()
    .trim(),
  
  body('applicationDate')
    .optional()
    .isISO8601()
    .withMessage('Application date must be a valid date'),
  
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Deadline must be a valid date'),
  
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),
  
  handleValidationErrors
];

// Parameter validation
const validateJobId = [
  param('jobId')
    .isMongoId()
    .withMessage('Invalid job ID format'),
  handleValidationErrors
];

const validateUserId = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('User ID must be a string')
    .trim(),
  handleValidationErrors
];

module.exports = {
  validateJob,
  validateJobUpdate,
  validateJobId,
  validateUserId,
  handleValidationErrors
};