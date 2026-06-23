import { useState, useEffect, useCallback } from 'react';
import * as employeeApi from '../api/employees';

export const useEmployees = (initialParams = {}) => {
  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeApi.getEmployees(params);
      setEmployees(data.employees);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams, page: newParams.page ?? 1 }));
  }, []);

  const createEmployee = async (data) => {
    const result = await employeeApi.createEmployee(data);
    await fetchEmployees();
    return result;
  };

  const updateEmployee = async (id, data) => {
    const result = await employeeApi.updateEmployee(id, data);
    await fetchEmployees();
    return result;
  };

  const deleteEmployee = async (id) => {
    await employeeApi.deleteEmployee(id);
    await fetchEmployees();
  };

  return { employees, pagination, loading, error, params, updateParams, createEmployee, updateEmployee, deleteEmployee, refetch: fetchEmployees };
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await employeeApi.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { analytics, loading, error };
};
