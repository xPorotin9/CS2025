<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="fas fa-graduation-cap me-2"></i>
        Sistema Matrículas
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" active-class="active">
              <i class="fas fa-tachometer-alt me-1"></i>Dashboard
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/facultades" active-class="active">
              <i class="fas fa-university me-1"></i>Facultades
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/escuelas" active-class="active">
              <i class="fas fa-building me-1"></i>Escuelas
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/planes-estudio" active-class="active">
              <i class="fas fa-book me-1"></i>Planes de Estudio
            </router-link>
          </li>
        </ul>

        <div class="navbar-nav">
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
              <i class="fas fa-user me-1"></i>{{ authStore.user?.nombre }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#"><i class="fas fa-user-cog me-2"></i>Perfil</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click="logout">
                <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
              </a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const logout = () => {
      authStore.logout()
      router.push('/login')
    }

    return {
      authStore,
      logout
    }
  }
}
</script>