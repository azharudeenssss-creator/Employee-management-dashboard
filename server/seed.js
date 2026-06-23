/**
 * Seed script – run once to populate dev data
 * Usage: node seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Employee = require('./models/Employee');

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];

const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const employees = [
  { firstName: 'Alice', lastName: 'Chen', email: 'alice@company.com', department: 'Engineering', position: 'Senior Engineer', salary: 130000, status: 'active' },
  { firstName: 'Bob', lastName: 'Martinez', email: 'bob@company.com', department: 'Marketing', position: 'Marketing Manager', salary: 95000, status: 'active' },
  { firstName: 'Carol', lastName: 'Johnson', email: 'carol@company.com', department: 'HR', position: 'HR Business Partner', salary: 85000, status: 'active' },
  { firstName: 'David', lastName: 'Kim', email: 'david@company.com', department: 'Engineering', position: 'Full Stack Developer', salary: 115000, status: 'active' },
  { firstName: 'Emma', lastName: 'Wilson', email: 'emma@company.com', department: 'Sales', position: 'Account Executive', salary: 90000, status: 'active' },
  { firstName: 'Frank', lastName: 'Brown', email: 'frank@company.com', department: 'Finance', position: 'Financial Analyst', salary: 88000, status: 'inactive' },
  { firstName: 'Grace', lastName: 'Lee', email: 'grace@company.com', department: 'Design', position: 'UX Designer', salary: 100000, status: 'active' },
  { firstName: 'Henry', lastName: 'Davis', email: 'henry@company.com', department: 'Operations', position: 'Operations Manager', salary: 95000, status: 'on_leave' },
  { firstName: 'Isabella', lastName: 'Taylor', email: 'isabella@company.com', department: 'Engineering', position: 'DevOps Engineer', salary: 125000, status: 'active' },
  { firstName: 'James', lastName: 'Anderson', email: 'james@company.com', department: 'Sales', position: 'Sales Director', salary: 140000, status: 'active' },
  { firstName: 'Kate', lastName: 'Thomas', email: 'kate@company.com', department: 'Marketing', position: 'Content Strategist', salary: 78000, status: 'active' },
  { firstName: 'Liam', lastName: 'Jackson', email: 'liam@company.com', department: 'Engineering', position: 'Backend Engineer', salary: 118000, status: 'active' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/employee_db');
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([User.deleteMany({}), Employee.deleteMany({})]);

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'password123',
    role: 'admin',
  });
  console.log('Created admin: admin@company.com / password123');

  // Create HR user
  await User.create({ name: 'HR Manager', email: 'hr@company.com', password: 'password123', role: 'hr' });
  console.log('Created HR: hr@company.com / password123');

  // Seed employees
  const start = new Date(2022, 0, 1);
  const end = new Date();
  for (const emp of employees) {
    await Employee.create({ ...emp, hireDate: randomDate(start, end), phone: `+1 555 ${Math.floor(Math.random() * 9000000 + 1000000)}`, createdBy: admin._id });
  }
  console.log(`Seeded ${employees.length} employees`);

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((err) => { console.error(err); process.exit(1); });
