import api from './api'

export const horariosService = {
  getAll: () => api.get('/horarios'),
  
  getById: (id) => api.get(`/horarios/${id}`),
  
  create: (data) => api.post('/horarios', data),
  
  update: (id, data) => api.put(`/horarios/${id}`, data),
  
  delete: (id) => api.delete(`/horarios/${id}`),
  
  getBySeccion: (seccionId) => api.get(`/horarios/seccion/${seccionId}`),
  
  getByDocente: (docenteId) => api.get(`/horarios/docente/${docenteId}`),
  
  checkConflicts: (data) => api.post('/horarios/check-conflicts', data)
}

export default horariosService