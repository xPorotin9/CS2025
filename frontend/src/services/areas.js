import api from './api'

export const areasService = {
  getAll: () => api.get('/areas'),
  getById: (id) => api.get(`/areas/${id}`),
  getCursosByArea: (id) => api.get(`/areas/${id}/cursos`),
  create: (data) => api.post('/areas', data),
  update: (id, data) => api.put(`/areas/${id}`, data),
  delete: (id) => api.delete(`/areas/${id}`)
}