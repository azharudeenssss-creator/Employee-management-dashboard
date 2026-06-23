const express = require('express');
const { body } = require('express-validator');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAnalytics,
} = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

const employeeValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('department')
    .isIn(['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'])
    .withMessage('Invalid department'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('salary').isNumeric().withMessage('Salary must be a number').custom((v) => v >= 0),
  body('hireDate').isISO8601().withMessage('Valid hire date required'),
];

router.get('/analytics', getAnalytics);
router.get('/', getEmployees);
router.get('/:id', getEmployee);
router.post('/', authorize('admin', 'hr'), employeeValidation, createEmployee);
router.put('/:id', authorize('admin', 'hr'), employeeValidation, updateEmployee);
router.delete('/:id', authorize('admin'), deleteEmployee);

module.exports = router;
