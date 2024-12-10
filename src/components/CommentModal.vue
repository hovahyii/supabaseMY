<!-- src/components/CommentModal.vue -->
<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeModal">
      <div class="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close Modal"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
  
        <!-- Feedback Form -->
        <form @submit.prevent="submitComment" class="space-y-4">
          <!-- Name Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your name"
            />
          </div>
  
          <!-- Feedback Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Feedback</label>
            <textarea
              v-model="feedback"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                     focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your feedback about the event..."
            ></textarea>
          </div>
  
          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Upload Image (Optional)</label>
            <input
              @change="handleImageUpload"
              type="file"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
            />
            <div v-if="imagePreview" class="mt-2">
              <img :src="imagePreview" alt="Image Preview" class="h-32 object-cover rounded" />
            </div>
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md 
                   hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            {{ isLoading ? 'Submitting...' : 'Submit' }}
          </button>
  
          <!-- Error and Success Messages -->
          <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>
          <p v-if="successMessage" class="text-green-500 text-sm">{{ successMessage }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { useAuthStore } from '../store'
  import { supabase } from '../services/supabaseClient'
  
  export default {
    emits: ['close'],
    setup(props, { emit }) {
      const authStore = useAuthStore()
  
      const name = ref('')
      const feedback = ref('')
      const imageFile = ref(null)
      const imagePreview = ref(null)
      const isLoading = ref(false)
      const errorMessage = ref(null)
      const successMessage = ref(null)
  
      const handleImageUpload = (event) => {
        const file = event.target.files[0]
        if (file) {
          imageFile.value = file
          imagePreview.value = URL.createObjectURL(file)
        } else {
          imageFile.value = null
          imagePreview.value = null
        }
      }
  
      const uploadImage = async () => {
        if (!imageFile.value) return null
  
        const fileName = `${Date.now()}_${imageFile.value.name}`
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('avatars')
          .upload(fileName, imageFile.value, {
            cacheControl: '3600',
            upsert: false
          })
  
        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          return null
        }
  
        const { data: publicUrlData, error: urlError } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(fileName)
  
        console.log('Public URL check:', { publicUrlData, urlError })
  
        if (urlError) {
          console.error('Error getting public URL:', urlError)
          return null
        }
  
        const publicURL = publicUrlData.publicUrl
        if (!publicURL) {
          console.error('No public URL returned for image. Check if bucket is public and correct policies are set.')
          return null
        }
  
        console.log('Image uploaded successfully:', publicURL)
        return publicURL
      }
  
     const submitComment = async () => {
  if (!name.value || !feedback.value) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  isLoading.value = true
  errorMessage.value = null
  successMessage.value = null

  let imageURL = '/supabase-icon.svg' // Default image URL

  if (imageFile.value) {
    imageURL = await uploadImage()
    if (!imageURL) {
      errorMessage.value = 'Failed to upload image.'
      isLoading.value = false
      return
    }
  }

  try {
    console.log('Inserting post with:', {
      username: name.value,
      feedback: feedback.value,
      image_url: imageURL
    })

    // Ensure addPost returns { data, error } in the store
    const { data, error } = await authStore.addPost({
      username: name.value,
      feedback: feedback.value,
      image_url: imageURL || '/supabase-icon.svg' // Use default if no image
    })

    if (error) {
      console.error('Error adding post:', error)
      errorMessage.value = 'Failed to submit your comment. Please try again.'
      isLoading.value = false
      return
    }

    console.log('Post inserted successfully:', data)
    successMessage.value = 'Your feedback has been posted!'
    
    // Reset form
    name.value = ''
    feedback.value = ''
    imageFile.value = null
    imagePreview.value = null

    // Refresh posts after submission to update UI
    await authStore.fetchPosts()

    // Close modal after a short delay
    setTimeout(() => {
      emit('close')
    }, 1500)
  } catch (err) {
    console.error('Error submitting comment:', err)
    errorMessage.value = 'Failed to submit your comment. Please try again.'
  } finally {
    isLoading.value = false
  }
}
      const closeModal = () => {
        emit('close')
      }
  
      return {
        name,
        feedback,
        imageFile,
        imagePreview,
        isLoading,
        errorMessage,
        successMessage,
        submitComment,
        handleImageUpload,
        closeModal
      }
    }
  }
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>
  