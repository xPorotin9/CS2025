<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-building text-success me-2"></i>Escuelas</h1>
      <button class="btn btn-success" @click="showModal = true">
        <i class="fas fa-plus me-2"></i>Nueva Escuela
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-success"></div>
          <p class="mt-2">Cargando escuelas...</p>
        </div>

        <div v-else-if="escuelas.length === 0" class="text-center py-5">
          <i class="fas fa-building fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay escuelas registradas</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Facultad</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="escuela in escuelas" :key="escuela.id">
                <td><span class="badge bg-secondary">{{ escuela.codigo }}</span></td>
                <td>{{ escuela.nombre }}</td>
                <td>
                  <span class="badge bg-primary">{{ escuela.facultad.codigo }}</span>
                  <br><small class="text-muted">{{ escuela.facultad.nombre }}</small>
                </td>
                <td>{{ escuela.descripcion || '-' }}</td>
                <td>
                  <span class="badge" :class="escuela.activo ? 'bg-success' : 'bg-danger'">
                    {{ escuela.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="editEscuela(escuela)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteEscuela(escuela.id)">
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
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nueva' }} Escuela</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveEscuela">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Facultad *</label>
                <select class="form-select" v-model="form.facultadId" required>
                  <option value="">Seleccionar facultad</option>
                  <option v-for="facultad in facultades" :key="facultad.id" :value="facultad.id">
                    {{ facultad.nombre }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Código *</label>
                <input type="text" class="form-control" v-model="form.codigo" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-control" v-model="form.nombre" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" rows="3" v-model="form.descripcion"></textarea>
              </div>
              <div class="form-check" v-if="isEditing">
                <input class="form-check-input" type="checkbox" v-model="form.activo" id="activo">
                <label class="form-check-label" for="activo">Activa</label>
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
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { escuelasService } from '@/services/escuelas'
import { facultadesService } from '@/services/facultades'

export default {
  name: 'Escuelas',
  setup() {
    const escuelas = ref([])
    const facultades = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const saving = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)

    const form = ref({
      facultadId: '',
      codigo: '',
      nombre: '',
      descripcion: '',
      activo: true
    })

    const loadEscuelas = async () => {
      loading.value = true
      try {
        const response = await escuelasService.getAll()
        escuelas.value = response.data.data
      } catch (error) {
        alert('Error al cargar escuelas')
      } finally {
        loading.value = false
      }
    }

    const loadFacultades = async () => {
      try {
        const response = await facultadesService.getAll()
        facultades.value = response.data.data.filter(f => f.activo)
      } catch (error) {
        console.error('Error al cargar facultades')
      }
    }

    const saveEscuela = async () => {
      saving.value = true
      try {
        if (isEditing.value) {
          await escuelasService.update(editingId.value, form.value)
        } else {
          await escuelasService.create(form.value)
        }
        closeModal()
        loadEscuelas()
      } catch (error) {
        alert('Error al guardar escuela')
      } finally {
        saving.value = false
      }
    }

    const editEscuela = (escuela) => {
      form.value = { ...escuela }
      isEditing.value = true
      editingId.value = escuela.id
      showModal.value = true
    }

    const deleteEscuela = async (id) => {
      if (confirm('¿Está seguro de eliminar esta escuela?')) {
        try {
          await escuelasService.delete(id)
          loadEscuelas()
        } catch (error) {
          alert('Error al eliminar escuela')
        }
      }
    }

    const closeModal = () => {
      showModal.value = false
      isEditing.value = false
      editingId.value = null
      form.value = {
        facultadId: '',
        codigo: '',
        nombre: '',
        descripcion: '',
        activo: true
      }
    }

    onMounted(() => {
      loadEscuelas()
      loadFacultades()
    })

    return {
      escuelas,
      facultades,
      loading,
      showModal,
      saving,
      isEditing,
      form,
      saveEscuela,
      editEscuela,
      deleteEscuela,
      closeModal
    }
  }
}
</script>