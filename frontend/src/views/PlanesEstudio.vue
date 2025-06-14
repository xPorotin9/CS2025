<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-book text-warning me-2"></i>Planes de Estudio</h1>
      <button class="btn btn-warning" @click="showModal = true">
        <i class="fas fa-plus me-2"></i>Nuevo Plan
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-warning"></div>
          <p class="mt-2">Cargando planes de estudio...</p>
        </div>

        <div v-else-if="planes.length === 0" class="text-center py-5">
          <i class="fas fa-book fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay planes de estudio registrados</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Escuela</th>
                <th>Vigencia</th>
                <th>Créditos</th>
                <th>Ciclos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in planes" :key="plan.id">
                <td><span class="badge bg-secondary">{{ plan.codigo }}</span></td>
                <td>{{ plan.nombre }}</td>
                <td>
                  <span class="badge bg-success">{{ plan.escuela.codigo }}</span>
                  <br><small class="text-muted">{{ plan.escuela.nombre }}</small>
                </td>
                <td>
                  <small class="text-muted">
                    {{ formatDate(plan.fechaInicio) }}
                    <span v-if="plan.fechaFin"> - {{ formatDate(plan.fechaFin) }}</span>
                    <span v-else> - Actual</span>
                  </small>
                </td>
                <td>
                  <span class="badge bg-info">{{ plan.totalCreditos }}</span>
                </td>
                <td>
                  <span class="badge bg-dark">{{ plan.totalCiclos }}</span>
                </td>
                <td>
                  <span class="badge" :class="plan.activo ? 'bg-success' : 'bg-danger'">
                    {{ plan.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary me-2" @click="editPlan(plan)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deletePlan(plan.id)">
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nuevo' }} Plan de Estudio</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="savePlan">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Escuela *</label>
                    <select class="form-select" v-model="form.escuelaId" required>
                      <option value="">Seleccionar escuela</option>
                      <option v-for="escuela in escuelas" :key="escuela.id" :value="escuela.id">
                        {{ escuela.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Código *</label>
                    <input type="text" class="form-control" v-model="form.codigo" required>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-control" v-model="form.nombre" required>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Fecha de Inicio *</label>
                    <input type="date" class="form-control" v-model="form.fechaInicio" required>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Fecha de Fin</label>
                    <input type="date" class="form-control" v-model="form.fechaFin">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Total de Créditos *</label>
                    <input type="number" class="form-control" v-model="form.totalCreditos" required min="0">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Total de Ciclos *</label>
                    <input type="number" class="form-control" v-model="form.totalCiclos" required min="1">
                  </div>
                </div>
              </div>

              <div class="form-check" v-if="isEditing">
                <input class="form-check-input" type="checkbox" v-model="form.activo" id="activo">
                <label class="form-check-label" for="activo">Activo</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-warning" :disabled="saving">
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
import { planesEstudioService } from '@/services/planesEstudio'
import { escuelasService } from '@/services/escuelas'

export default {
  name: 'PlanesEstudio',
  setup() {
    const planes = ref([])
    const escuelas = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const saving = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)

    const form = ref({
      escuelaId: '',
      codigo: '',
      nombre: '',
      fechaInicio: '',
      fechaFin: '',
      totalCreditos: 200,
      totalCiclos: 10,
      activo: true
    })

    const loadPlanes = async () => {
      loading.value = true
      try {
        const response = await planesEstudioService.getAll()
        planes.value = response.data.data
      } catch (error) {
        alert('Error al cargar planes de estudio')
      } finally {
        loading.value = false
      }
    }

    const loadEscuelas = async () => {
      try {
        const response = await escuelasService.getAll()
        escuelas.value = response.data.data.filter(e => e.activo)
      } catch (error) {
        console.error('Error al cargar escuelas')
      }
    }

    const savePlan = async () => {
      saving.value = true
      try {
        if (isEditing.value) {
          await planesEstudioService.update(editingId.value, form.value)
        } else {
          await planesEstudioService.create(form.value)
        }
        closeModal()
        loadPlanes()
      } catch (error) {
        alert('Error al guardar plan de estudio')
      } finally {
        saving.value = false
      }
    }

    const editPlan = (plan) => {
      form.value = { 
        ...plan,
        fechaInicio: plan.fechaInicio ? plan.fechaInicio.split('T')[0] : '',
        fechaFin: plan.fechaFin ? plan.fechaFin.split('T')[0] : ''
      }
      isEditing.value = true
      editingId.value = plan.id
      showModal.value = true
    }

    const deletePlan = async (id) => {
      if (confirm('¿Está seguro de eliminar este plan de estudio?')) {
        try {
          await planesEstudioService.delete(id)
          loadPlanes()
        } catch (error) {
          alert('Error al eliminar plan de estudio')
        }
      }
    }

    const closeModal = () => {
      showModal.value = false
      isEditing.value = false
      editingId.value = null
      form.value = {
        escuelaId: '',
        codigo: '',
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
        totalCreditos: 200,
        totalCiclos: 10,
        activo: true
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('es-ES')
    }

    onMounted(() => {
      loadPlanes()
      loadEscuelas()
    })

    return {
      planes,
      escuelas,
      loading,
      showModal,
      saving,
      isEditing,
      form,
      savePlan,
      editPlan,
      deletePlan,
      closeModal,
      formatDate
    }
  }
}
</script>