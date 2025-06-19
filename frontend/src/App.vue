<template>
  <div id="app">
    <!-- NAVBAR SOLO SI EL USUARIO ESTÁ AUTENTICADO -->
    <nav
      v-if="authStore.isAuthenticated"
      class="navbar navbar-expand-lg navbar-light bg-light fixed-top"
    >
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">Mi Sistema</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- MENÚ DE NAVEGACIÓN -->
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" active-class="active">
                <i class="fas fa-tachometer-alt me-1"></i>Dashboard
              </router-link>
            </li>

            <!-- Dropdown Académico -->
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                <i class="fas fa-graduation-cap me-1"></i>Académico
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/facultades">
                    <i class="fas fa-university me-2"></i>Facultades
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/escuelas">
                    <i class="fas fa-building me-2"></i>Escuelas
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/planes-estudio">
                    <i class="fas fa-book me-2"></i>Planes de Estudio
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/cursos">
                    <i class="fas fa-book-open me-2"></i>Cursos
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/areas">
                    <i class="fas fa-layer-group me-2"></i>Áreas
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Dropdown Usuarios -->
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                <i class="fas fa-users me-1"></i>Usuarios
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/docentes">
                    <i class="fas fa-chalkboard-teacher me-2"></i>Docentes
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/alumnos">
                    <i class="fas fa-user-graduate me-2"></i>Alumnos
                  </router-link>
                </li>
              </ul>
            </li>
            
            <!-- Dropdown Matrículas -->
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                role="button"
                aria-expanded="false"
              >
                <i class="fas fa-clipboard-list me-1"></i>Matrículas
              </a>
              <ul class="dropdown-menu">
                <li>
                  <router-link class="dropdown-item" to="/matriculas">
                    <i class="fas fa-clipboard-list me-2"></i>Gestión de Matrículas
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/periodos-academicos">
                    <i class="fas fa-calendar-alt me-2"></i>Periodos Académicos
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/secciones">
                    <i class="fas fa-th-list me-2"></i>Secciones y Horarios
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
          <!-- Puedes agregar aquí más elementos a la derecha (por ejemplo, logout, usuario, etc.) -->
        </div>
      </div>
    </nav>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="main-content" :class="{ 'with-navbar': authStore.isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth'

export default {
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    // Verificar token al cargar la app
    authStore.checkAuth()
    return {
      authStore,
    }
  },
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}

.main-content {
  min-height: 100vh;
}

.main-content.with-navbar {
  padding-top: 80px;
}

/* Si el navbar es fixed-top */
.navbar.fixed-top {
  z-index: 1040;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>