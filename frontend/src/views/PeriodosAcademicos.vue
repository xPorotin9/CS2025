<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-calendar-alt text-info me-2"></i>Periodos Académicos</h1>
      <button class="btn btn-info" @click="showModal = true">
        <i class="fas fa-plus me-2"></i>Nuevo Periodo
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-info"></div>
          <p class="mt-2">Cargando periodos académicos...</p>
        </div>

        <div v-else-if="periodos.length === 0" class="text-center py-5">
          <i class="fas fa-calendar-alt fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay periodos académicos registrados</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Fechas del Periodo</th>
                <th>Fechas de Matrícula</th>
                <th>Estado</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="periodo in periodos" :key="periodo.id">
                <td><span class="badge bg-secondary">{{ periodo.codigo }}</span></td>
                <td>{{ periodo.nombre }}</td>
                <td>
                  <small>
                    {{ formatDate(periodo.fechaInicio) }} - {{ formatDate(periodo.fechaFin) }}
                  </small>
                </td>
                <td>
                  <small>
                    Regular: {{ formatDate(periodo.fechaInicioMatricula) }} - {{ formatDate(periodo.fechaFinMatricula) }}<br>
                    <span v-if="periodo.fechaInicioMatriculaExtemporanea">
                      Extemp.: {{ formatDate(periodo.fechaInicioMatriculaExtemporanea) }} - {{ formatDate(periodo.fechaFinMatriculaExtemporanea) }}
                    </span>
                  </small>
                </td>
                <td>
                  <span class="badge" :class="getEstadoClass(periodo.estado)">
                    {{ getEstadoLabel(periodo.estado) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="periodo.activo ? 'bg-success' : 'bg-danger'">
                    {{ periodo.activo ? 'Sí' : 'No' }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-warning me-1" 
                    @click="changeEstado(periodo)"
                    title="Cambiar estado"
                  >
                    <i class="fas fa-exchange-alt"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-primary me-1" 
                    @click="editPeriodo(periodo)"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nuevo' }} Periodo Académico</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="savePeriodo">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Código *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="form.codigo" 
                      required
                      :disabled="isEditing"
                    >
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nombre *</label>
                    <input type="text" class="form-control" v-model="form.nombre" required>
                  </div>
                </div>
              </div>

              <h6 class="mt-3">Fechas del Periodo</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Fecha de Inicio *</label>
                    <input type="date" class="form-control" v-model="form.fechaInicio" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Fecha de Fin *</label>
                    <input type="date" class="form-control" v-model="form.fechaFin" required>
                  </div>
                </div>
              </div>

              <h6 class="mt-3">Fechas de Matrícula Regular</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Inicio Matrícula *</label>
                    <input type="date" class="form-control" v-model="form.fechaInicioMatricula" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Fin Matrícula *</label>
                    <input type="date" class="form-control" v-model="form.fechaFinMatricula" required>
                  </div>
                </div>
              </div>

              <h6 class="mt-3">Fechas de Matrícula Extemporánea</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Inicio Matrícula Extemporánea</label>
                    <input type="date" class="form-control" v-model="form.fechaInicioMatriculaExtemporanea">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Fin Matrícula Extemporánea</label>
                    <input type="date" class="form-control" v-model="form.fechaFinMatriculaExtemporanea">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Estado *</label>
                    <select class="form-select" v-model="form.estado" required>
                      <option value="">Seleccionar estado</option>
                      <option value="programado">Programado</option>
                      <option value="en_curso">En Curso</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-check mt-4">
                    <input class="form-check-input" type="checkbox" v-model="form.activo" id="activo">
                    <label class="form-check-label" for="activo">Activo</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-info" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Cambiar Estado -->
    <div class="modal fade" :class="{ show: showEstadoModal }" :style="{ display: showEstadoModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cambiar Estado del Periodo</h5>
            <button type="button" class="btn-close" @click="showEstadoModal = false"></button>
          </div>
          <form @submit.prevent="updateEstado">
            <div class="modal-body">
              <p>
                Periodo: <strong>{{ selectedPeriodo?.nombre }}</strong>
              </p>
              <div class="mb-3">
                <label class="form-label">Nuevo Estado</label>
                <select class="form-select" v-model="nuevoEstado" required>
                  <option value="">Seleccionar estado</option>
                  <option value="programado">Programado</option>
                  <option value="en_curso">En Curso</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showEstadoModal = false">
                Cancelar
              </button>
              <button type="submit" class="btn btn-warning">Cambiar Estado</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showModal || showEstadoModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

export default {
  name: 'PeriodosAcademicos',
  setup() {
    const periodos = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const showEstadoModal = ref(false)
    const saving = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)
    const selectedPeriodo = ref(null)
    const nuevoEstado = ref('')

    const form = ref({
      codigo: '',
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
      fechaInicioMatricula: '',
      fechaFinMatricula: '',
      fechaInicioMatriculaExtemporanea: '',
      fechaFinMatriculaExtemporanea: '',
      estado: 'programado',
      activo: true
    })

    const loadPeriodos = async () => {
      loading.value = true
      try {
        const response = await api.get('/periodos-academicos')
        periodos.value = response.data.data
      } catch (error) {
        alert('Error al cargar periodos académicos')
      } finally {
        loading.value = false
      }
    }

    const savePeriodo = async () => {
      saving.value = true
      try {
        const dataToSend = { ...form.value }
        
        // Limpiar fechas vacías
        if (!dataToSend.fechaInicioMatriculaExtemporanea) {
          dataToSend.fechaInicioMatriculaExtemporanea = null
        }
        if (!dataToSend.fechaFinMatriculaExtemporanea) {
          dataToSend.fechaFinMatriculaExtemporanea = null
        }

        if (isEditing.value) {
          await api.put(`/periodos-academicos/${editingId.value}`, dataToSend)
        } else {
          await api.post('/periodos-academicos', dataToSend)
        }
        closeModal()
        loadPeriodos()
      } catch (error) {
        alert('Error al guardar periodo académico: ' + (error.response?.data?.message || error.message))
      } finally {
        saving.value = false
      }
    }

    const editPeriodo = (periodo) => {
      form.value = {
        codigo: periodo.codigo,
        nombre: periodo.nombre,
        fechaInicio: periodo.fechaInicio,
        fechaFin: periodo.fechaFin,
        fechaInicioMatricula: periodo.fechaInicioMatricula,
        fechaFinMatricula: periodo.fechaFinMatricula,
        fechaInicioMatriculaExtemporanea: periodo.fechaInicioMatriculaExtemporanea || '',
        fechaFinMatriculaExtemporanea: periodo.fechaFinMatriculaExtemporanea || '',
        estado: periodo.estado,
        activo: periodo.activo
      }
      isEditing.value = true
      editingId.value = periodo.id
      showModal.value = true
    }

    const changeEstado = (periodo) => {
      selectedPeriodo.value = periodo
      nuevoEstado.value = periodo.estado
      showEstadoModal.value = true
    }

    const updateEstado = async () => {
      try {
        await api.patch(`/periodos-academicos/${selectedPeriodo.value.id}/estado`, {
          estado: nuevoEstado.value
        })
        showEstadoModal.value = false
        loadPeriodos()
      } catch (error) {
        alert('Error al cambiar estado: ' + (error.response?.data?.message || error.message))
      }
    }

    const closeModal = () => {
      showModal.value = false
      isEditing.value = false
      editingId.value = null
      form.value = {
        codigo: '',
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
        fechaInicioMatricula: '',
        fechaFinMatricula: '',
        fechaInicioMatriculaExtemporanea: '',
        fechaFinMatriculaExtemporanea: '',
        estado: 'programado',
        activo: true
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('es-ES')
    }

    const getEstadoClass = (estado) => {
      const clases = {
        programado: 'bg-info',
        en_curso: 'bg-success',
        finalizado: 'bg-secondary'
      }
      return clases[estado] || 'bg-secondary'
    }

    const getEstadoLabel = (estado) => {
      const labels = {
        programado: 'Programado',
        en_curso: 'En Curso',
        finalizado: 'Finalizado'
      }
      return labels[estado] || estado
    }

    onMounted(() => {
      loadPeriodos()
    })

    return {
      periodos,
      loading,
      showModal,
      showEstadoModal,
      saving,
      isEditing,
      form,
      selectedPeriodo,
      nuevoEstado,
      savePeriodo,
      editPeriodo,
      changeEstado,
      updateEstado,
      closeModal,
      formatDate,
      getEstadoClass,
      getEstadoLabel
    }
  }
}
</script>