import api from './api'

export const escuelasService = {
  getAll: () => api.get('/escuelas'),
  getById: (id) => api.get(`/escuelas/${id}`),
  getByFacultad: (facultadId) => api.get(`/escuelas/facultad/${facultadId}`),
  create: (data) => api.post('/escuelas', data),
  update: (id, data) => api.put(`/escuelas/${id}`, data),
  delete: (id) => api.delete(`/escuelas/${id}`)
}