import api from './client';

export const getEmployees = async (params = {}) => {
  const { data } = await api.get('/employees', { params });
  return data;
};

export const getEmployee = async (id) => {
  const { data } = await api.get(`/employees/${id}`);
  return data;
};

export const createEmployee = async (employeeData) => {
  const { data } = await api.post('/employees', employeeData);
  return data;
};

export const updateEmployee = async (id, employeeData) => {
  const { data } = await api.put(`/employees/${id}`, employeeData);
  return data;
};

export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/employees/${id}`);
  return data;
};

export const getAnalytics = async () => {
  const { data } = await api.get('/employees/analytics');
  return data;
};
