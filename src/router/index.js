// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import Admin from '../views/Admin.vue'
import Analytics from '../views/Analytics.vue'
import Users from '../views/Users.vue'
import { useAuthStore } from '../store'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/sign-in', name: 'SignIn', component: SignIn },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      { path: 'analytics', name: 'Analytics', component: Analytics },
      { path: 'users', name: 'Users', component: Users },
    ],
    beforeEnter: (to, from, next) => {
      const authStore = useAuthStore()
      if (!authStore.user || !authStore.isAdmin) {
        next({ name: 'SignIn' })
      } else {
        next()
      }
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
