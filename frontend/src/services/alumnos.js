import api from './api'

export const alumnosService = {
  getAll: () => api.get('/alumnos'),
  getById: (id) => api.get(`/alumnos/${id}`),
  create: (data) => api.post('/alumnos', data),
  update: (id, data) => api.put(`/alumnos/${id}`, data),
  delete: (id) => api.delete(`/alumnos/${id}`),
  updateEstado: (id, estado) => api.patch(`/alumnos/${id}/estado`, { estado }),
  getMatriculas: (id) => api.get(`/alumnos/${id}/matriculas`),
  
  // Nueva función para obtener alumnos con información completa para matrícula
  getAllForMatricula: () => api.get('/alumnos?includeFullInfo=true'),
  
  // Función para obtener información completa de un alumno
  getFullInfo: (id) => api.get(`/alumnos/${id}?includeFullInfo=true`)
}