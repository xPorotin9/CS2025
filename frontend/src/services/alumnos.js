import api from './api'

export const alumnosService = {
  getAll: () => api.get('/alumnos'),
  getById: (id) => api.get(`/alumnos/${id}`),
  create: (data) => api.post('/alumnos', data),
  update: (id, data) => api.put(`/alumnos/${id}`, data),
  delete: (id) => api.delete(`/alumnos/${id}`),
  // Agrega aquí los otros métodos que uses en Alumnos.vue,
  // como updateEstado y getMatriculas, si tu backend los soporta:
  updateEstado: (id, estado) => api.patch(`/alumnos/${id}/estado`, { estado }),
  getMatriculas: (id) => api.get(`/alumnos/${id}/matriculas`),
}
