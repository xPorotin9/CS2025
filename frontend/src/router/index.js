import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/facultades',
    name: 'Facultades',
    component: () => import('@/views/Facultades.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/escuelas',
    name: 'Escuelas',
    component: () => import('@/views/Escuelas.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/planes-estudio',
    name: 'PlanesEstudio',
    component: () => import('@/views/PlanesEstudio.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cursos',
    name: 'Cursos',
    component: () => import('@/views/Cursos.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/docentes',
    name: 'Docentes',
    component: () => import('@/views/Docentes.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/alumnos',
    name: 'Alumnos',
    component: () => import('@/views/Alumnos.vue'),
    meta: { requiresAuth: true },
  },

  {
  path: '/areas',
  name: 'Areas',
  component: () => import('@/views/Areas.vue'),
  meta: { requiresAuth: true },
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
