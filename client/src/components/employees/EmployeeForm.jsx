import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];
const STATUSES = ['active', 'inactive', 'on_leave'];

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  department: z.enum(DEPARTMENTS, { required_error: 'Department is required' }),
  position: z.string().min(1, 'Position is required'),
  salary: z.coerce.number().min(0, 'Salary must be non-negative'),
  status: z.enum(['active', 'inactive', 'on_leave']),
  hireDate: z.string().min(1, 'Hire date is required'),
});

export default function EmployeeForm({ defaultValues, onSubmit, onCancel, isSubmitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { status: 'active', hireDate: new Date().toISOString().slice(0, 10) },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="employee-form" noValidate>
      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input type="text" placeholder="Jane" className={errors.firstName ? 'error' : ''} {...register('firstName')} />
          {errors.firstName && <span className="field-error">{errors.firstName.message}</span>}
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input type="text" placeholder="Smith" className={errors.lastName ? 'error' : ''} {...register('lastName')} />
          {errors.lastName && <span className="field-error">{errors.lastName.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Email *</label>
          <input type="email" placeholder="jane@company.com" className={errors.email ? 'error' : ''} {...register('email')} />
          {errors.email && <span className="field-error">{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="tel" placeholder="+1 555 000 0000" {...register('phone')} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Department *</label>
          <select className={errors.department ? 'error' : ''} {...register('department')}>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.department && <span className="field-error">{errors.department.message}</span>}
        </div>
        <div className="form-group">
          <label>Position *</label>
          <input type="text" placeholder="Software Engineer" className={errors.position ? 'error' : ''} {...register('position')} />
          {errors.position && <span className="field-error">{errors.position.message}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Salary ($) *</label>
          <input type="number" placeholder="75000" min="0" className={errors.salary ? 'error' : ''} {...register('salary')} />
          {errors.salary && <span className="field-error">{errors.salary.message}</span>}
        </div>
        <div className="form-group">
          <label>Hire Date *</label>
          <input type="date" className={errors.hireDate ? 'error' : ''} {...register('hireDate')} />
          {errors.hireDate && <span className="field-error">{errors.hireDate.message}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select {...register('status')}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <span className="spinner-sm" /> : (defaultValues ? 'Save Changes' : 'Add Employee')}
        </button>
      </div>
    </form>
  );
}
