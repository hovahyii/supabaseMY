<template>
    <nav class="bg-gray-800 text-white w-full">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <!-- Logo Section -->
        <div class="flex items-center">
          <router-link to="/">
            <img src="../assets/images/supabase-icon.svg" alt="Logo" class="h-8 w-8 mr-2" />
          </router-link>
          <span class="font-bold text-xl">Supabase MY</span>
        </div>
  
        <!-- Navigation Links -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="hover:underline">Home</router-link>
  
          <!-- Show Admin Dashboard link only if logged in as admin -->
          <router-link v-if="isAdmin" to="/admin/analytics" class="hover:underline">Dashboard</router-link>
  
          <!-- Show Admin Login link if not logged in as admin -->
          <router-link v-else to="/sign-in" class="bg-green-500 px-3 py-1 rounded hover:bg-green-600">
            Login
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { useAuthStore } from '../store'
  import { useRouter } from 'vue-router'
  
  export default {
    setup() {
      const authStore = useAuthStore()
      const router = useRouter()
  
      return {
        isAdmin: authStore.isAdmin,
      }
    }
  }
  </script>
  
  <style scoped>
  /* Make navbar full width */
  .navbar {
    width: 100%;
  }
  </style>
  