<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-user-graduate text-success me-2"></i>Alumnos</h1>
      <button class="btn btn-success" @click="showModal = true">
        <i class="fas fa-plus me-2"></i>Nuevo Alumno
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <!-- Barra de búsqueda y filtros -->
        <div class="row mb-3">
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar por nombre, código o DNI..."
              v-model="searchQuery"
              @input="searchAlumnos"
            />
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filterEscuela" @change="loadAlumnos">
              <option value="">Todas las escuelas</option>
              <option v-for="escuela in escuelas" :key="escuela.id" :value="escuela.id">
                {{ escuela.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filterEstado" @change="loadAlumnos">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="egresado">Egresado</option>
              <option value="retirado">Retirado</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success"></div>
          <p class="mt-2">Cargando alumnos...</p>
        </div>

        <div v-else-if="alumnos.length === 0" class="text-center py-5">
          <i class="fas fa-user-graduate fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay alumnos registrados</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre Completo</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Escuela</th>
                <th>Plan de Estudio</th>
                <th>Ciclo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="alumno in alumnos" :key="alumno.id">
                <td>
                  <span class="badge bg-secondary">{{ alumno.codigo }}</span>
                </td>
                <td>{{ alumno.usuario.nombre }} {{ alumno.usuario.apellido }}</td>
                <td>{{ alumno.dni }}</td>
                <td>
                  <small>{{ alumno.usuario.email }}</small>
                </td>
                <td>
                  <span class="badge bg-primary">{{ alumno.escuela.codigo }}</span>
                  <br />
                  <small class="text-muted">{{ alumno.escuela.nombre }}</small>
                </td>
                <td>
                  <small>{{ alumno.planEstudio.nombre }}</small>
                </td>
                <td>
                  <span class="badge bg-info">{{ alumno.cicloActual }}° ciclo</span>
                </td>
                <td>
                  <span class="badge" :class="getEstadoClass(alumno.estado)">
                    {{ getEstadoLabel(alumno.estado) }}
                  </span>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-info me-1"
                    @click="viewMatriculas(alumno)"
                    title="Ver matrículas"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-primary me-1"
                    @click="editAlumno(alumno)"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-warning"
                    @click="changeEstado(alumno)"
                    title="Cambiar estado"
                  >
                    <i class="fas fa-exchange-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div
      class="modal fade"
      :class="{ show: showModal }"
      :style="{ display: showModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nuevo' }} Alumno</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveAlumno">
            <div class="modal-body">
              <!-- Datos personales -->
              <h6 class="mb-3"><i class="fas fa-user me-2"></i>Datos Personales</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nombre *</label>
                    <input type="text" class="form-control" v-model="form.nombre" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Apellido *</label>
                    <input type="text" class="form-control" v-model="form.apellido" required />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">DNI *</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.dni"
                      required
                      :disabled="isEditing"
                      maxlength="8"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="form.fechaNacimiento"
                      required
                      :disabled="isEditing"
                    />
                  </div>
                </div>
              </div>

              <!-- Datos de contacto -->
              <h6 class="mb-3 mt-4"><i class="fas fa-envelope me-2"></i>Datos de Contacto</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Email *</label>
                    <input type="email" class="form-control" v-model="form.email" required />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">{{
                      isEditing ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'
                    }}</label>
                    <input
                      type="password"
                      class="form-control"
                      v-model="form.password"
                      :required="!isEditing"
                    />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-8">
                  <div class="mb-3">
                    <label class="form-label">Dirección</label>
                    <input type="text" class="form-control" v-model="form.direccion" />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Teléfono</label>
                    <input type="text" class="form-control" v-model="form.telefono" />
                  </div>
                </div>
              </div>

              <!-- Datos académicos -->
              <h6 class="mb-3 mt-4"><i class="fas fa-graduation-cap me-2"></i>Datos Académicos</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Escuela *</label>
                    <select
                      class="form-select"
                      v-model="form.escuelaId"
                      @change="onEscuelaChange"
                      required
                    >
                      <option value="">Seleccionar escuela</option>
                      <option v-for="escuela in escuelas" :key="escuela.id" :value="escuela.id">
                        {{ escuela.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Plan de Estudio *</label>
                    <select
                      class="form-select"
                      v-model="form.planEstudioId"
                      required
                      :disabled="!form.escuelaId"
                    >
                      <option value="">Seleccionar plan</option>
                      <option v-for="plan in planesFiltered" :key="plan.id" :value="plan.id">
                        {{ plan.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Código *</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.codigo"
                      required
                      :disabled="isEditing"
                    />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Fecha de Ingreso *</label>
                    <input type="date" class="form-control" v-model="form.fechaIngreso" required />
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="mb-3">
                    <label class="form-label">Ciclo Actual *</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="form.cicloActual"
                      required
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ isEditing ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Cambiar Estado -->
    <div
      class="modal fade"
      :class="{ show: showEstadoModal }"
      :style="{ display: showEstadoModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cambiar Estado del Alumno</h5>
            <button type="button" class="btn-close" @click="showEstadoModal = false"></button>
          </div>
          <form @submit.prevent="updateEstado">
            <div class="modal-body">
              <p>
                Alumno:
                <strong
                  >{{ selectedAlumno?.usuario?.nombre }}
                  {{ selectedAlumno?.usuario?.apellido }}</strong
                >
              </p>
              <div class="mb-3">
                <label class="form-label">Nuevo Estado</label>
                <select class="form-select" v-model="nuevoEstado" required>
                  <option value="">Seleccionar estado</option>
                  <option value="activo">Activo</option>
                  <option value="egresado">Egresado</option>
                  <option value="retirado">Retirado</option>
                  <option value="suspendido">Suspendido</option>
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

    <!-- Modal Ver Matrículas -->
    <div
      class="modal fade"
      :class="{ show: showMatriculasModal }"
      :style="{ display: showMatriculasModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Matrículas de {{ selectedAlumno?.usuario?.nombre }}
              {{ selectedAlumno?.usuario?.apellido }}
            </h5>
            <button type="button" class="btn-close" @click="showMatriculasModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="matriculas.length === 0" class="text-center py-3">
              <p class="text-muted">Este alumno no tiene matrículas registradas</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Créditos</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="matricula in matriculas" :key="matricula.id">
                    <td>{{ matricula.periodoAcademico?.nombre || '-' }}</td>
                    <td>{{ formatDate(matricula.fechaMatricula) }}</td>
                    <td>{{ matricula.tipoMatricula }}</td>
                    <td>{{ matricula.creditosInscritos }}</td>
                    <td>S/. {{ matricula.montoTotal }}</td>
                    <td>
                      <span class="badge" :class="getMatriculaEstadoClass(matricula.estado)">
                        {{ matricula.estado }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop para modales -->
    <div
      v-if="showModal || showEstadoModal || showMatriculasModal"
      class="modal-backdrop fade show"
    ></div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { alumnosService } from '@/services/alumnos'
import { escuelasService } from '@/services/escuelas'
import { planesEstudioService } from '@/services/planesEstudio'

export default {
  name: 'Alumnos',
  setup() {
    const alumnos = ref([])
    const escuelas = ref([])
    const planes = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const showEstadoModal = ref(false)
    const showMatriculasModal = ref(false)
    const saving = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)
    const searchQuery = ref('')
    const filterEscuela = ref('')
    const filterEstado = ref('')
    const selectedAlumno = ref(null)
    const nuevoEstado = ref('')
    const matriculas = ref([])

    const form = ref({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      escuelaId: '',
      planEstudioId: '',
      codigo: '',
      dni: '',
      fechaNacimiento: '',
      direccion: '',
      telefono: '',
      fechaIngreso: '',
      cicloActual: 1,
    })

    const planesFiltered = computed(() => {
      if (!form.value.escuelaId) return []
      return planes.value.filter((p) => p.escuelaId === parseInt(form.value.escuelaId) && p.activo)
    })

    const loadAlumnos = async () => {
      loading.value = true
      try {
        const response = await alumnosService.getAll()
        let data = response.data.data

        // Filtrar localmente
        if (filterEscuela.value) {
          data = data.filter((a) => a.escuelaId === parseInt(filterEscuela.value))
        }
        if (filterEstado.value) {
          data = data.filter((a) => a.estado === filterEstado.value)
        }
        if (searchQuery.value) {
          const search = searchQuery.value.toLowerCase()
          data = data.filter(
            (a) =>
              a.usuario.nombre.toLowerCase().includes(search) ||
              a.usuario.apellido.toLowerCase().includes(search) ||
              a.codigo.toLowerCase().includes(search) ||
              a.dni.includes(search),
          )
        }

        alumnos.value = data
      } catch (error) {
        alert('Error al cargar alumnos')
      } finally {
        loading.value = false
      }
    }

    const loadEscuelas = async () => {
      try {
        const response = await escuelasService.getAll()
        escuelas.value = response.data.data.filter((e) => e.activo)
      } catch (error) {
        console.error('Error al cargar escuelas')
      }
    }

    const loadPlanes = async () => {
      try {
        const response = await planesEstudioService.getAll()
        planes.value = response.data.data
      } catch (error) {
        console.error('Error al cargar planes')
      }
    }

    const searchAlumnos = () => {
      loadAlumnos()
    }

    const onEscuelaChange = () => {
      form.value.planEstudioId = ''
    }

    const saveAlumno = async () => {
      saving.value = true
      try {
        const dataToSend = { ...form.value }
        dataToSend.cicloActual = parseInt(dataToSend.cicloActual)

        if (isEditing.value) {
          if (!dataToSend.password) {
            delete dataToSend.password
          }
          delete dataToSend.codigo
          delete dataToSend.dni
          delete dataToSend.fechaNacimiento

          await alumnosService.update(editingId.value, dataToSend)
        } else {
          await alumnosService.create(dataToSend)
        }
        closeModal()
        loadAlumnos()
      } catch (error) {
        alert('Error al guardar alumno: ' + (error.response?.data?.message || error.message))
      } finally {
        saving.value = false
      }
    }

    const editAlumno = (alumno) => {
      form.value = {
        nombre: alumno.usuario.nombre,
        apellido: alumno.usuario.apellido,
        email: alumno.usuario.email,
        password: '',
        escuelaId: alumno.escuelaId,
        planEstudioId: alumno.planEstudioId,
        codigo: alumno.codigo,
        dni: alumno.dni,
        fechaNacimiento: alumno.fechaNacimiento ? alumno.fechaNacimiento.split('T')[0] : '',
        direccion: alumno.direccion || '',
        telefono: alumno.telefono || '',
        fechaIngreso: alumno.fechaIngreso ? alumno.fechaIngreso.split('T')[0] : '',
        cicloActual: alumno.cicloActual,
      }
      isEditing.value = true
      editingId.value = alumno.id
      showModal.value = true
    }

    const changeEstado = (alumno) => {
      selectedAlumno.value = alumno
      nuevoEstado.value = alumno.estado
      showEstadoModal.value = true
    }

    const updateEstado = async () => {
      try {
        await alumnosService.updateEstado(selectedAlumno.value.id, nuevoEstado.value)
        showEstadoModal.value = false
        loadAlumnos()
      } catch (error) {
        alert('Error al cambiar estado: ' + (error.response?.data?.message || error.message))
      }
    }

    const viewMatriculas = async (alumno) => {
      selectedAlumno.value = alumno
      try {
        const response = await alumnosService.getMatriculas(alumno.id)
        matriculas.value = response.data.data
        showMatriculasModal.value = true
      } catch (error) {
        alert('Error al cargar matrículas')
      }
    }

    const closeModal = () => {
      showModal.value = false
      isEditing.value = false
      editingId.value = null
      form.value = {
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        escuelaId: '',
        planEstudioId: '',
        codigo: '',
        dni: '',
        fechaNacimiento: '',
        direccion: '',
        telefono: '',
        fechaIngreso: '',
        cicloActual: 1,
      }
    }

    const getEstadoClass = (estado) => {
      const clases = {
        activo: 'bg-success',
        egresado: 'bg-primary',
        retirado: 'bg-warning',
        suspendido: 'bg-danger',
      }
      return clases[estado] || 'bg-secondary'
    }

    const getEstadoLabel = (estado) => {
      const labels = {
        activo: 'Activo',
        egresado: 'Egresado',
        retirado: 'Retirado',
        suspendido: 'Suspendido',
      }
      return labels[estado] || estado
    }

    const getMatriculaEstadoClass = (estado) => {
      const clases = {
        pendiente: 'bg-warning',
        pagado: 'bg-success',
        anulado: 'bg-danger',
      }
      return clases[estado] || 'bg-secondary'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('es-ES')
    }

    onMounted(() => {
      loadAlumnos()
      loadEscuelas()
      loadPlanes()
    })

    return {
      alumnos,
      escuelas,
      planes,
      planesFiltered,
      loading,
      showModal,
      showEstadoModal,
      showMatriculasModal,
      saving,
      isEditing,
      form,
      searchQuery,
      filterEscuela,
      filterEstado,
      selectedAlumno,
      nuevoEstado,
      matriculas,
      saveAlumno,
      editAlumno,
      changeEstado,
      updateEstado,
      viewMatriculas,
      closeModal,
      searchAlumnos,
      onEscuelaChange,
      getEstadoClass,
      getEstadoLabel,
      getMatriculaEstadoClass,
      formatDate,
    }
  },
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
