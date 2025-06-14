<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">
          <i class="fas fa-tachometer-alt text-primary me-2"></i>
          Dashboard
        </h1>
        
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          Bienvenido al Sistema de Matrículas, {{ authStore.user?.nombre }}
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center">
            <div class="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="fas fa-university fa-2x text-primary"></i>
            </div>
            <h5 class="card-title">{{ stats.facultades }}</h5>
            <p class="card-text text-muted">Facultades</p>
            <router-link to="/facultades" class="btn btn-outline-primary btn-sm">
              Ver todas
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center">
            <div class="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="fas fa-building fa-2x text-success"></i>
            </div>
            <h5 class="card-title">{{ stats.escuelas }}</h5>
            <p class="card-text text-muted">Escuelas</p>
            <router-link to="/escuelas" class="btn btn-outline-success btn-sm">
              Ver todas
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center">
            <div class="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="fas fa-book fa-2x text-warning"></i>
            </div>
            <h5 class="card-title">{{ stats.planes }}</h5>
            <p class="card-text text-muted">Planes de Estudio</p>
            <router-link to="/planes-estudio" class="btn btn-outline-warning btn-sm">
              Ver todos
            </router-link>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body text-center">
            <div class="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style="width: 60px; height: 60px;">
              <i class="fas fa-users fa-2x text-info"></i>
            </div>
            <h5 class="card-title">-</h5>
            <p class="card-text text-muted">Estudiantes Activos</p>
            <button class="btn btn-outline-info btn-sm" disabled>
              Próximamente
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="fas fa-chart-line text-primary me-2"></i>
              Accesos Rápidos
            </h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-4">
                <router-link to="/facultades" class="btn btn-light w-100 text-start p-3">
                  <i class="fas fa-university text-primary me-3"></i>
                  <div>
                    <strong>Gestionar Facultades</strong>
                    <br><small class="text-muted">Crear y administrar facultades</small>
                  </div>
                </router-link>
              </div>
              <div class="col-md-4">
                <router-link to="/escuelas" class="btn btn-light w-100 text-start p-3">
                  <i class="fas fa-building text-success me-3"></i>
                  <div>
                    <strong>Gestionar Escuelas</strong>
                    <br><small class="text-muted">Crear y administrar escuelas</small>
                  </div>
                </router-link>
              </div>
              <div class="col-md-4">
                <router-link to="/planes-estudio" class="btn btn-light w-100 text-start p-3">
                  <i class="fas fa-book text-warning me-3"></i>
                  <div>
                    <strong>Planes de Estudio</strong>
                    <br><small class="text-muted">Administrar planes curriculares</small>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { facultadesService } from '@/services/facultades'
import { escuelasService } from '@/services/escuelas'
import { planesEstudioService } from '@/services/planesEstudio'

export default {
  name: 'Dashboard',
  setup() {
    const authStore = useAuthStore()
    const stats = ref({
      facultades: 0,
      escuelas: 0,
      planes: 0
    })

    const loadStats = async () => {
      try {
        const [facultadesRes, escuelasRes, planesRes] = await Promise.all([
          facultadesService.getAll(),
          escuelasService.getAll(),
          planesEstudioService.getAll()
        ])
        
        stats.value = {
          facultades: facultadesRes.data.count,
          escuelas: escuelasRes.data.count,
          planes: planesRes.data.count
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
      }
    }

    onMounted(() => {
      loadStats()
    })

    return {
      authStore,
      stats
    }
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}
</style>