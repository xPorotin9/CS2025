<template>
  <div id="app">
    <Navbar v-if="authStore.isAuthenticated" />
    <main class="main-content" :class="{ 'with-navbar': authStore.isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/auth'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const authStore = useAuthStore()

    // Verificar token al cargar la app
    authStore.checkAuth()

    return {
      authStore
    }
  }
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>