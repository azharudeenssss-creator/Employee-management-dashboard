import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Users } from 'lucide-react';
import { register as apiRegister } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'hr', 'viewer']),
});

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'viewer' },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await apiRegister(data);
      await login({ email: data.email, password: data.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo"><Users size={28} /></div>
          <h1>ASKEVA Register</h1>
          <p>Create your account</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" placeholder="Jane Smith" className={errors.name ? 'error' : ''} {...register('name')} />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="you@company.com" className={errors.email ? 'error' : ''} {...register('email')} />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                className={errors.password ? 'error' : ''}
                {...register('password')}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" className={errors.role ? 'error' : ''} {...register('role')}>
              <option value="viewer">Viewer</option>
              <option value="hr">HR Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && <span className="field-error">{errors.role.message}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
            {isSubmitting ? <span className="spinner-sm" /> : 'Create account'}
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
