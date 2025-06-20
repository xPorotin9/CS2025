<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-th-list text-success me-2"></i>Secciones y Horarios</h1>
      <button class="btn btn-success" @click="openNewSeccion">
        <i class="fas fa-plus me-2"></i>Nueva Sección
      </button>
    </div>

    <!-- Filtros -->
    <div class="card shadow-sm mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-3">
            <label class="form-label">Periodo Académico</label>
            <select class="form-select" v-model="filterPeriodo" @change="loadSecciones">
              <option value="">Todos los periodos</option>
              <option v-for="periodo in periodosAcademicos" :key="periodo.id" :value="periodo.id">
                {{ periodo.codigo }} - {{ periodo.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Curso</label>
            <select class="form-select" v-model="filterCurso" @change="loadSecciones">
              <option value="">Todos los cursos</option>
              <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                {{ curso.codigo }} - {{ curso.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Docente</label>
            <select class="form-select" v-model="filterDocente" @change="loadSecciones">
              <option value="">Todos los docentes</option>
              <option v-for="docente in docentes" :key="docente.id" :value="docente.id">
                {{ docente.codigo }} - {{ docente.usuario.nombre }} {{ docente.usuario.apellido }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Estado</label>
            <select class="form-select" v-model="filterActivo" @change="loadSecciones">
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de secciones -->
    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success"></div>
          <p class="mt-2">Cargando secciones...</p>
        </div>

        <div v-else-if="secciones.length === 0" class="text-center py-5">
          <i class="fas fa-th-list fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay secciones registradas</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Periodo</th>
                <th>Curso</th>
                <th>Sección</th>
                <th>Docente</th>
                <th>Capacidad</th>
                <th>Horarios</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="seccion in secciones" :key="seccion.id">
                <td>
                  <span class="badge bg-info">{{ seccion.periodoAcademico?.codigo }}</span>
                  <br>
                  <small>{{ seccion.periodoAcademico?.nombre }}</small>
                </td>
                <td>
                  <strong>{{ seccion.curso?.codigo }}</strong>
                  <br>
                  <small class="text-muted">{{ seccion.curso?.nombre }}</small>
                  <br>
                  <span class="badge bg-primary">{{ seccion.curso?.ciclo }}° Ciclo</span>
                </td>
                <td>
                  <span class="badge bg-secondary fs-6">{{ seccion.nombre }}</span>
                </td>
                <td>
                  <strong>{{ seccion.docente?.usuario?.nombre }} {{ seccion.docente?.usuario?.apellido }}</strong>
                  <br>
                  <small class="text-muted">{{ seccion.docente?.codigo }}</small>
                </td>
                <td>
                  <div class="progress" style="height: 20px;">
                    <div 
                      class="progress-bar" 
                      :class="getCapacidadClass(seccion)"
                      :style="{ width: (seccion.capacidadActual / seccion.capacidadMaxima * 100) + '%' }"
                    >
                      {{ seccion.capacidadActual }}/{{ seccion.capacidadMaxima }}
                    </div>
                  </div>
                  <small class="text-muted">
                    {{ seccion.capacidadMaxima - seccion.capacidadActual }} vacantes
                  </small>
                </td>
                <td>
                  <div v-if="seccion.horarios && seccion.horarios.length > 0">
                    <small v-for="horario in seccion.horarios" :key="horario.id" class="d-block">
                      <i class="fas fa-clock me-1"></i>
                      {{ capitalizeFirst(horario.dia) }}: {{ formatTime(horario.horaInicio) }}-{{ formatTime(horario.horaFin) }}
                      <br>
                      <span class="text-muted">{{ horario.aula }} ({{ horario.tipo }})</span>
                    </small>
                  </div>
                  <span v-else class="text-muted">Sin horarios</span>
                </td>
                <td>
                  <span class="badge" :class="seccion.activo ? 'bg-success' : 'bg-danger'">
                    {{ seccion.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-info me-1" 
                    @click="viewHorarios(seccion)"
                    title="Ver/Editar horarios"
                  >
                    <i class="fas fa-clock"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-primary me-1" 
                    @click="editSeccion(seccion)"
                    title="Editar sección"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click="deleteSeccion(seccion.id)"
                    title="Eliminar sección"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar Sección -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-th-list me-2"></i>{{ isEditing ? 'Editar' : 'Nueva' }} Sección
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveSeccion">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Periodo Académico *</label>
                    <select class="form-select" v-model="form.periodoAcademicoId" required :disabled="isEditing">
                      <option value="">Seleccionar periodo</option>
                      <option v-for="periodo in periodosAcademicos" :key="periodo.id" :value="periodo.id">
                        {{ periodo.codigo }} - {{ periodo.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Curso *</label>
                    <select class="form-select" v-model="form.cursoId" required :disabled="isEditing" @change="onCursoChange">
                      <option value="">Seleccionar curso</option>
                      <option v-for="curso in cursosDisponibles" :key="curso.id" :value="curso.id">
                        {{ curso.codigo }} - {{ curso.nombre }} ({{ curso.ciclo }}° ciclo)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Docente *</label>
                    <select class="form-select" v-model="form.docenteId" required>
                      <option value="">Seleccionar docente</option>
                      <option v-for="docente in docentes" :key="docente.id" :value="docente.id">
                        {{ docente.codigo }} - {{ docente.usuario.nombre }} {{ docente.usuario.apellido }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nombre de Sección *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.nombre" 
                      required
                      placeholder="Ej: A, B, C, 01, 02"
                      maxlength="10"
                    >
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Capacidad Máxima *</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      v-model="form.capacidadMaxima" 
                      required
                      min="1"
                      max="100"
                    >
                  </div>
                </div>
                <div class="col-md-6" v-if="isEditing">
                  <div class="form-check mt-4">
                    <input class="form-check-input" type="checkbox" v-model="form.activo" id="activo">
                    <label class="form-check-label" for="activo">Sección Activa</label>
                  </div>
                </div>
              </div>

              <!-- Información del curso seleccionado -->
              <div v-if="cursoSeleccionado" class="alert alert-light">
                <h6><i class="fas fa-book me-2"></i>Información del Curso</h6>
                <div class="row">
                  <div class="col-md-6">
                    <strong>Nombre:</strong> {{ cursoSeleccionado.nombre }}<br>
                    <strong>Ciclo:</strong> {{ cursoSeleccionado.ciclo }}°<br>
                    <strong>Créditos:</strong> {{ cursoSeleccionado.creditos }}
                  </div>
                  <div class="col-md-6">
                    <strong>Horas Teóricas:</strong> {{ cursoSeleccionado.horasTeoricas }}<br>
                    <strong>Horas Prácticas:</strong> {{ cursoSeleccionado.horasPracticas }}<br>
                    <strong>Tipo:</strong> {{ cursoSeleccionado.tipo }}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-save me-2"></i>
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Gestión de Horarios -->
    <div class="modal fade" :class="{ show: showHorariosModal }" :style="{ display: showHorariosModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-clock me-2"></i>Horarios - {{ selectedSeccion?.curso?.codigo }} Sección {{ selectedSeccion?.nombre }}
            </h5>
            <button type="button" class="btn-close" @click="showHorariosModal = false"></button>
          </div>
          <div class="modal-body">
            <!-- Formulario para nuevo horario -->
            <div class="card mb-3">
              <div class="card-header">
                <h6 class="mb-0"><i class="fas fa-plus me-2"></i>Agregar Nuevo Horario</h6>
              </div>
              <div class="card-body">
                <form @submit.prevent="saveHorario">
                  <div class="row">
                    <div class="col-md-2">
                      <div class="mb-3">
                        <label class="form-label">Día *</label>
                        <select class="form-select" v-model="formHorario.dia" required>
                          <option value="">Seleccionar</option>
                          <option value="lunes">Lunes</option>
                          <option value="martes">Martes</option>
                          <option value="miercoles">Miércoles</option>
                          <option value="jueves">Jueves</option>
                          <option value="viernes">Viernes</option>
                          <option value="sabado">Sábado</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="mb-3">
                        <label class="form-label">Hora Inicio *</label>
                        <input type="time" class="form-control" v-model="formHorario.horaInicio" required>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="mb-3">
                        <label class="form-label">Hora Fin *</label>
                        <input type="time" class="form-control" v-model="formHorario.horaFin" required>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="mb-3">
                        <label class="form-label">Tipo *</label>
                        <select class="form-select" v-model="formHorario.tipo" required>
                          <option value="">Seleccionar</option>
                          <option value="teoria">Teoría</option>
                          <option value="practica">Práctica</option>
                          <option value="laboratorio">Laboratorio</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="mb-3">
                        <label class="form-label">Aula *</label>
                        <input type="text" class="form-control" v-model="formHorario.aula" required placeholder="Ej: A-101">
                      </div>
                    </div>
                    <div class="col-md-2">
                      <div class="mb-3">
                        <label class="form-label">&nbsp;</label>
                        <button type="submit" class="btn btn-success w-100" :disabled="savingHorario">
                          <span v-if="savingHorario" class="spinner-border spinner-border-sm me-2"></span>
                          <i v-else class="fas fa-plus me-1"></i>
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <!-- Lista de horarios existentes -->
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0"><i class="fas fa-list me-2"></i>Horarios Existentes</h6>
              </div>
              <div class="card-body">
                <div v-if="horariosSeccion.length === 0" class="text-center py-3">
                  <i class="fas fa-clock fa-2x text-muted mb-2"></i>
                  <p class="text-muted">No hay horarios programados para esta sección</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Día</th>
                        <th>Horario</th>
                        <th>Tipo</th>
                        <th>Aula</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="horario in horariosSeccion" :key="horario.id">
                        <td><strong>{{ capitalizeFirst(horario.dia) }}</strong></td>
                        <td>{{ formatTime(horario.horaInicio) }} - {{ formatTime(horario.horaFin) }}</td>
                        <td>
                          <span class="badge" :class="getTipoHorarioClass(horario.tipo)">
                            {{ horario.tipo }}
                          </span>
                        </td>
                        <td>{{ horario.aula }}</td>
                        <td>
                          <button 
                            class="btn btn-sm btn-outline-danger" 
                            @click="deleteHorario(horario.id)"
                            title="Eliminar horario"
                          >
                            <i class="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal || showHorariosModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

export default {
  name: 'Secciones',
  setup() {
    const secciones = ref([])
    const periodosAcademicos = ref([])
    const cursos = ref([])
    const docentes = ref([])
    const horariosSeccion = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const savingHorario = ref(false)
    const showModal = ref(false)
    const showHorariosModal = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)
    const selectedSeccion = ref(null)
    const cursoSeleccionado = ref(null)
    
    // Filtros
    const filterPeriodo = ref('')
    const filterCurso = ref('')
    const filterDocente = ref('')
    const filterActivo = ref('')

    const form = ref({
      periodoAcademicoId: '',
      cursoId: '',
      docenteId: '',
      nombre: '',
      capacidadMaxima: 40,
      activo: true
    })

    const formHorario = ref({
      dia: '',
      horaInicio: '',
      horaFin: '',
      tipo: '',
      aula: ''
    })

    // Computed
    const cursosDisponibles = computed(() => {
      if (!form.value.periodoAcademicoId) return []
      return cursos.value.filter(curso => curso.activo)
    })

    // Métodos de carga de datos
    const loadSecciones = async () => {
      loading.value = true
      try {
        let url = '/secciones'
        const params = new URLSearchParams()
        
        if (filterPeriodo.value) params.append('periodoAcademicoId', filterPeriodo.value)
        if (filterCurso.value) params.append('cursoId', filterCurso.value)
        if (filterDocente.value) params.append('docenteId', filterDocente.value)
        if (filterActivo.value) params.append('activo', filterActivo.value)
        
        if (params.toString()) url += '?' + params.toString()
        
        const response = await api.get(url)
        secciones.value = response.data.data
      } catch (error) {
        console.error('Error al cargar secciones:', error)
        alert('Error al cargar secciones')
      } finally {
        loading.value = false
      }
    }

    const loadPeriodosAcademicos = async () => {
      try {
        const response = await api.get('/periodos-academicos?activo=true')
        periodosAcademicos.value = response.data.data
      } catch (error) {
        console.error('Error al cargar periodos académicos:', error)
      }
    }

    const loadCursos = async () => {
      try {
        const response = await api.get('/cursos?activo=true')
        cursos.value = response.data.data
      } catch (error) {
        console.error('Error al cargar cursos:', error)
      }
    }

    const loadDocentes = async () => {
      try {
        const response = await api.get('/docentes?activo=true')
        docentes.value = response.data.data
      } catch (error) {
        console.error('Error al cargar docentes:', error)
      }
    }

    const loadHorariosSeccion = async (seccionId) => {
      try {
        const response = await api.get(`/horarios/seccion/${seccionId}`)
        horariosSeccion.value = response.data.data
      } catch (error) {
        console.error('Error al cargar horarios:', error)
      }
    }

    // Métodos de gestión de secciones
    const openNewSeccion = () => {
      form.value = {
        periodoAcademicoId: '',
        cursoId: '',
        docenteId: '',
        nombre: '',
        capacidadMaxima: 40,
        activo: true
      }
      cursoSeleccionado.value = null
      isEditing.value = false
      showModal.value = true
    }

    const editSeccion = (seccion) => {
      form.value = { ...seccion }
      cursoSeleccionado.value = seccion.curso
      isEditing.value = true
      editingId.value = seccion.id
      showModal.value = true
    }

    const saveSeccion = async () => {
      saving.value = true
      try {
        const data = {
          ...form.value,
          capacidadMaxima: parseInt(form.value.capacidadMaxima)
        }

        if (isEditing.value) {
          await api.put(`/secciones/${editingId.value}`, data)
        } else {
          await api.post('/secciones', data)
        }
        
        closeModal()
        loadSecciones()
        alert('Sección guardada exitosamente')
      } catch (error) {
        console.error('Error al guardar sección:', error)
        alert('Error al guardar sección: ' + (error.response?.data?.message || error.message))
      } finally {
        saving.value = false
      }
    }

    const deleteSeccion = async (id) => {
      if (!confirm('¿Está seguro de eliminar esta sección?')) return

      try {
        await api.delete(`/secciones/${id}`)
        loadSecciones()
        alert('Sección eliminada exitosamente')
      } catch (error) {
        console.error('Error al eliminar sección:', error)
        alert('Error al eliminar sección: ' + (error.response?.data?.message || error.message))
      }
    }

    // Métodos de gestión de horarios
    const viewHorarios = (seccion) => {
      selectedSeccion.value = seccion
      formHorario.value = {
        dia: '',
        horaInicio: '',
        horaFin: '',
        tipo: '',
        aula: ''
      }
      showHorariosModal.value = true
      loadHorariosSeccion(seccion.id)
    }

    const saveHorario = async () => {
      savingHorario.value = true
      try {
        const data = {
          seccionId: selectedSeccion.value.id,
          ...formHorario.value
        }

        await api.post('/horarios', data)
        
        // Limpiar formulario
        formHorario.value = {
          dia: '',
          horaInicio: '',
          horaFin: '',
          tipo: '',
          aula: ''
        }
        
        // Recargar horarios
        loadHorariosSeccion(selectedSeccion.value.id)
        loadSecciones() // Para actualizar la tabla principal
      } catch (error) {
        console.error('Error al guardar horario:', error)
        alert('Error al guardar horario: ' + (error.response?.data?.message || error.message))
      } finally {
        savingHorario.value = false
      }
    }

    const deleteHorario = async (horarioId) => {
      if (!confirm('¿Está seguro de eliminar este horario?')) return

      try {
        await api.delete(`/horarios/${horarioId}`)
        loadHorariosSeccion(selectedSeccion.value.id)
        loadSecciones()
      } catch (error) {
        console.error('Error al eliminar horario:', error)
        alert('Error al eliminar horario: ' + (error.response?.data?.message || error.message))
      }
    }

    // Métodos auxiliares
    const onCursoChange = () => {
      cursoSeleccionado.value = cursos.value.find(c => c.id === parseInt(form.value.cursoId))
    }

    const closeModal = () => {
      showModal.value = false
      isEditing.value = false
      editingId.value = null
      cursoSeleccionado.value = null
    }

    const formatTime = (timeString) => {
      if (!timeString) return ''
      return timeString.substring(0, 5)
    }

    const capitalizeFirst = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const getCapacidadClass = (seccion) => {
      const porcentaje = (seccion.capacidadActual / seccion.capacidadMaxima) * 100
      if (porcentaje >= 90) return 'bg-danger'
      if (porcentaje >= 70) return 'bg-warning'
      return 'bg-success'
    }

    const getTipoHorarioClass = (tipo) => {
      const clases = {
        teoria: 'bg-primary',
        practica: 'bg-success', 
        laboratorio: 'bg-info'
      }
      return clases[tipo] || 'bg-secondary'
    }

    onMounted(() => {
      loadSecciones()
      loadPeriodosAcademicos()
      loadCursos()
      loadDocentes()
    })

    return {
      // Data
      secciones,
      periodosAcademicos,
      cursos,
      docentes,
      horariosSeccion,
      loading,
      saving,
      savingHorario,
      showModal,
      showHorariosModal,
      isEditing,
      selectedSeccion,
      cursoSeleccionado,
      filterPeriodo,
      filterCurso,
      filterDocente,
      filterActivo,
      form,
      formHorario,
      
      // Computed
      cursosDisponibles,
      
      // Methods
      loadSecciones,
      openNewSeccion,
      editSeccion,
      saveSeccion,
      deleteSeccion,
      viewHorarios,
      saveHorario,
      deleteHorario,
      onCursoChange,
      closeModal,
      formatTime,
      capitalizeFirst,
      getCapacidadClass,
      getTipoHorarioClass
    }
  }
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.progress {
  border-radius: 10px;
}

.badge {
  font-size: 0.75em;
}
</style>