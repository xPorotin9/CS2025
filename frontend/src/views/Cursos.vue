<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-book-open text-primary me-2"></i>Cursos</h1>
      <button class="btn btn-primary" @click="showModal = true">
        <i class="fas fa-plus me-2"></i>Nuevo Curso
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <!-- Filtros -->
        <div class="row mb-3">
          <div class="col-md-4">
            <select class="form-select" v-model="filterPlanEstudio" @change="loadCursos">
              <option value="">Todos los planes de estudio</option>
              <option v-for="plan in planesEstudio" :key="plan.id" :value="plan.id">
                {{ plan.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filterCiclo" @change="loadCursos">
              <option value="">Todos los ciclos</option>
              <option v-for="ciclo in 10" :key="ciclo" :value="ciclo">Ciclo {{ ciclo }}</option>
            </select>
          </div>
          <div class="col-md-4">
            <select class="form-select" v-model="filterActivo" @change="loadCursos">
              <option value="">Todos los estados</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2">Cargando cursos...</p>
        </div>

        <div v-else-if="cursos.length === 0" class="text-center py-5">
          <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay cursos registrados</p>
        </div>

        <div v-else>
          <!-- Vista agrupada por ciclos -->
          <div v-for="ciclo in ciclosConCursos" :key="ciclo" class="mb-4">
            <h5 class="mb-3"><i class="fas fa-layer-group me-2"></i>Ciclo {{ ciclo }}</h5>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead class="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Plan de Estudio</th>
                    <th>Área</th>
                    <th>Créditos</th>
                    <th>Horas</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="curso in getCursosByCiclo(ciclo)" :key="curso.id">
                    <td>
                      <span class="badge bg-secondary">{{ curso.codigo }}</span>
                    </td>
                    <td>
                      <strong>{{ curso.nombre }}</strong>
                      <br /><small class="text-muted">{{
                        curso.descripcion || 'Sin descripción'
                      }}</small>
                    </td>
                    <td>
                      <small>{{ curso.planEstudio.nombre }}</small>
                    </td>
                    <td>
                      <span v-if="curso.area" class="badge bg-secondary">
                        {{ curso.area.codigo }}
                      </span>
                      <small v-if="curso.area" class="d-block text-muted">{{ curso.area.nombre }}</small>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span class="badge bg-info">{{ curso.creditos }} créditos</span>
                    </td>
                    <td>
                      <small>
                        <i class="fas fa-chalkboard me-1"></i>{{ curso.horasTeoricas }}T
                        <i class="fas fa-flask ms-2 me-1"></i>{{ curso.horasPracticas }}P
                      </small>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="curso.tipo === 'obligatorio' ? 'bg-primary' : 'bg-warning'"
                      >
                        {{ curso.tipo }}
                      </span>
                    </td>
                    <td>
                      <span class="badge" :class="curso.activo ? 'bg-success' : 'bg-danger'">
                        {{ curso.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-info me-1"
                        @click="viewPrerequisitos(curso)"
                        title="Ver prerequisitos"
                      >
                        <i class="fas fa-sitemap"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-primary me-1"
                        @click="editCurso(curso)"
                        title="Editar"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteCurso(curso.id)"
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
            <h5 class="modal-title">{{ isEditing ? 'Editar' : 'Nuevo' }} Curso</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <form @submit.prevent="saveCurso">
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <div class="mb-3">
                    <label class="form-label">Plan de Estudio *</label>
                    <select
                      class="form-select"
                      v-model="form.planEstudioId"
                      required
                      :disabled="isEditing"
                    >
                      <option value="">Seleccionar plan de estudio</option>
                      <option v-for="plan in planesEstudio" :key="plan.id" :value="plan.id">
                        {{ plan.nombre }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Área</label>
                    <select class="form-select" v-model="form.areaId">
                      <option :value="null">Sin área asignada</option>
                      <option v-for="area in areas" :key="area.id" :value="area.id">
                        {{ area.codigo }} - {{ area.nombre }}
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

              <div class="mb-3">
                <label class="form-label">Nombre *</label>
                <input type="text" class="form-control" v-model="form.nombre" required />
              </div>

              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" rows="3" v-model="form.descripcion"></textarea>
              </div>

              <div class="row">
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label">Ciclo *</label>
                    <select class="form-select" v-model="form.ciclo" required>
                      <option value="">Seleccionar</option>
                      <option v-for="ciclo in 10" :key="ciclo" :value="ciclo">
                        Ciclo {{ ciclo }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label">Créditos *</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="form.creditos"
                      required
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label">Horas Teóricas *</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="form.horasTeoricas"
                      required
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label">Horas Prácticas *</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="form.horasPracticas"
                      required
                      min="0"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Tipo *</label>
                    <select class="form-select" v-model="form.tipo" required>
                      <option value="">Seleccionar tipo</option>
                      <option value="obligatorio">Obligatorio</option>
                      <option value="electivo">Electivo</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6" v-if="isEditing">
                  <div class="form-check mt-4">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="form.activo"
                      id="activo"
                    />
                    <label class="form-check-label" for="activo">Activo</label>
                  </div>
                </div>
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

    <!-- Modal Prerequisitos -->
    <div
      class="modal fade"
      :class="{ show: showPrerequisitosModal }"
      :style="{ display: showPrerequisitosModal ? 'block' : 'none' }"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Prerequisitos de {{ selectedCurso?.nombre }}</h5>
            <button
              type="button"
              class="btn-close"
              @click="showPrerequisitosModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="prerequisitos.length === 0" class="text-center py-3">
              <p class="text-muted">Este curso no tiene prerequisitos</p>
            </div>
            <div v-else>
              <ul class="list-group">
                <li v-for="prereq in prerequisitos" :key="prereq.id" class="list-group-item">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong
                        >{{ prereq.cursoPrerequisito.codigo }} -
                        {{ prereq.cursoPrerequisito.nombre }}</strong
                      >
                      <br />
                      <small class="text-muted">
                        Ciclo {{ prereq.cursoPrerequisito.ciclo }} -
                        {{ prereq.cursoPrerequisito.creditos }} créditos
                      </small>
                    </div>
                    <span
                      class="badge"
                      :class="prereq.tipoRequisito === 'obligatorio' ? 'bg-danger' : 'bg-warning'"
                    >
                      {{ prereq.tipoRequisito }}
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal || showPrerequisitosModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { cursosService } from '@/services/cursos'
import { planesEstudioService } from '@/services/planesEstudio'
import { areasService } from '@/services/areas'
import api from '@/services/api'

export default {
  name: 'Cursos',
  setup() {
    const cursos = ref([])
    const planesEstudio = ref([])
    const areas = ref([])
    const loading = ref(false)
    const showModal = ref(false)
    const showPrerequisitosModal = ref(false)
    const saving = ref(false)
    const isEditing = ref(false)
    const editingId = ref(null)
    const filterPlanEstudio = ref('')
    const filterCiclo = ref('')
    const filterActivo = ref('')
    const selectedCurso = ref(null)
    const prerequisitos = ref([])

    const form = ref({
      planEstudioId: '',
      areaId: null,
      codigo: '',
      nombre: '',
      descripcion: '',
      ciclo: '',
      creditos: '',
      horasTeoricas: '',
      horasPracticas: '',
      tipo: '',
      activo: true,
    })

    const ciclosConCursos = computed(() => {
      const ciclos = [...new Set(cursos.value.map((c) => c.ciclo))].sort((a, b) => a - b)
      return ciclos
    })

    const getCursosByCiclo = (ciclo) => {
      return cursos.value.filter((c) => c.ciclo === ciclo)
    }

    const loadCursos = async () => {
      loading.value = true
      try {
        const response = await cursosService.getAll()
        let data = response.data.data

        // Filtrar localmente
        if (filterPlanEstudio.value) {
          data = data.filter((c) => c.planEstudioId === parseInt(filterPlanEstudio.value))
        }
        if (filterCiclo.value) {
          data = data.filter((c) => c.ciclo === parseInt(filterCiclo.value))
        }
        if (filterActivo.value) {
          data = data.filter((c) => c.activo === (filterActivo.value === 'true'))
        }

        cursos.value = data
      } catch (error) {
        alert('Error al cargar cursos')
      } finally {
        loading.value = false
      }
    }

    const loadPlanesEstudio = async () => {
      try {
        const response = await planesEstudioService.getAll()
        planesEstudio.value = response.data.data.filter((p) => p.activo)
      } catch (error) {
        console.error('Error al cargar planes de estudio')
      }
    }

    const loadAreas = async () => {
      try {
        const response = await areasService.getAll()
        areas.value = response.data.data.filter(a => a.activo)
      } catch (error) {
        console.error('Error al cargar áreas')
      }
    }

    const saveCurso = async () => {
      saving.value = true
      try {
        const dataToSend = { ...form.value }
        // Convertir a números
        dataToSend.ciclo = parseInt(dataToSend.ciclo)
        dataToSend.creditos = parseInt(dataToSend.creditos)
        dataToSend.horasTeoricas = parseInt(dataToSend.horasTeoricas)
        dataToSend.horasPracticas = parseInt(dataToSend.horasPracticas)
        
        // Manejar areaId
        if (dataToSend.areaId === null || dataToSend.areaId === '') {
          dataToSend.areaId = null
        } else {
          dataToSend.areaId = parseInt(dataToSend.areaId)
        }

        if (isEditing.value) {
          delete dataToSend.codigo
          delete dataToSend.planEstudioId
          await cursosService.update(editingId.value, dataToSend)
        } else {
          await cursosService.create(dataToSend)
        }
        closeModal()
        loadCursos()
      } catch (error) {
        alert('Error al guardar curso: ' + (error.response?.data?.message || error.message))
      } finally {
        saving.value = false
      }
    }

    const editCurso = (curso) => {
      form.value = {
        planEstudioId: curso.planEstudioId,
        areaId: curso.areaId || null,
        codigo: curso.codigo,
        nombre: curso.nombre,
        descripcion: curso.descripcion || '',
        ciclo: curso.ciclo,
        creditos: curso.creditos,
        horasTeoricas: curso.horasTeoricas,
        horasPracticas: curso.horasPracticas,
        tipo: curso.tipo,
        activo: curso.activo,
      }
      isEditing.value = true
      editingId.value = curso.id
      showModal.value = true
    }

    const deleteCurso = async (id) => {
      if (confirm('¿Está seguro de eliminar este curso? Se desactivará lógicamente.')) {
        try {
          await cursosService.delete(id)
          loadCursos()
        } catch (error) {
          alert('Error al eliminar curso: ' + (error.response?.data?.message || error.message))
        }
      }
    }

    const viewPrerequisitos = async (curso) => {
      selectedCurso.value = curso
      try {
        const response = await api.get(`/prerequisitos/curso/${curso.id}`)
        prerequisitos.value = response.data.data
        showPrerequisitosModal.value = true
      } catch (error) {
        alert('Error al cargar prerequisitos')
      }
    }

    const closeModal = () => {
      showModal.value = false
      isEditing.value = false
      editingId.value = null
      form.value = {
        planEstudioId: '',
        areaId: null,
        codigo: '',
        nombre: '',
        descripcion: '',
        ciclo: '',
        creditos: '',
        horasTeoricas: '',
        horasPracticas: '',
        tipo: '',
        activo: true,
      }
    }

    onMounted(() => {
      loadCursos()
      loadPlanesEstudio()
      loadAreas()
    })

    return {
      cursos,
      planesEstudio,
      areas,
      loading,
      showModal,
      showPrerequisitosModal,
      saving,
      isEditing,
      form,
      filterPlanEstudio,
      filterCiclo,
      filterActivo,
      selectedCurso,
      prerequisitos,
      ciclosConCursos,
      getCursosByCiclo,
      loadCursos,
      saveCurso,
      editCurso,
      deleteCurso,
      viewPrerequisitos,
      closeModal,
    }
  },
}
</script>