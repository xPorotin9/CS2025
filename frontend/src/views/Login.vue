<template>
  <div class="login-container">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-5">
              <div class="text-center mb-4">
                <i class="fas fa-graduation-cap fa-3x text-primary mb-3"></i>
                <h2 class="fw-bold">Sistema de Matrículas</h2>
                <p class="text-muted">Inicia sesión para continuar</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control"
                    v-model="form.email"
                    required
                    :disabled="loading"
                  >
                </div>

                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    class="form-control"
                    v-model="form.password"
                    required
                    :disabled="loading"
                  >
                </div>

                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary w-100"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Iniciar Sesión
                </button>
              </form>

              <div class="mt-4">
                <h6 class="text-muted">Credenciales de prueba:</h6>
                <small class="text-muted">
                  <strong>Admin:</strong> admin@matriculas.com / admin123<br>
                  <strong>Docente:</strong> juan.perez@matriculas.com / password123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const form = ref({
      email: '',
      password: ''
    })
    
    const loading = ref(false)
    const error = ref('')

    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      const result = await authStore.login(form.value)
      
      if (result.success) {
        router.push('/')
      } else {
        error.value = result.message
      }
      
      loading.value = false
    }

    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
}
</style>