<template>
    <div class="container mx-auto p-6">
      <!-- Page Header -->
      <div class="mb-6">
        <h2 class="text-3xl font-semibold text-gray-800">Admin Analytics</h2>
        <p class="text-lg text-gray-500">Overview of the number of users and posts</p>
      </div>
  
      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <!-- Users Count Card -->
        <div class="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">Users</h3>
            <p class="text-sm text-gray-500">Total number of users registered</p>
          </div>
          <div class="text-center">
            <h2 class="text-4xl font-bold" style="color: #3ECF8E;">{{ userCount }}</h2>
          </div>
        </div>
  
        <!-- Posts Count Card -->
        <div class="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 class="text-2xl font-bold text-gray-800">Posts</h3>
            <p class="text-sm text-gray-500">Total number of posts created</p>
          </div>
          <div class="text-center">
            <h2 class="text-4xl font-bold" style="color: #3ECF8E;">{{ postCount }}</h2>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useAuthStore } from '../store'
  
  export default {
    setup() {
      const authStore = useAuthStore()
      const userCount = ref(0)
      const postCount = ref(0)
  
      // Fetch the number of users and posts when the component is mounted
      onMounted(async () => {
        userCount.value = await authStore.fetchUserCount()
        postCount.value = await authStore.fetchPostCount()
      })
  
      return {
        userCount,
        postCount
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add any additional styles if needed */
  </style>
  