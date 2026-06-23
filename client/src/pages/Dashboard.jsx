import { Link } from 'react-router-dom';
import { Users, UserCheck, UserX, TrendingUp, ArrowRight } from 'lucide-react';
import { useAnalytics } from '../hooks/useEmployees';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '18', color }}>
      <Icon size={20} />
    </div>
    <div className="stat-body">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value ?? '—'}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const { analytics, loading } = useAnalytics();
  const { user } = useAuth();

  const deptData = analytics?.departmentBreakdown?.map((d) => ({ name: d._id, value: d.count })) || [];
  const salaryData = analytics?.salaryByDepartment?.map((d) => ({
    dept: d._id.slice(0, 4),
    avg: Math.round(d.avgSalary / 1000),
  })) || [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Welcome back, {user?.name?.split(' ')[0]}</h2>
          <p className="page-subtitle">Here's what's happening with your team today.</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">
          Add Employee
        </Link>
      </div>

      {loading ? (
        <div className="loading-block"><div className="spinner" /></div>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard icon={Users} label="Total Employees" value={analytics?.overview?.total} color="#6366f1" />
            <StatCard icon={UserCheck} label="Active" value={analytics?.overview?.active} color="#10b981" />
            <StatCard icon={UserX} label="Inactive / On Leave" value={analytics?.overview?.inactive} color="#f59e0b" />
            <StatCard icon={TrendingUp} label="Departments" value={deptData.length} color="#ec4899" />
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>By Department</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Avg. Salary by Department (K)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={salaryData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="dept" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `$${v}K`} />
                  <Bar dataKey="avg" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="quick-actions">
            <Link to="/employees" className="quick-link">
              <Users size={16} /> View all employees <ArrowRight size={14} />
            </Link>
            <Link to="/analytics" className="quick-link">
              <TrendingUp size={16} /> Full analytics <ArrowRight size={14} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
