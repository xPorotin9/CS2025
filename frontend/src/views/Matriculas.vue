<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="fas fa-clipboard-list text-primary me-2"></i>Matrículas</h1>
      <button class="btn btn-primary" @click="openNewMatricula">
        <i class="fas fa-plus me-2"></i>Nueva Matrícula
      </button>
    </div>

    <!-- Filtros -->
    <div class="card shadow-sm mb-3">
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <label class="form-label">Periodo Académico</label>
            <select class="form-select" v-model="filterPeriodo" @change="loadMatriculas">
              <option value="">Todos los periodos</option>
              <option v-for="periodo in periodosAcademicos" :key="periodo.id" :value="periodo.id">
                {{ periodo.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Estado</label>
            <select class="form-select" v-model="filterEstado" @change="loadMatriculas">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="anulado">Anulado</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Buscar alumno</label>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar por código o nombre..."
              v-model="searchQuery"
              @input="searchMatriculas"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de matrículas -->
    <div class="card shadow-sm">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
          <p class="mt-2">Cargando matrículas...</p>
        </div>

        <div v-else-if="matriculas.length === 0" class="text-center py-5">
          <i class="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
          <p class="text-muted">No hay matrículas registradas</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead class="table-light">
              <tr>
                <th>Código</th>
                <th>Alumno</th>
                <th>Periodo</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Créditos</th>
                <th>Monto Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="matricula in matriculas" :key="matricula.id">
                <td>
                  <span class="badge bg-secondary">#{{ matricula.id.toString().padStart(6, '0') }}</span>
                </td>
                <td>
                  <strong>{{ matricula.alumno?.usuario?.nombre }} {{ matricula.alumno?.usuario?.apellido }}</strong>
                  <br>
                  <small class="text-muted">{{ matricula.alumno?.codigo }}</small>
                </td>
                <td>
                  <span class="badge bg-info">{{ matricula.periodoAcademico?.codigo }}</span>
                  <br>
                  <small>{{ matricula.periodoAcademico?.nombre }}</small>
                </td>
                <td>{{ formatDate(matricula.fechaMatricula) }}</td>
                <td>
                  <span class="badge" :class="matricula.tipoMatricula === 'regular' ? 'bg-primary' : 'bg-warning'">
                    {{ matricula.tipoMatricula }}
                  </span>
                </td>
                <td>
                  <span class="badge bg-info">{{ matricula.creditosInscritos }}</span>
                </td>
                <td>
                  <strong>S/. {{ matricula.montoTotal.toFixed(2) }}</strong>
                </td>
                <td>
                  <span class="badge" :class="getEstadoClass(matricula.estado)">
                    {{ getEstadoLabel(matricula.estado) }}
                  </span>
                </td>
                <td>
                  <button 
                    class="btn btn-sm btn-outline-info me-1" 
                    @click="viewDetalles(matricula)"
                    title="Ver detalles"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    v-if="matricula.estado === 'pendiente'"
                    class="btn btn-sm btn-outline-success me-1" 
                    @click="registrarPago(matricula)"
                    title="Registrar pago"
                  >
                    <i class="fas fa-dollar-sign"></i>
                  </button>
                  <button 
                    v-if="matricula.estado !== 'anulado'"
                    class="btn btn-sm btn-outline-danger" 
                    @click="anularMatricula(matricula)"
                    title="Anular matrícula"
                  >
                    <i class="fas fa-ban"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click="imprimirMatricula(matricula)"
                    title="Imprimir"
                  >
                    <i class="fas fa-print"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Nueva Matrícula -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Nueva Matrícula</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- Paso 1: Seleccionar alumno y periodo -->
            <div v-if="step === 1">
              <h6 class="mb-3">Paso 1: Seleccionar Alumno y Periodo</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Alumno *</label>
                    <select class="form-select" v-model="form.alumnoId" required @change="onAlumnoChange">
                      <option value="">Seleccionar alumno</option>
                      <option v-for="alumno in alumnos" :key="alumno.id" :value="alumno.id">
                        {{ alumno.codigo }} - {{ alumno.usuario.nombre }} {{ alumno.usuario.apellido }}
                      </option>
                    </select>
                  </div>
                  <div v-if="alumnoSeleccionado" class="alert alert-info">
                    <strong>Información del alumno:</strong><br>
                    Escuela: {{ alumnoSeleccionado.escuela.nombre }}<br>
                    Plan de Estudio: {{ alumnoSeleccionado.planEstudio.nombre }}<br>
                    Ciclo Actual: {{ alumnoSeleccionado.cicloActual }}° ciclo
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Periodo Académico *</label>
                    <select class="form-select" v-model="form.periodoAcademicoId" required>
                      <option value="">Seleccionar periodo</option>
                      <option v-for="periodo in periodosActivos" :key="periodo.id" :value="periodo.id">
                        {{ periodo.codigo }} - {{ periodo.nombre }}
                      </option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Tipo de Matrícula *</label>
                    <select class="form-select" v-model="form.tipoMatricula" required>
                      <option value="">Seleccionar tipo</option>
                      <option value="regular">Regular</option>
                      <option value="extemporanea">Extemporánea</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paso 2: Seleccionar cursos -->
            <div v-if="step === 2">
              <h6 class="mb-3">Paso 2: Seleccionar Cursos</h6>
              <div class="alert alert-warning mb-3">
                <i class="fas fa-info-circle me-2"></i>
                Créditos seleccionados: <strong>{{ creditosSeleccionados }}</strong> / 
                Máximo permitido: <strong>{{ maxCreditos }}</strong>
              </div>

              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th width="50">
                        <input type="checkbox" class="form-check-input" @change="toggleAll" v-model="selectAll">
                      </th>
                      <th>Código</th>
                      <th>Curso</th>
                      <th>Ciclo</th>
                      <th>Créditos</th>
                      <th>Sección</th>
                      <th>Docente</th>
                      <th>Horario</th>
                      <th>Vacantes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="seccion in seccionesDisponibles" :key="seccion.id">
                      <td>
                        <input 
                          type="checkbox" 
                          class="form-check-input"
                          :value="seccion.id"
                          v-model="seccionesSeleccionadas"
                          :disabled="!puedeSeleccionar(seccion)"
                        >
                      </td>
                      <td>{{ seccion.curso.codigo }}</td>
                      <td>
                        <strong>{{ seccion.curso.nombre }}</strong>
                        <span v-if="seccion.curso.prerequisitosRequeridos?.length > 0" class="text-danger ms-2">
                          <i class="fas fa-exclamation-triangle" title="Tiene prerequisitos"></i>
                        </span>
                      </td>
                      <td>{{ seccion.curso.ciclo }}°</td>
                      <td>{{ seccion.curso.creditos }}</td>
                      <td>{{ seccion.nombre }}</td>
                      <td>{{ seccion.docente?.usuario?.nombre }} {{ seccion.docente?.usuario?.apellido }}</td>
                      <td>
                        <small v-for="horario in seccion.horarios" :key="horario.id">
                          {{ horario.dia }}: {{ formatTime(horario.horaInicio) }}-{{ formatTime(horario.horaFin) }}<br>
                        </small>
                      </td>
                      <td>
                        <span class="badge" :class="getVacantesClass(seccion)">
                          {{ seccion.capacidadMaxima - seccion.capacidadActual }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Paso 3: Confirmar matrícula -->
            <div v-if="step === 3">
              <h6 class="mb-3">Paso 3: Confirmar Matrícula</h6>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <h6 class="card-title">Resumen de Matrícula</h6>
                      <p><strong>Alumno:</strong> {{ alumnoSeleccionado?.usuario?.nombre }} {{ alumnoSeleccionado?.usuario?.apellido }}</p>
                      <p><strong>Periodo:</strong> {{ periodoSeleccionado?.nombre }}</p>
                      <p><strong>Tipo:</strong> {{ form.tipoMatricula === 'regular' ? 'Regular' : 'Extemporánea' }}</p>
                      <p><strong>Total de cursos:</strong> {{ seccionesSeleccionadas.length }}</p>
                      <p><strong>Total de créditos:</strong> {{ creditosSeleccionados }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <h6 class="card-title">Costo de Matrícula</h6>
                      <p><strong>Costo por crédito:</strong> S/. {{ costoCredito.toFixed(2) }}</p>
                      <p><strong>Subtotal:</strong> S/. {{ (creditosSeleccionados * costoCredito).toFixed(2) }}</p>
                      <hr>
                      <h5><strong>Total a pagar:</strong> S/. {{ montoTotal.toFixed(2) }}</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-3">
                <h6>Cursos seleccionados:</h6>
                <ul class="list-group">
                  <li v-for="seccionId in seccionesSeleccionadas" :key="seccionId" class="list-group-item">
                    {{ getCursoInfo(seccionId) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button 
              v-if="step > 1" 
              type="button" 
              class="btn btn-secondary" 
              @click="step--"
            >
              <i class="fas fa-arrow-left me-2"></i>Anterior
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
            <button 
              v-if="step < 3" 
              type="button" 
              class="btn btn-primary" 
              @click="nextStep"
              :disabled="!canProceed"
            >
              Siguiente<i class="fas fa-arrow-right ms-2"></i>
            </button>
            <button 
              v-if="step === 3" 
              type="button" 
              class="btn btn-success" 
              @click="saveMatricula"
              :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="fas fa-save me-2"></i>Confirmar Matrícula
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ver Detalles -->
    <div class="modal fade" :class="{ show: showDetallesModal }" :style="{ display: showDetallesModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de Matrícula #{{ selectedMatricula?.id.toString().padStart(6, '0') }}</h5>
            <button type="button" class="btn-close" @click="showDetallesModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <strong>Alumno:</strong> {{ selectedMatricula?.alumno?.usuario?.nombre }} {{ selectedMatricula?.alumno?.usuario?.apellido }}<br>
                <strong>Código:</strong> {{ selectedMatricula?.alumno?.codigo }}<br>
                <strong>Periodo:</strong> {{ selectedMatricula?.periodoAcademico?.nombre }}<br>
              </div>
              <div class="col-md-6">
                <strong>Fecha:</strong> {{ formatDate(selectedMatricula?.fechaMatricula) }}<br>
                <strong>Tipo:</strong> {{ selectedMatricula?.tipoMatricula }}<br>
                <strong>Estado:</strong> 
                <span class="badge" :class="getEstadoClass(selectedMatricula?.estado)">
                  {{ getEstadoLabel(selectedMatricula?.estado) }}
                </span>
              </div>
            </div>

            <h6>Cursos matriculados:</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Curso</th>
                    <th>Sección</th>
                    <th>Créditos</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detalle in detallesMatricula" :key="detalle.id">
                    <td>{{ detalle.seccion?.curso?.codigo }}</td>
                    <td>{{ detalle.seccion?.curso?.nombre }}</td>
                    <td>{{ detalle.seccion?.nombre }}</td>
                    <td>{{ detalle.seccion?.curso?.creditos }}</td>
                    <td>
                      <span class="badge" :class="detalle.estado === 'activo' ? 'bg-success' : 'bg-danger'">
                        {{ detalle.estado }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-3 text-end">
              <strong>Total créditos:</strong> {{ selectedMatricula?.creditosInscritos }}<br>
              <strong>Monto total:</strong> S/. {{ selectedMatricula?.montoTotal?.toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Registrar Pago -->
    <div class="modal fade" :class="{ show: showPagoModal }" :style="{ display: showPagoModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registrar Pago</h5>
            <button type="button" class="btn-close" @click="showPagoModal = false"></button>
          </div>
          <form @submit.prevent="savePago">
            <div class="modal-body">
              <div class="alert alert-info">
                <strong>Monto a pagar:</strong> S/. {{ selectedMatricula?.montoTotal?.toFixed(2) }}
              </div>
              <div class="mb-3">
                <label class="form-label">Método de Pago *</label>
                <select class="form-select" v-model="formPago.metodoPago" required>
                  <option value="">Seleccionar método</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Número de Operación</label>
                <input type="text" class="form-control" v-model="formPago.numeroOperacion">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showPagoModal = false">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="savingPago">
                <span v-if="savingPago" class="spinner-border spinner-border-sm me-2"></span>
                Registrar Pago
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showModal || showDetallesModal || showPagoModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { alumnosService } from '@/services/alumnos'

export default {
  name: 'Matriculas',
  setup() {
    const matriculas = ref([])
    const periodosAcademicos = ref([])
    const alumnos = ref([])
    const seccionesDisponibles = ref([])
    const detallesMatricula = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const savingPago = ref(false)
    const showModal = ref(false)
    const showDetallesModal = ref(false)
    const showPagoModal = ref(false)
    const step = ref(1)
    const filterPeriodo = ref('')
    const filterEstado = ref('')
    const searchQuery = ref('')
    const selectedMatricula = ref(null)
    const alumnoSeleccionado = ref(null)
    const periodoSeleccionado = ref(null)
    const seccionesSeleccionadas = ref([])
    const selectAll = ref(false)
    const costoCredito = ref(100)
    const maxCreditos = ref(22)

    const form = ref({
      alumnoId: '',
      periodoAcademicoId: '',
      tipoMatricula: 'regular'
    })

    const formPago = ref({
      metodoPago: '',
      numeroOperacion: ''
    })

    const periodosActivos = computed(() => {
      return periodosAcademicos.value.filter(p => p.estado === 'en_curso' || p.estado === 'programado')
    })

    const creditosSeleccionados = computed(() => {
      return seccionesSeleccionadas.value.reduce((total, seccionId) => {
        const seccion = seccionesDisponibles.value.find(s => s.id === seccionId)
        return total + (seccion?.curso?.creditos || 0)
      }, 0)
    })

    const montoTotal = computed(() => {
      const costo = form.value.tipoMatricula === 'extemporanea' ? costoCredito.value * 1.2 : costoCredito.value
      return creditosSeleccionados.value * costo
    })

    const canProceed = computed(() => {
      if (step.value === 1) {
        return form.value.alumnoId && form.value.periodoAcademicoId && form.value.tipoMatricula
      } else if (step.value === 2) {
        return seccionesSeleccionadas.value.length > 0 && creditosSeleccionados.value <= maxCreditos.value
      }
      return true
    })

    const loadMatriculas = async () => {
      loading.value = true
      try {
        const response = await api.get('/matriculas')
        let data = response.data.data

        if (filterPeriodo.value) {
          data = data.filter(m => m.periodoAcademicoId === parseInt(filterPeriodo.value))
        }
        if (filterEstado.value) {
          data = data.filter(m => m.estado === filterEstado.value)
        }
        if (searchQuery.value) {
          const search = searchQuery.value.toLowerCase()
          data = data.filter(m => 
            m.alumno?.codigo?.toLowerCase().includes(search) ||
            m.alumno?.usuario?.nombre?.toLowerCase().includes(search) ||
            m.alumno?.usuario?.apellido?.toLowerCase().includes(search)
          )
        }

        matriculas.value = data
      } catch (error) {
        console.error('Error al cargar matrículas:', error)
        alert('Error al cargar matrículas')
      } finally {
        loading.value = false
      }
    }

    const loadPeriodosAcademicos = async () => {
      try {
        const response = await api.get('/periodos-academicos')
        periodosAcademicos.value = response.data.data
      } catch (error) {
        console.error('Error al cargar periodos académicos:', error)
      }
    }

    const loadAlumnos = async () => {
      try {
        const response = await alumnosService.getAll()
        alumnos.value = response.data.data.filter(a => a.estado === 'activo')
      } catch (error) {
        console.error('Error al cargar alumnos:', error)
      }
    }

    const loadConfiguraciones = async () => {
      try {
        const [costoCreditoRes, maxCreditosRes] = await Promise.all([
          api.get('/configuraciones/costo_credito'),
          api.get('/configuraciones/max_creditos_por_ciclo')
        ])
        
        if (costoCreditoRes.data.data) {
          costoCredito.value = parseFloat(costoCreditoRes.data.data.valor)
        }
        if (maxCreditosRes.data.data) {
          maxCreditos.value = parseInt(maxCreditosRes.data.data.valor)
        }
      } catch (error) {
        console.error('Error al cargar configuraciones:', error)
      }
    }

    const loadSeccionesDisponibles = async () => {
      if (!form.value.periodoAcademicoId || !alumnoSeleccionado.value) return

      try {
        const response = await api.get(`/secciones/periodo/${form.value.periodoAcademicoId}`)
        // Filtrar secciones disponibles para el alumno según su plan de estudio
        seccionesDisponibles.value = response.data.data.filter(seccion => 
          seccion.curso.planEstudioId === alumnoSeleccionado.value.planEstudioId &&
          seccion.activo &&
          seccion.capacidadActual < seccion.capacidadMaxima
        )
      } catch (error) {
        console.error('Error al cargar secciones:', error)
      }
    }

    const openNewMatricula = () => {
      step.value = 1
      form.value = {
        alumnoId: '',
        periodoAcademicoId: '',
        tipoMatricula: 'regular'
      }
      seccionesSeleccionadas.value = []
      showModal.value = true
    }

    const onAlumnoChange = () => {
      alumnoSeleccionado.value = alumnos.value.find(a => a.id === parseInt(form.value.alumnoId))
    }

    const nextStep = async () => {
      if (step.value === 1) {
        periodoSeleccionado.value = periodosAcademicos.value.find(p => p.id === parseInt(form.value.periodoAcademicoId))
        await loadSeccionesDisponibles()
      }
      step.value++
    }

    const toggleAll = () => {
      if (selectAll.value) {
        seccionesSeleccionadas.value = seccionesDisponibles.value
          .filter(s => puedeSeleccionar(s))
          .map(s => s.id)
      } else {
        seccionesSeleccionadas.value = []
      }
    }

    const puedeSeleccionar = (seccion) => {
      // Verificar si agregar esta sección excedería el límite de créditos
      if (!seccionesSeleccionadas.value.includes(seccion.id)) {
        const creditosConEsta = creditosSeleccionados.value + seccion.curso.creditos
        if (creditosConEsta > maxCreditos.value) return false
      }
      
      // Verificar vacantes
      if (seccion.capacidadActual >= seccion.capacidadMaxima) return false
      
      // Aquí se podrían agregar más validaciones (prerequisitos, cruces de horario, etc.)
      
      return true
    }

    const getCursoInfo = (seccionId) => {
      const seccion = seccionesDisponibles.value.find(s => s.id === seccionId)
      if (!seccion) return ''
      return `${seccion.curso.codigo} - ${seccion.curso.nombre} (Sección ${seccion.nombre})`
    }

    const saveMatricula = async () => {
      saving.value = true
      try {
        const data = {
          alumnoId: parseInt(form.value.alumnoId),
          periodoAcademicoId: parseInt(form.value.periodoAcademicoId),
          tipoMatricula: form.value.tipoMatricula,
          secciones: seccionesSeleccionadas.value.map(id => ({ seccionId: id }))
        }

        await api.post('/matriculas', data)
        closeModal()
        loadMatriculas()
        alert('Matrícula registrada exitosamente')
      } catch (error) {
        console.error('Error al guardar matrícula:', error)
        alert('Error al guardar matrícula: ' + (error.response?.data?.message || error.message))
      } finally {
        saving.value = false
      }
    }

    const viewDetalles = async (matricula) => {
      selectedMatricula.value = matricula
      try {
        const response = await api.get(`/detalles-matricula/matricula/${matricula.id}`)
        detallesMatricula.value = response.data.data
        showDetallesModal.value = true
      } catch (error) {
        console.error('Error al cargar detalles:', error)
        alert('Error al cargar detalles de la matrícula')
      }
    }

    const registrarPago = (matricula) => {
      selectedMatricula.value = matricula
      formPago.value = {
        metodoPago: '',
        numeroOperacion: ''
      }
      showPagoModal.value = true
    }

    const savePago = async () => {
      savingPago.value = true
      try {
        const data = {
          matriculaId: selectedMatricula.value.id,
          monto: selectedMatricula.value.montoTotal,
          metodoPago: formPago.value.metodoPago,
          numeroOperacion: formPago.value.numeroOperacion || null
        }

        await api.post('/pagos', data)
        showPagoModal.value = false
        loadMatriculas()
        alert('Pago registrado exitosamente')
      } catch (error) {
        console.error('Error al registrar pago:', error)
        alert('Error al registrar pago: ' + (error.response?.data?.message || error.message))
      } finally {
        savingPago.value = false
      }
    }

    const anularMatricula = async (matricula) => {
      if (!confirm(`¿Está seguro de anular la matrícula #${matricula.id.toString().padStart(6, '0')}?`)) {
        return
      }

      try {
        await api.patch(`/matriculas/${matricula.id}/anular`)
        loadMatriculas()
        alert('Matrícula anulada exitosamente')
      } catch (error) {
        console.error('Error al anular matrícula:', error)
        alert('Error al anular matrícula: ' + (error.response?.data?.message || error.message))
      }
    }

    const imprimirMatricula = (matricula) => {
      // Aquí se implementaría la lógica para generar un PDF o imprimir
      alert('Funcionalidad de impresión en desarrollo')
    }

    const searchMatriculas = () => {
      loadMatriculas()
    }

    const closeModal = () => {
      showModal.value = false
      step.value = 1
      form.value = {
        alumnoId: '',
        periodoAcademicoId: '',
        tipoMatricula: 'regular'
      }
      alumnoSeleccionado.value = null
      periodoSeleccionado.value = null
      seccionesSeleccionadas.value = []
      selectAll.value = false
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('es-ES')
    }

    const formatTime = (timeString) => {
      if (!timeString) return ''
      return timeString.substring(0, 5)
    }

    const getEstadoClass = (estado) => {
      const clases = {
        pendiente: 'bg-warning',
        pagado: 'bg-success',
        anulado: 'bg-danger'
      }
      return clases[estado] || 'bg-secondary'
    }

    const getEstadoLabel = (estado) => {
      const labels = {
        pendiente: 'Pendiente',
        pagado: 'Pagado',
        anulado: 'Anulado'
      }
      return labels[estado] || estado
    }

    const getVacantesClass = (seccion) => {
      const vacantes = seccion.capacidadMaxima - seccion.capacidadActual
      if (vacantes === 0) return 'bg-danger'
      if (vacantes <= 5) return 'bg-warning'
      return 'bg-success'
    }

    onMounted(() => {
      loadMatriculas()
      loadPeriodosAcademicos()
      loadAlumnos()
      loadConfiguraciones()
    })

    return {
      matriculas,
      periodosAcademicos,
      periodosActivos,
      alumnos,
      seccionesDisponibles,
      detallesMatricula,
      loading,
      saving,
      savingPago,
      showModal,
      showDetallesModal,
      showPagoModal,
      step,
      filterPeriodo,
      filterEstado,
      searchQuery,
      selectedMatricula,
      alumnoSeleccionado,
      periodoSeleccionado,
      seccionesSeleccionadas,
      selectAll,
      form,
      formPago,
      creditosSeleccionados,
      montoTotal,
      costoCredito,
      maxCreditos,
      canProceed,
      openNewMatricula,
      onAlumnoChange,
      nextStep,
      toggleAll,
      puedeSeleccionar,
      getCursoInfo,
      saveMatricula,
      viewDetalles,
      registrarPago,
      savePago,
      anularMatricula,
      imprimirMatricula,
      searchMatriculas,
      closeModal,
      formatDate,
      formatTime,
      getEstadoClass,
      getEstadoLabel,
      getVacantesClass
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
</style>