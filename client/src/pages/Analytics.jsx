import { useAnalytics } from '../hooks/useEmployees';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Analytics() {
  const { analytics, loading, error } = useAnalytics();

  if (loading) return <div className="page"><div className="loading-block"><div className="spinner" /></div></div>;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!analytics) return null;

  const deptData = analytics.departmentBreakdown?.map((d) => ({ name: d._id, value: d.count })) || [];
  const statusData = analytics.statusBreakdown?.map((d) => ({ name: d._id.replace('_', ' '), value: d.count })) || [];
  const salaryData = analytics.salaryByDepartment?.map((d) => ({
    department: d._id,
    avgSalary: Math.round(d.avgSalary),
    totalSalary: Math.round(d.totalSalary),
  })) || [];
  const hiresData = analytics.monthlyHires?.map((d) => ({
    month: `${MONTHS[d._id.month - 1]} ${d._id.year}`,
    hires: d.count,
  })) || [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Analytics</h2>
          <p className="page-subtitle">Workforce insights and trends</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Headcount by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" name="Employees" radius={[4, 4, 0, 0]}>
                {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Employee Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card chart-wide">
          <h3>Average Salary by Department ($)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={salaryData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
              <Bar dataKey="avgSalary" name="Avg Salary" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card chart-wide">
          <h3>Monthly Hires (Last 12 months)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={hiresData}>
              <defs>
                <linearGradient id="hiresGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="hires" name="Hires" stroke="#6366f1" fill="url(#hiresGrad)" strokeWidth={2} dot={{ r: 4, fill: '#6366f1' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
