import api from './api'

export const cursosService = {
  getAll: () => api.get('/cursos'),
  getById: (id) => api.get(`/cursos/${id}`),
  getByPlanEstudio: (planEstudioId) => api.get(`/cursos/plan-estudio/${planEstudioId}`),
  create: (data) => api.post('/cursos', data),
  update: (id, data) => api.put(`/cursos/${id}`, data),
  delete: (id) => api.delete(`/cursos/${id}`),
}
