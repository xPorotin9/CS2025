<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-layer-group text-primary me-2"></i>Áreas</h1>
      <button class="btn btn-primary" @click="showModal = true">
        <i class="fas fa-plus me-2"></i>Nueva Área
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2">Cargando áreas...</p>
        </div>

        <div v-else-if="areas.length === 0" class="text-center py-5">
          <i class="fas fa-layer-group fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay áreas registradas</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Cursos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="area in areas" :key="area.id">
                <td><span class="badge bg-secondary">{{ area.codigo }}</span></td>
                <td>{{ area.nombre }}</td>
                <td>{{ area.descripcion || '-' }}</td>
                <td>
                  <span class="badge bg-info">{{ area.cursos?.length || 0 }} cursos</span>
                </td>
                <td>
                  <span class="badge" :class="area.activo ? 'bg-success' : 'bg-danger'">
                    {{ area.activo ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-info me-1" 
                    @click="viewCursos(area)"
                    title="Ver cursos"
                  >
                    <i class="fas fa-book"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-primary me-1" 
                    @click="editArea(area)"
                    title="Editar"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click="deleteArea(area.id)"
                    title="Eliminar"
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

    <!-- Modal Crear/Editar -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nueva' }} Área</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveArea">
            <div class="modal-body">
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

    <!-- Modal Ver Cursos -->
    <div class="modal fade" :class="{ show: showCursosModal }" :style="{ display: showCursosModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cursos del Área: {{ selectedArea?.nombre }}</h5>
            <button type="button" class="btn-close" @click="showCursosModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-if="cursosArea.length === 0" class="text-center py-3">
              <p class="text-muted">Esta área no tiene cursos asignados</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Ciclo</th>
                    <th>Créditos</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="curso in cursosArea" :key="curso.id">
                    <td><span class="badge bg-secondary">{{ curso.codigo }}</span></td>
                    <td>{{ curso.nombre }}</td>
                    <td><span class="badge bg-info">{{ curso.ciclo }}° ciclo</span></td>
                    <td>{{ curso.creditos }}</td>
                    <td>
                      <span class="badge" :class="curso.tipo === 'obligatorio' ? 'bg-primary' : 'bg-warning'">
                        {{ curso.tipo }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="curso.activo ? 'bg-success' : 'bg-danger'">
                        {{ curso.activo ? 'Activo' : 'Inactivo' }}
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

    <div v-if="showModal || showCursosModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { areasService } from '@/services/areas'

export default {
  name: 'Areas',
  setup() {
    const areas = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const showCursosModal = ref(false)
    const saving = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)
    const selectedArea = ref(null)
    const cursosArea = ref([])

    const form = ref({
      codigo: '',
      nombre: '',
      descripcion: '',
      activo: true
    })

    const loadAreas = async () => {
      loading.value = true
      try {
        const response = await areasService.getAll()
        areas.value = response.data.data
      } catch (error) {
        alert('Error al cargar áreas')
      } finally {
        loading.value = false
      }
    }

    const saveArea = async () => {
      saving.value = true
      try {
        if (isEditing.value) {
          await areasService.update(editingId.value, form.value)
        } else {
          await areasService.create(form.value)
        }
        closeModal()
        loadAreas()
      } catch (error) {
        alert('Error al guardar área: ' + (error.response?.data?.message || error.message))
      } finally {
        saving.value = false
      }
    }

    const editArea = (area) => {
      form.value = { ...area }
      isEditing.value = true
      editingId.value = area.id
      showModal.value = true
    }

    const deleteArea = async (id) => {
      if (confirm('¿Está seguro de eliminar esta área?')) {
        try {
          await areasService.delete(id)
          loadAreas()
        } catch (error) {
          alert('Error al eliminar área: ' + (error.response?.data?.message || error.message))
        }
      }
    }

    const viewCursos = async (area) => {
      selectedArea.value = area
      showCursosModal.value = true
      
      try {
        const response = await areasService.getCursosByArea(area.id)
        cursosArea.value = response.data.data
      } catch (error) {
        alert('Error al cargar cursos del área')
        cursosArea.value = []
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
      loadAreas()
    })

    return {
      areas,
      loading,
      showModal,
      showCursosModal,
      saving,
      isEditing,
      form,
      selectedArea,
      cursosArea,
      loadAreas,
      saveArea,
      editArea,
      deleteArea,
      viewCursos,
      closeModal
    }
  }
}
</script>