<template>
    <div class="flex min-h-screen">
  
      <!-- Sidebar -->
      <div class="bg-gray-800 text-white w-64 p-6">
        <h2 class="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <router-link to="/admin/analytics" class="text-lg hover:bg-gray-700 p-2 block">
                Analytics
              </router-link>
            </li>
            <li>
              <router-link to="/admin/users" class="text-lg hover:bg-gray-700 p-2 block">
                Users
              </router-link>
            </li>
            <li>
              <router-link to="/" class="text-lg hover:bg-gray-700 p-2 block">
                Back to HomePage
              </router-link>
            </li>
            <li>
              <button @click="handleLogout" class="text-lg hover:bg-gray-700 p-2 block">
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      <!-- Main Content -->
      <div class="flex-grow bg-gray-100 p-6">
        <router-view></router-view>
      </div>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from '../store'
  import { useRouter } from 'vue-router'
  import { onMounted } from 'vue'
  
  export default {
    setup() {
      const authStore = useAuthStore()
      const router = useRouter()
  
      // Check if session is still valid when the admin page loads
      onMounted(() => {
        if (!authStore.user || !authStore.isAdmin) {
          router.push('/sign-in') // Redirect to sign-in if no valid admin session
        }
      })
  
      // Logout handler
      const handleLogout = async () => {
        await authStore.logout()
        router.push('/sign-in') // Redirect to sign-in after logout
      }
  
      return {
        handleLogout
      }
    }
  }
  </script>
  
  <style scoped>
  /* Adjust sidebar and layout styles as needed */
  </style>
  