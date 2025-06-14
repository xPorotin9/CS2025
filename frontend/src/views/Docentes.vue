<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-chalkboard-teacher text-info me-2"></i>Docentes</h1>
      <button class="btn btn-info" @click="showModal = true">
        <i class="fas fa-plus me-2"></i>Nuevo Docente
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <!-- Barra de búsqueda -->
        <div class="row mb-3">
          <div class="col-md-6">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar por nombre, apellido, email o código..."
              v-model="searchQuery"
              @input="searchDocentes"
            />
          </div>
          <div class="col-md-6">
            <select class="form-select" v-model="filterFacultad" @change="loadDocentes">
              <option value="">Todas las facultades</option>
              <option v-for="facultad in facultades" :key="facultad.id" :value="facultad.id">
                {{ facultad.nombre }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-info"></div>
          <p class="mt-2">Cargando docentes...</p>
        </div>

        <div v-else-if="docentes.length === 0" class="text-center py-5">
          <i class="fas fa-chalkboard-teacher fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay docentes registrados</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Facultad</th>
                <th>Especialidad</th>
                <th>Grado Académico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="docente in docentes" :key="docente.id">
                <td>
                  <span class="badge bg-secondary">{{ docente.codigo }}</span>
                </td>
                <td>{{ docente.usuario.nombre }} {{ docente.usuario.apellido }}</td>
                <td>{{ docente.usuario.email }}</td>
                <td>
                  <span class="badge bg-primary">{{ docente.facultad.codigo }}</span>
                  <br /><small class="text-muted">{{ docente.facultad.nombre }}</small>
                </td>
                <td>{{ docente.especialidad || '-' }}</td>
                <td>
                  <span class="badge bg-info">{{
                    getGradoAcademicoLabel(docente.gradoAcademico)
                  }}</span>
                </td>
                <td>
                  <span class="badge" :class="docente.activo ? 'bg-success' : 'bg-danger'">
                    {{ docente.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="editDocente(docente)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteDocente(docente.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      :class="{ show: showModal }"
      :style="{ display: showModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nuevo' }} Docente</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveDocente">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Nombre *</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.nombre"
                      required
                      :disabled="isEditing"
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Apellido *</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="form.apellido"
                      required
                      :disabled="isEditing"
                    />
                  </div>
                </div>
              </div>

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
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Facultad *</label>
                    <select class="form-select" v-model="form.facultadId" required>
                      <option value="">Seleccionar facultad</option>
                      <option
                        v-for="facultad in facultades"
                        :key="facultad.id"
                        :value="facultad.id"
                      >
                        {{ facultad.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
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
                    <label class="form-label">Especialidad</label>
                    <input type="text" class="form-control" v-model="form.especialidad" />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Grado Académico *</label>
                    <select class="form-select" v-model="form.gradoAcademico" required>
                      <option value="">Seleccionar grado</option>
                      <option value="bachiller">Bachiller</option>
                      <option value="magister">Magíster</option>
                      <option value="doctor">Doctor</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Fecha de Ingreso *</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="form.fechaIngreso"
                      required
                      :disabled="isEditing"
                    />
                  </div>
                </div>
              </div>

              <div class="form-check" v-if="isEditing">
                <input class="form-check-input" type="checkbox" v-model="form.activo" id="activo" />
                <label class="form-check-label" for="activo">Activo</label>
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
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { docentesService } from '@/services/docentes'
import { facultadesService } from '@/services/facultades'

export default {
  name: 'Docentes',
  setup() {
    const docentes = ref([])
    const facultades = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const saving = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)
    const searchQuery = ref('')
    const filterFacultad = ref('')

    const form = ref({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      facultadId: '',
      codigo: '',
      dni: '',
      especialidad: '',
      gradoAcademico: '',
      fechaIngreso: '',
      activo: true,
    })

    const loadDocentes = async () => {
      loading.value = true
      try {
        const params = new URLSearchParams()
        if (searchQuery.value) params.append('search', searchQuery.value)
        if (filterFacultad.value) params.append('facultadId', filterFacultad.value)

        const response = await docentesService.getAll()
        let data = response.data.data

        // Filtrar localmente si es necesario
        if (filterFacultad.value) {
          data = data.filter((d) => d.facultadId === parseInt(filterFacultad.value))
        }
        if (searchQuery.value) {
          const search = searchQuery.value.toLowerCase()
          data = data.filter(
            (d) =>
              d.usuario.nombre.toLowerCase().includes(search) ||
              d.usuario.apellido.toLowerCase().includes(search) ||
              d.usuario.email.toLowerCase().includes(search) ||
              d.codigo.toLowerCase().includes(search),
          )
        }

        docentes.value = data
      } catch (error) {
        alert('Error al cargar docentes')
      } finally {
        loading.value = false
      }
    }

    const loadFacultades = async () => {
      try {
        const response = await facultadesService.getAll()
        facultades.value = response.data.data.filter((f) => f.activo)
      } catch (error) {
        console.error('Error al cargar facultades')
      }
    }

    const searchDocentes = () => {
      loadDocentes()
    }

    const saveDocente = async () => {
      saving.value = true
      try {
        const dataToSend = { ...form.value }

        if (isEditing.value) {
          // No enviar password si está vacío
          if (!dataToSend.password) {
            delete dataToSend.password
          }
          // No enviar campos que no se pueden editar
          delete dataToSend.codigo
          delete dataToSend.dni
          delete dataToSend.fechaIngreso

          await docentesService.update(editingId.value, dataToSend)
        } else {
          await docentesService.create(dataToSend)
        }
        closeModal()
        loadDocentes()
      } catch (error) {
        alert('Error al guardar docente: ' + (error.response?.data?.message || error.message))
      } finally {
        saving.value = false
      }
    }

    const editDocente = (docente) => {
      form.value = {
        nombre: docente.usuario.nombre,
        apellido: docente.usuario.apellido,
        email: docente.usuario.email,
        password: '',
        facultadId: docente.facultadId,
        codigo: docente.codigo,
        dni: docente.dni,
        especialidad: docente.especialidad || '',
        gradoAcademico: docente.gradoAcademico,
        fechaIngreso: docente.fechaIngreso ? docente.fechaIngreso.split('T')[0] : '',
        activo: docente.activo,
      }
      isEditing.value = true
      editingId.value = docente.id
      showModal.value = true
    }

    const deleteDocente = async (id) => {
      if (confirm('¿Está seguro de eliminar este docente?')) {
        try {
          await docentesService.delete(id)
          loadDocentes()
        } catch (error) {
          alert('Error al eliminar docente: ' + (error.response?.data?.message || error.message))
        }
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
        facultadId: '',
        codigo: '',
        dni: '',
        especialidad: '',
        gradoAcademico: '',
        fechaIngreso: '',
        activo: true,
      }
    }

    const getGradoAcademicoLabel = (grado) => {
      const labels = {
        bachiller: 'Bachiller',
        magister: 'Magíster',
        doctor: 'Doctor',
        phd: 'PhD',
      }
      return labels[grado] || grado
    }

    onMounted(() => {
      loadDocentes()
      loadFacultades()
    })

    return {
      docentes,
      facultades,
      loading,
      showModal,
      saving,
      isEditing,
      form,
      searchQuery,
      filterFacultad,
      saveDocente,
      editDocente,
      deleteDocente,
      closeModal,
      searchDocentes,
      loadDocentes,
      getGradoAcademicoLabel,
    }
  },
}
</script>
