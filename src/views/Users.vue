<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Manage Posts</h1>
      <div v-if="posts && posts.length" class="overflow-x-auto bg-white shadow rounded">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-700">{{ post.id }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ post.username }}</td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <div v-if="editingPostId === post.id">
                  <input
                    v-model="editFeedback"
                    type="text"
                    class="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div v-else>
                  {{ post.feedback }}
                </div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">
                <div v-if="post.image_url">
                  <img :src="post.image_url" alt="Post Image" class="h-16 w-16 object-cover rounded" />
                </div>
                <div v-else class="text-gray-500">N/A</div>
              </td>
              <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(post.created_at) }}</td>
              <td class="px-4 py-3 text-sm text-gray-700 space-x-2 flex">
                <div v-if="editingPostId === post.id" class="flex space-x-2">
                  <button @click="saveEdit(post.id)" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Save</button>
                  <button @click="cancelEdit" class="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">Cancel</button>
                </div>
                <div v-else class="flex space-x-2">
                  <button @click="startEdit(post)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                  <button @click="deletePostItem(post.id)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-gray-700 mt-4">No posts available</div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import { useAuthStore } from '../store'
  
  export default {
    setup() {
      const authStore = useAuthStore()
  
      const editingPostId = ref(null)
      const editFeedback = ref('')
  
      onMounted(async () => {
        // If not already fetched or if you want to refresh:
        await authStore.fetchPosts()
      })
  
      const posts = computed(() => authStore.posts)
  
      const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString()
      }
  
      const startEdit = (post) => {
        editingPostId.value = post.id
        editFeedback.value = post.feedback
      }
  
      const cancelEdit = () => {
        editingPostId.value = null
        editFeedback.value = ''
      }
  
      const saveEdit = async (id) => {
        const { error } = await authStore.updatePost(id, { feedback: editFeedback.value })
        if (!error) {
          editingPostId.value = null
          editFeedback.value = ''
        } else {
          console.error('Error updating post:', error)
        }
      }
  
      const deletePostItem = async (id) => {
        const confirmDelete = confirm('Are you sure you want to delete this post?')
        if (!confirmDelete) return
  
        const { error } = await authStore.deletePost(id)
        if (error) {
          console.error('Error deleting post:', error)
        }
      }
  
      return {
        posts,
        editingPostId,
        editFeedback,
        formatDate,
        startEdit,
        cancelEdit,
        saveEdit,
        deletePostItem
      }
    }
  }
  </script>
  
  <style scoped>
  /* Additional Tailwind classes are applied inline. Add global or scoped styles if needed. */
  </style>
  