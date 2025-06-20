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
                <th>Facultad/Escuela</th>
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
                  <small class="text-muted">
                    {{ matricula.alumno?.escuela?.facultad?.nombre }}<br>
                    {{ matricula.alumno?.escuela?.nombre }}
                  </small>
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
            <h5 class="modal-title">
              <i class="fas fa-plus me-2"></i>Nueva Matrícula
              <span v-if="step > 1" class="badge bg-primary ms-2">Paso {{ step }} de 3</span>
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <!-- Paso 1: Seleccionar alumno y periodo -->
            <div v-if="step === 1">
              <h6 class="mb-3">
                <i class="fas fa-user-check me-2"></i>Paso 1: Seleccionar Alumno y Periodo
              </h6>
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
                  
                  <!-- Información detallada del alumno seleccionado -->
                  <div v-if="alumnoSeleccionado" class="alert alert-info">
                    <h6><i class="fas fa-user-graduate me-2"></i>Información del Alumno</h6>
                    <div class="row">
                      <div class="col-12">
                        <strong>Nombre:</strong> {{ alumnoSeleccionado.usuario?.nombre }} {{ alumnoSeleccionado.usuario?.apellido }}<br>
                        <strong>Código:</strong> {{ alumnoSeleccionado.codigo }}<br>
                        <strong>Facultad:</strong> {{ alumnoSeleccionado.escuela?.facultad?.nombre }} ({{ alumnoSeleccionado.escuela?.facultad?.codigo }})<br>
                        <strong>Escuela:</strong> {{ alumnoSeleccionado.escuela?.nombre }} ({{ alumnoSeleccionado.escuela?.codigo }})<br>
                        <strong>Plan de Estudio:</strong> {{ alumnoSeleccionado.planEstudio?.nombre }}<br>
                        <strong>Ciclo Actual:</strong> {{ alumnoSeleccionado.cicloActual }}° ciclo<br>
                        <small class="text-muted mt-2 d-block">
                          <i class="fas fa-info-circle me-1"></i>
                          Puede matricularse en cursos hasta el {{ alumnoSeleccionado.cicloActual + 1 }}° ciclo
                        </small>
                      </div>
                    </div>
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
                      <option value="extemporanea">Extemporánea (+20% recargo)</option>
                    </select>
                  </div>
                  
                  <!-- Información del periodo seleccionado -->
                  <div v-if="periodoSeleccionado" class="alert alert-light">
                    <h6><i class="fas fa-calendar-alt me-2"></i>Información del Periodo</h6>
                    <strong>Periodo:</strong> {{ periodoSeleccionado.nombre }}<br>
                    <strong>Estado:</strong> 
                    <span class="badge" :class="getEstadoClass(periodoSeleccionado.estado)">
                      {{ getEstadoLabel(periodoSeleccionado.estado) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Paso 2: Seleccionar cursos -->
            <div v-if="step === 2">
              <h6 class="mb-3">
                <i class="fas fa-book-open me-2"></i>Paso 2: Seleccionar Cursos
                <small class="text-muted">- {{ alumnoSeleccionado?.escuela?.facultad?.nombre }} / {{ alumnoSeleccionado?.escuela?.nombre }}</small>
              </h6>
              
              <div class="alert alert-warning mb-3">
                <div class="row align-items-center">
                  <div class="col-md-8">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>{{ alumnoSeleccionado?.usuario?.nombre }} {{ alumnoSeleccionado?.usuario?.apellido }}</strong> - Ciclo actual: {{ alumnoSeleccionado?.cicloActual }}°<br>
                    <small>Créditos seleccionados: <strong>{{ creditosSeleccionados }}</strong> / Máximo permitido: <strong>{{ maxCreditos }}</strong></small>
                  </div>
                  <div class="col-md-4 text-end">
                    <div class="progress" style="height: 8px;">
                      <div 
                        class="progress-bar" 
                        :class="creditosSeleccionados > maxCreditos ? 'bg-danger' : 'bg-primary'"
                        :style="{ width: Math.min((creditosSeleccionados / maxCreditos) * 100, 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cursos organizados por ciclo -->
              <div v-for="ciclo in ciclosOrdenados" :key="ciclo" class="mb-4">
                <div class="d-flex align-items-center mb-3">
                  <h6 class="text-primary mb-0 me-3">
                    <i class="fas fa-layer-group me-2"></i>{{ ciclo }}° Ciclo
                  </h6>
                  <span v-if="ciclo === alumnoSeleccionado?.cicloActual" class="badge bg-success">Ciclo Actual</span>
                  <span v-else-if="ciclo === alumnoSeleccionado?.cicloActual + 1" class="badge bg-warning">Ciclo Siguiente</span>
                  <span v-else-if="ciclo < alumnoSeleccionado?.cicloActual" class="badge bg-secondary">Ciclo Anterior</span>
                  <span v-else class="badge bg-danger">No Disponible</span>
                </div>
                
                <div class="table-responsive">
                  <table class="table table-sm table-hover">
                    <thead class="table-light">
                      <tr>
                        <th width="50">
                          <input type="checkbox" class="form-check-input" disabled>
                        </th>
                        <th>Código</th>
                        <th>Curso</th>
                        <th>Área</th>
                        <th>Tipo</th>
                        <th>Créditos</th>
                        <th>Sección</th>
                        <th>Docente</th>
                        <th>Horario</th>
                        <th>Vacantes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="seccion in getCursosPorCiclo[ciclo]" :key="seccion.id" 
                          :class="{ 'table-warning': !puedeSeleccionarCurso(seccion) }">
                        <td>
                          <input 
                            type="checkbox" 
                            class="form-check-input"
                            :value="seccion.id"
                            v-model="seccionesSeleccionadas"
                            :disabled="!puedeSeleccionarCurso(seccion)"
                          >
                        </td>
                        <td>
                          <span class="badge bg-dark">{{ seccion.curso.codigo }}</span>
                        </td>
                        <td>
                          <strong>{{ seccion.curso.nombre }}</strong>
                          <span v-if="seccion.curso.area" class="d-block">
                            <small class="text-muted">{{ seccion.curso.area.nombre }}</small>
                          </span>
                        </td>
                        <td>
                          <span v-if="seccion.curso.area" class="badge bg-secondary">
                            {{ seccion.curso.area.codigo }}
                          </span>
                          <span v-else class="text-muted">-</span>
                        </td>
                        <td>
                          <span class="badge" :class="seccion.curso.tipo === 'obligatorio' ? 'bg-primary' : 'bg-warning'">
                            {{ seccion.curso.tipo }}
                          </span>
                        </td>
                        <td>
                          <span class="badge bg-info">{{ seccion.curso.creditos }}</span>
                        </td>
                        <td>{{ seccion.nombre }}</td>
                        <td>
                          <small>
                            {{ seccion.docente?.usuario?.nombre }} {{ seccion.docente?.usuario?.apellido }}
                          </small>
                        </td>
                        <td>
                          <small v-for="horario in seccion.horarios" :key="horario.id" class="d-block">
                            {{ horario.dia }}: {{ formatTime(horario.horaInicio) }}-{{ formatTime(horario.horaFin) }}
                            <span class="text-muted">({{ horario.aula }})</span>
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
              
              <!-- Mensaje si no hay cursos disponibles -->
              <div v-if="seccionesDisponibles.length === 0" class="text-center py-4">
                <i class="fas fa-info-circle fa-2x text-muted mb-3"></i>
                <p class="text-muted">No hay secciones disponibles para este alumno en el periodo seleccionado.</p>
                <p class="text-muted">Verifique que el periodo esté activo y que haya cursos programados para el ciclo del estudiante.</p>
              </div>
            </div>

            <!-- Paso 3: Confirmar matrícula -->
            <div v-if="step === 3">
              <h6 class="mb-3">
                <i class="fas fa-check-circle me-2"></i>Paso 3: Confirmar Matrícula
              </h6>
              
              <div class="row">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header bg-primary text-white">
                      <h6 class="mb-0"><i class="fas fa-user me-2"></i>Información del Estudiante</h6>
                    </div>
                    <div class="card-body">
                      <p><strong>Alumno:</strong> {{ alumnoSeleccionado?.usuario?.nombre }} {{ alumnoSeleccionado?.usuario?.apellido }}</p>
                      <p><strong>Código:</strong> {{ alumnoSeleccionado?.codigo }}</p>
                      <p><strong>Facultad:</strong> {{ alumnoSeleccionado?.escuela?.facultad?.nombre }}</p>
                      <p><strong>Escuela:</strong> {{ alumnoSeleccionado?.escuela?.nombre }}</p>
                      <p><strong>Ciclo Actual:</strong> {{ alumnoSeleccionado?.cicloActual }}°</p>
                      <p><strong>Periodo:</strong> {{ periodoSeleccionado?.nombre }}</p>
                      <p><strong>Tipo:</strong> 
                        <span class="badge" :class="form.tipoMatricula === 'regular' ? 'bg-primary' : 'bg-warning'">
                          {{ form.tipoMatricula === 'regular' ? 'Regular' : 'Extemporánea' }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header bg-success text-white">
                      <h6 class="mb-0"><i class="fas fa-calculator me-2"></i>Resumen Académico y Financiero</h6>
                    </div>
                    <div class="card-body">
                      <p><strong>Total de cursos:</strong> {{ seccionesSeleccionadas.length }}</p>
                      <p><strong>Total de créditos:</strong> {{ creditosSeleccionadas }}</p>
                      <hr>
                      <p><strong>Costo por crédito:</strong> S/. {{ costoCredito.toFixed(2) }}</p>
                      <p><strong>Subtotal:</strong> S/. {{ (creditosSeleccionados * costoCredito).toFixed(2) }}</p>
                      <p v-if="form.tipoMatricula === 'extemporanea'" class="text-warning">
                        <strong>Recargo extemporáneo (20%):</strong> S/. {{ (creditosSeleccionados * costoCredito * 0.2).toFixed(2) }}
                      </p>
                      <hr>
                      <h5 class="text-success"><strong>Total a pagar:</strong> S/. {{ montoTotal.toFixed(2) }}</h5>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <h6><i class="fas fa-list me-2"></i>Cursos seleccionados por ciclo:</h6>
                <div v-for="ciclo in ciclosOrdenados" :key="ciclo">
                  <template v-if="getCursosSeleccionadosPorCiclo(ciclo).length > 0">
                    <h6 class="text-primary mt-3">
                      <i class="fas fa-layer-group me-2"></i>{{ ciclo }}° Ciclo
                    </h6>
                    <div class="table-responsive">
                      <table class="table table-sm table-striped">
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Curso</th>
                            <th>Sección</th>
                            <th>Créditos</th>
                            <th>Docente</th>
                            <th>Horarios</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="seccionId in getCursosSeleccionadosPorCiclo(ciclo)" :key="seccionId">
                            <td><span class="badge bg-dark">{{ getCursoData(seccionId).codigo }}</span></td>
                            <td><strong>{{ getCursoData(seccionId).nombre }}</strong></td>
                            <td>{{ getCursoData(seccionId).seccion }}</td>
                            <td><span class="badge bg-info">{{ getCursoData(seccionId).creditos }}</span></td>
                            <td><small>{{ getCursoData(seccionId).docente }}</small></td>
                            <td><small>{{ getCursoData(seccionId).horarios }}</small></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </template>
                </div>
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
            <button type="button" class="btn btn-outline-secondary" @click="closeModal">
              <i class="fas fa-times me-2"></i>Cancelar
            </button>
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
            <h5 class="modal-title">
              <i class="fas fa-eye me-2"></i>Detalles de Matrícula #{{ selectedMatricula?.id.toString().padStart(6, '0') }}
            </h5>
            <button type="button" class="btn-close" @click="showDetallesModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <strong>Alumno:</strong> {{ selectedMatricula?.alumno?.usuario?.nombre }} {{ selectedMatricula?.alumno?.usuario?.apellido }}<br>
                <strong>Código:</strong> {{ selectedMatricula?.alumno?.codigo }}<br>
                <strong>Facultad:</strong> {{ selectedMatricula?.alumno?.escuela?.facultad?.nombre }}<br>
                <strong>Escuela:</strong> {{ selectedMatricula?.alumno?.escuela?.nombre }}<br>
                <strong>Periodo:</strong> {{ selectedMatricula?.periodoAcademico?.nombre }}<br>
              </div>
              <div class="col-md-6">
                <strong>Fecha:</strong> {{ formatDate(selectedMatricula?.fechaMatricula) }}<br>
                <strong>Tipo:</strong> 
                <span class="badge" :class="selectedMatricula?.tipoMatricula === 'regular' ? 'bg-primary' : 'bg-warning'">
                  {{ selectedMatricula?.tipoMatricula }}
                </span><br>
                <strong>Estado:</strong> 
                <span class="badge" :class="getEstadoClass(selectedMatricula?.estado)">
                  {{ getEstadoLabel(selectedMatricula?.estado) }}
                </span><br>
                <strong>Créditos:</strong> {{ selectedMatricula?.creditosInscritos }}<br>
                <strong>Monto:</strong> S/. {{ selectedMatricula?.montoTotal?.toFixed(2) }}
              </div>
            </div>

            <h6><i class="fas fa-book me-2"></i>Cursos matriculados:</h6>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Curso</th>
                    <th>Sección</th>
                    <th>Ciclo</th>
                    <th>Créditos</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detalle in detallesMatricula" :key="detalle.id">
                    <td><span class="badge bg-dark">{{ detalle.seccion?.curso?.codigo }}</span></td>
                    <td>{{ detalle.seccion?.curso?.nombre }}</td>
                    <td>{{ detalle.seccion?.nombre }}</td>
                    <td><span class="badge bg-info">{{ detalle.seccion?.curso?.ciclo }}°</span></td>
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
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Registrar Pago -->
    <div class="modal fade" :class="{ show: showPagoModal }" :style="{ display: showPagoModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-dollar-sign me-2"></i>Registrar Pago
            </h5>
            <button type="button" class="btn-close" @click="showPagoModal = false"></button>
          </div>
          <form @submit.prevent="savePago">
            <div class="modal-body">
              <div class="alert alert-info">
                <strong>Monto a pagar:</strong> S/. {{ selectedMatricula?.montoTotal?.toFixed(2) }}<br>
                <strong>Alumno:</strong> {{ selectedMatricula?.alumno?.usuario?.nombre }} {{ selectedMatricula?.alumno?.usuario?.apellido }}
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
                <input type="text" class="form-control" v-model="formPago.numeroOperacion" placeholder="Opcional">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showPagoModal = false">Cancelar</button>
              <button type="submit" class="btn btn-success" :disabled="savingPago">
                <span v-if="savingPago" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-check me-2"></i>Registrar Pago
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

    // Función para agrupar cursos por ciclo
    const getCursosPorCiclo = computed(() => {
      const grupos = {}
      seccionesDisponibles.value.forEach(seccion => {
        const ciclo = seccion.curso.ciclo
        if (!grupos[ciclo]) {
          grupos[ciclo] = []
        }
        grupos[ciclo].push(seccion)
      })
      return grupos
    })

    // Función para obtener los ciclos ordenados
    const ciclosOrdenados = computed(() => {
      return Object.keys(getCursosPorCiclo.value)
        .map(ciclo => parseInt(ciclo))
        .sort((a, b) => a - b)
    })

    // Función para obtener cursos seleccionados por ciclo
    const getCursosSeleccionadosPorCiclo = (ciclo) => {
      return seccionesSeleccionadas.value.filter(seccionId => {
        const seccion = seccionesDisponibles.value.find(s => s.id === seccionId)
        return seccion && seccion.curso.ciclo === ciclo
      })
    }

    // Función para calcular el monto total con recargo extemporáneo
    const montoTotal = computed(() => {
      let costo = costoCredito.value
      if (form.value.tipoMatricula === 'extemporanea') {
        costo = costo * 1.2 // 20% de recargo
      }
      return creditosSeleccionados.value * costo
    })

    // Función mejorada para validar si puede proceder al siguiente paso
    const canProceed = computed(() => {
      if (step.value === 1) {
        return form.value.alumnoId && 
               form.value.periodoAcademicoId && 
               form.value.tipoMatricula &&
               alumnoSeleccionado.value
      } else if (step.value === 2) {
        return seccionesSeleccionadas.value.length > 0 && 
               creditosSeleccionados.value <= maxCreditos.value &&
               creditosSeleccionados.value >= 12 // Mínimo 12 créditos para matrícula regular
      }
      return true
    })

    // Función para validar conflictos de horario
    const tieneConflictoHorario = (seccionNueva) => {
      for (const seccionId of seccionesSeleccionadas.value) {
        const seccionExistente = seccionesDisponibles.value.find(s => s.id === seccionId)
        if (!seccionExistente || seccionExistente.id === seccionNueva.id) continue
        
        // Verificar conflicto de horarios
        for (const horarioNuevo of seccionNueva.horarios || []) {
          for (const horarioExistente of seccionExistente.horarios || []) {
            if (horarioNuevo.dia === horarioExistente.dia) {
              const inicioNuevo = horarioNuevo.horaInicio
              const finNuevo = horarioNuevo.horaFin
              const inicioExistente = horarioExistente.horaInicio
              const finExistente = horarioExistente.horaFin
              
              // Verificar solapamiento de horarios
              if ((inicioNuevo < finExistente && finNuevo > inicioExistente)) {
                return true
              }
            }
          }
        }
      }
      return false
    }

    // Función mejorada para determinar si puede seleccionar un curso
    const puedeSeleccionarCurso = (seccion) => {
      // Verificar si agregar esta sección excedería el límite de créditos
      if (!seccionesSeleccionadas.value.includes(seccion.id)) {
        const creditosConEsta = creditosSeleccionados.value + seccion.curso.creditos
        if (creditosConEsta > maxCreditos.value) return false
      }
      
      // Verificar vacantes
      if (seccion.capacidadActual >= seccion.capacidadMaxima) return false
      
      // Verificar que no esté ya seleccionando otra sección del mismo curso
      const cursoYaSeleccionado = seccionesSeleccionadas.value.some(seccionId => {
        const seccionSeleccionada = seccionesDisponibles.value.find(s => s.id === seccionId)
        return seccionSeleccionada && seccionSeleccionada.curso.id === seccion.curso.id
      })
      
      if (cursoYaSeleccionado) return false
      
      // Verificar conflictos de horario
      if (tieneConflictoHorario(seccion)) return false
      
      return true
    }

    // Función para obtener información detallada de un curso seleccionado
    const getCursoData = (seccionId) => {
      const seccion = seccionesDisponibles.value.find(s => s.id === seccionId)
      if (!seccion) return {}
      
      const docente = seccion.docente?.usuario ? 
        `${seccion.docente.usuario.nombre} ${seccion.docente.usuario.apellido}` : 
        'Sin docente asignado'
        
      const horarios = seccion.horarios?.map(h => 
        `${h.dia}: ${formatTime(h.horaInicio)}-${formatTime(h.horaFin)} (${h.aula})`
      ).join(', ') || 'Sin horarios'
      
      return {
        codigo: seccion.curso.codigo,
        nombre: seccion.curso.nombre,
        seccion: seccion.nombre,
        creditos: seccion.curso.creditos,
        docente: docente,
        horarios: horarios
      }
    }

    // Función para mostrar información completa del curso
    const getCursoInfo = (seccionId) => {
      const data = getCursoData(seccionId)
      return `${data.codigo} - ${data.nombre} (Sección ${data.seccion}) - ${data.creditos} créditos - Prof. ${data.docente} - ${data.horarios}`
    }

    const loadMatriculas = async () => {
      loading.value = true
      try {
        const response = await api.get('/matriculas')
        let data = response.data.data

        // Filtrar localmente
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
    console.log('Cargando secciones para:', {
      periodoAcademicoId: form.value.periodoAcademicoId,
      alumnoId: alumnoSeleccionado.value.id,
      cicloActual: alumnoSeleccionado.value.cicloActual
    })
    
    const response = await api.get(`/secciones/disponibles/periodo/${form.value.periodoAcademicoId}/alumno/${alumnoSeleccionado.value.id}`)
    
    console.log('Respuesta del servidor:', response.data)
    
    if (response.data.success) {
      // Actualizar la información del alumno con más detalles
      alumnoSeleccionado.value = response.data.data.alumno
      seccionesDisponibles.value = response.data.data.secciones
      periodoSeleccionado.value = response.data.data.periodoAcademico
      
      console.log('Secciones disponibles:', seccionesDisponibles.value.length)
      
      if (seccionesDisponibles.value.length === 0) {
        console.warn('No se encontraron secciones disponibles')
        if (response.data.data.message) {
          alert(response.data.data.message)
        }
      }
    } else {
      alert(response.data.message || 'Error al cargar secciones disponibles')
      seccionesDisponibles.value = []
    }
  } catch (error) {
    console.error('Error al cargar secciones:', error)
    console.error('Error details:', error.response?.data)
    
    if (error.response?.status === 404) {
      alert('No se encontró el endpoint. Verifique que el servidor esté funcionando correctamente.')
    } else {
      alert('Error al cargar secciones disponibles: ' + (error.response?.data?.message || error.message))
    }
    seccionesDisponibles.value = []
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
      const alumno = alumnos.value.find(a => a.id === parseInt(form.value.alumnoId))
      alumnoSeleccionado.value = alumno
      
      // Limpiar secciones disponibles cuando cambia el alumno
      seccionesDisponibles.value = []
      seccionesSeleccionadas.value = []
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
          .filter(s => puedeSeleccionarCurso(s))
          .map(s => s.id)
      } else {
        seccionesSeleccionadas.value = []
      }
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

    // Función para resetear el proceso de matrícula
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
      seccionesDisponibles.value = []
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
        anulado: 'bg-danger',
        programado: 'bg-info',
        en_curso: 'bg-success',
        finalizado: 'bg-secondary'
      }
      return clases[estado] || 'bg-secondary'
    }

    const getEstadoLabel = (estado) => {
      const labels = {
        pendiente: 'Pendiente',
        pagado: 'Pagado',
        anulado: 'Anulado',
        programado: 'Programado',
        en_curso: 'En Curso',
        finalizado: 'Finalizado'
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
      // Variables reactivas
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
      
      // Funciones computadas
      getCursosPorCiclo,
      ciclosOrdenados,
      getCursosSeleccionadosPorCiclo,
      
      // Funciones
      puedeSeleccionarCurso,
      getCursoInfo,
      getCursoData,
      tieneConflictoHorario,
      openNewMatricula,
      onAlumnoChange,
      nextStep,
      toggleAll,
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

.table-warning {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

.progress {
  border-radius: 10px;
}

.card-header {
  border-radius: 0.375rem 0.375rem 0 0 !important;
}

.badge {
  font-size: 0.75em;
}

.alert {
  border-radius: 0.5rem;
}

.btn {
  border-radius: 0.375rem;
}

.form-select, .form-control {
  border-radius: 0.375rem;
}
</style>