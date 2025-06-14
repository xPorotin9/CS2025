<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-university text-primary me-2"></i>Facultades</h1>
      <button class="btn btn-primary" @click="showModal = true">
        <i class="fas fa-plus me-2"></i>Nueva Facultad
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2">Cargando facultades...</p>
        </div>

        <div v-else-if="facultades.length === 0" class="text-center py-5">
          <i class="fas fa-university fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay facultades registradas</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="facultad in facultades" :key="facultad.id">
                <td><span class="badge bg-secondary">{{ facultad.codigo }}</span></td>
                <td>{{ facultad.nombre }}</td>
                <td>{{ facultad.descripcion || '-' }}</td>
                <td>
                  <span class="badge" :class="facultad.activo ? 'bg-success' : 'bg-danger'">
                    {{ facultad.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="editFacultad(facultad)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteFacultad(facultad.id)">
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
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nueva' }} Facultad</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveFacultad">
            <div class="modal-body">
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
              <button type="submit" class="btn btn-primary" :disabled="saving">
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
import { facultadesService } from '@/services/facultades'

export default {
  name: 'Facultades',
  setup() {
    const facultades = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const saving = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)

    const form = ref({
      codigo: '',
      nombre: '',
      descripcion: '',
      activo: true
    })

    const loadFacultades = async () => {
      loading.value = true
      try {
        const response = await facultadesService.getAll()
        facultades.value = response.data.data
      } catch (error) {
        alert('Error al cargar facultades')
      } finally {
        loading.value = false
      }
    }

    const saveFacultad = async () => {
      saving.value = true
      try {
        if (isEditing.value) {
          await facultadesService.update(editingId.value, form.value)
        } else {
          await facultadesService.create(form.value)
        }
        closeModal()
        loadFacultades()
      } catch (error) {
        alert('Error al guardar facultad')
      } finally {
        saving.value = false
      }
    }

    const editFacultad = (facultad) => {
      form.value = { ...facultad }
      isEditing.value = true
      editingId.value = facultad.id
      showModal.value = true
    }

    const deleteFacultad = async (id) => {
      if (confirm('¿Está seguro de eliminar esta facultad?')) {
        try {
          await facultadesService.delete(id)
          loadFacultades()
        } catch (error) {
          alert('Error al eliminar facultad')
        }
      }
    }

    const closeModal = () => {
      showModal.value = false
      isEditing.value = false
      editingId.value = null
      form.value = {
        codigo: '',
        nombre: '',
        descripcion: '',
        activo: true
      }
    }

    onMounted(() => {
      loadFacultades()
    })

    return {
      facultades,
      loading,
      showModal,
      saving,
      isEditing,
      form,
      saveFacultad,
      editFacultad,
      deleteFacultad,
      closeModal
    }
  }
}
</script>