import api from './api'

export const planesEstudioService = {
  getAll: () => api.get('/planes-estudio'),
  getById: (id) => api.get(`/planes-estudio/${id}`),
  getByEscuela: (escuelaId) => api.get(`/planes-estudio/escuela/${escuelaId}`),
  create: (data) => api.post('/planes-estudio', data),
  update: (id, data) => api.put(`/planes-estudio/${id}`, data),
  delete: (id) => api.delete(`/planes-estudio/${id}`)
}