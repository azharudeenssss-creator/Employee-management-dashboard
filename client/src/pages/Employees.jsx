import { useState, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useEmployees } from '../hooks/useEmployees';
import { useAuth } from '../context/AuthContext';
import EmployeeForm from '../components/employees/EmployeeForm';
import Modal from '../components/layout/Modal';

const DEPARTMENTS = ['', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design'];
const STATUSES = ['', 'active', 'inactive', 'on_leave'];

const statusColors = { active: '#10b981', inactive: '#94a3b8', on_leave: '#f59e0b' };

export default function Employees() {
  const { hasRole } = useAuth();
  const { employees, pagination, loading, error, params, updateParams, createEmployee, updateEmployee, deleteEmployee } = useEmployees({ page: 1, limit: 10 });

  const [modal, setModal] = useState(null); // null | 'create' | 'edit' | 'delete'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openEdit = (emp) => { setSelectedEmployee(emp); setModal('edit'); setActionError(''); };
  const openDelete = (emp) => { setSelectedEmployee(emp); setModal('delete'); setActionError(''); };
  const closeModal = () => { setModal(null); setSelectedEmployee(null); setActionError(''); };

  const handleCreate = async (data) => {
    setSubmitting(true);
    setActionError('');
    try {
      await createEmployee(data);
      closeModal();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (data) => {
    setSubmitting(true);
    setActionError('');
    try {
      await updateEmployee(selectedEmployee._id, data);
      closeModal();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await deleteEmployee(selectedEmployee._id);
      closeModal();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = useCallback((e) => {
    updateParams({ search: e.target.value, page: 1 });
  }, [updateParams]);

  const getDefaultValues = (emp) => emp ? {
    ...emp,
    hireDate: emp.hireDate?.slice(0, 10),
  } : null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Employees</h2>
          <p className="page-subtitle">{pagination.total} total employees</p>
        </div>
        {hasRole('admin', 'hr') && (
          <button className="btn btn-primary" onClick={() => { setModal('create'); setActionError(''); }}>
            <Plus size={16} /> Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input type="search" placeholder="Search by name, email, position…" onChange={handleSearch} />
        </div>
        <div className="filter-group">
          <Filter size={15} />
          <select onChange={(e) => updateParams({ department: e.target.value })} value={params.department || ''}>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d || 'All departments'}</option>)}
          </select>
          <select onChange={(e) => updateParams({ status: e.target.value })} value={params.status || ''}>
            {STATUSES.map((s) => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All statuses'}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Table */}
      <div className="table-card">
        {loading ? (
          <div className="loading-block"><div className="spinner" /></div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <p>No employees found.</p>
            {hasRole('admin', 'hr') && (
              <button className="btn btn-primary" onClick={() => setModal('create')}>Add your first employee</button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Hire Date</th>
                  {hasRole('admin', 'hr') && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="employee-name-cell">
                        <div className="avatar-sm">{emp.firstName[0]}{emp.lastName[0]}</div>
                        <div>
                          <p className="fw-medium">{emp.fullName}</p>
                          <p className="text-muted text-sm">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-dept">{emp.department}</span></td>
                    <td>{emp.position}</td>
                    <td>${emp.salary.toLocaleString()}</td>
                    <td>
                      <span className="status-dot" style={{ color: statusColors[emp.status] }}>
                        ● {emp.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{new Date(emp.hireDate).toLocaleDateString()}</td>
                    {hasRole('admin', 'hr') && (
                      <td>
                        <div className="action-btns">
                          <button className="icon-btn" onClick={() => openEdit(emp)} title="Edit"><Pencil size={15} /></button>
                          {hasRole('admin') && (
                            <button className="icon-btn danger" onClick={() => openDelete(emp)} title="Delete"><Trash2 size={15} /></button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </span>
            <div className="pagination-btns">
              <button className="icon-btn" disabled={pagination.page <= 1} onClick={() => updateParams({ page: pagination.page - 1 })}>
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`page-btn ${p === pagination.page ? 'active' : ''}`} onClick={() => updateParams({ page: p })}>
                  {p}
                </button>
              ))}
              <button className="icon-btn" disabled={pagination.page >= pagination.pages} onClick={() => updateParams({ page: pagination.page + 1 })}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={modal === 'create'} onClose={closeModal} title="Add Employee">
        {actionError && <div className="alert alert-error">{actionError}</div>}
        <EmployeeForm onSubmit={handleCreate} onCancel={closeModal} isSubmitting={submitting} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Edit Employee">
        {actionError && <div className="alert alert-error">{actionError}</div>}
        <EmployeeForm defaultValues={getDefaultValues(selectedEmployee)} onSubmit={handleUpdate} onCancel={closeModal} isSubmitting={submitting} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Delete Employee" size="sm">
        <p>Are you sure you want to delete <strong>{selectedEmployee?.fullName}</strong>? This action cannot be undone.</p>
        {actionError && <div className="alert alert-error">{actionError}</div>}
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={submitting}>
            {submitting ? <span className="spinner-sm" /> : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
