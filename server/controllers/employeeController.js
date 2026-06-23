const { validationResult } = require('express-validator');
const Employee = require('../models/Employee');

exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, status, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Employee.countDocuments(filter);
    const employees = await Employee.find(filter)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('createdBy', 'name email');

    res.json({
      employees,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('createdBy', 'name email');
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ employee });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const existing = await Employee.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ message: 'Employee with this email already exists' });

    const employee = await Employee.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ employee });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ employee });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      departmentBreakdown,
      statusBreakdown,
      salaryByDepartment,
      monthlyHires,
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'active' }),
      Employee.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Employee.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Employee.aggregate([
        { $group: { _id: '$department', avgSalary: { $avg: '$salary' }, totalSalary: { $sum: '$salary' } } },
        { $sort: { avgSalary: -1 } },
      ]),
      Employee.aggregate([
        {
          $group: {
            _id: { year: { $year: '$hireDate' }, month: { $month: '$hireDate' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
    ]);

    res.json({
      overview: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: totalEmployees - activeEmployees,
      },
      departmentBreakdown,
      statusBreakdown,
      salaryByDepartment,
      monthlyHires,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
