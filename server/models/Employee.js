const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    department: {
      type: String,
      required: true,
      enum: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'],
    },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['active', 'inactive', 'on_leave'], default: 'active' },
    hireDate: { type: Date, required: true },
    avatar: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

employeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

employeeSchema.index({ department: 1, status: 1 });
employeeSchema.index({ email: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
