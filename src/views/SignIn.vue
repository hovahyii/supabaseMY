<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
  
      <!-- Container for the Card -->
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative overflow-hidden">
        
        <!-- Logo at the top of the card -->
        <div class="absolute top-6 left-1/2 transform -translate-x-1/2">
          <img :src="logo" alt="Supabase Logo" class="w-auto" />
        </div>
  
        <!-- Page Header -->
        <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6 mt-20">Admin Login</h2>
  
        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              placeholder="admin@example.com"
            />
          </div>
  
          <!-- Password Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
              placeholder="********"
            />
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
          >
            <span v-if="isLoading" class="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full"></span>
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
  
        <!-- Error Message -->
        <p v-if="errorMessage" class="text-red-500 text-sm mt-4 text-center">{{ errorMessage }}</p>
  
        <!-- Go Back to Homepage Button -->
        <div class="mt-6 text-center">
          <router-link to="/" class="inline-block bg-green-400 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors duration-300">
            Go Back to Homepage
          </router-link>
        </div>
      </div>
  

    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useAuthStore } from '../store'
  import { useRouter } from 'vue-router'
  import logo from '../assets/images/supabase-kl-logo.png' // Import the logo
  
  export default {
    setup() {
      const authStore = useAuthStore()
      const router = useRouter()
  
      const email = ref('')
      const password = ref('')
      const isLoading = ref(false)
      const errorMessage = ref(null)
  
      const handleLogin = async () => {
        isLoading.value = true
        errorMessage.value = null
  
        const { error } = await authStore.login(email.value, password.value)
        isLoading.value = false
  
        if (error) {
          errorMessage.value = 'Invalid credentials or not admin user.'
        } else {
          if (authStore.isAdmin) {
            router.push('/admin/analytics')
          } else {
            errorMessage.value = 'You are not authorized as an admin.'
          }
        }
      }
  
      return {
        email,
        password,
        isLoading,
        errorMessage,
        handleLogin,
        logo // Expose the logo to the template
      }
    }
  }
  </script>
  
  <style scoped>
  /* Custom styles for the page */
  .bg-gradient-to-r {
    background: linear-gradient(135deg, #3b82f6, #10b981);
  }
  
  input:focus, button:focus {
    outline: none;
  }
  </style>
  