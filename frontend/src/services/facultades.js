import api from './api'

export const facultadesService = {
  getAll: () => api.get('/facultades'),
  getById: (id) => api.get(`/facultades/${id}`),
  create: (data) => api.post('/facultades', data),
  update: (id, data) => api.put(`/facultades/${id}`, data),
  delete: (id) => api.delete(`/facultades/${id}`)
}