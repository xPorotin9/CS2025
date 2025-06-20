import api from './api'

export const seccionesService = {
  getAll: (params = {}) => {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach(key => {
      if (params[key]) searchParams.append(key, params[key])
    })
    const queryString = searchParams.toString()
    return api.get(`/secciones${queryString ? '?' + queryString : ''}`)
  },
  
  getById: (id) => api.get(`/secciones/${id}`),
  
  create: (data) => api.post('/secciones', data),
  
  update: (id, data) => api.put(`/secciones/${id}`, data),
  
  delete: (id) => api.delete(`/secciones/${id}`),
  
  getByPeriodo: (periodoId) => api.get(`/secciones/periodo/${periodoId}`),
  
  getByCursoAndPeriodo: (cursoId, periodoId) => 
    api.get(`/secciones/curso/${cursoId}/periodo/${periodoId}`),
  
  getDisponiblesParaMatricula: (periodoId, alumnoId) => 
    api.get(`/secciones/disponibles/periodo/${periodoId}/alumno/${alumnoId}`)
}

export default seccionesService