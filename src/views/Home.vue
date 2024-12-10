<template>
  <div class="w-full min-h-screen flex flex-col bg-gradient-to-r from-green-400 to-blue-500">

    <!-- Header with Navbar -->
    <Navbar />

    <!-- Title Section -->
    <div class="text-center mt-16 mb-12 text-white">
      <h1 class="text-5xl font-extrabold mb-4">
        #1 Supabase MY Meetup
      </h1>
      <h2 class="text-3xl mb-4">
        Share your feedback and memories about the meetup
      </h2>
      <p class="text-lg">
        Supabase Meetup Kuala Lumpur<br />
        10 December 2024
      </p>
    </div>

    <!-- Countdown Timer -->
    <div v-if="!showAddCommentButton" class="text-center text-white mb-12">
      <p class="text-4xl">Event starts in: {{ countdown }}</p>
    </div>

    <!-- Displaying Posts with Add Comment Button after Countdown Ends -->
    <div v-if="showAddCommentButton">
      <div v-for="(row, rowIndex) in displayRows" :key="rowIndex" class="mt-12 mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-4">
          <template v-for="(item, colIndex) in row" :key="colIndex">
            <div v-if="item.type === 'addComment'" @click="openModal"
              class="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-8 rounded-lg shadow-lg hover:bg-green-700 cursor-pointer transition-all duration-300 transform hover:scale-105"
            >
              <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Comment
            </div>
            <PostCard v-else-if="item.type === 'post'" :post="item.post" />
            <div v-else class="bg-gray-100 h-0"></div>
          </template>
        </div>
      </div>
    </div>

    <!-- Comment Modal -->
    <CommentModal v-if="showModal" @close="closeModal" />

    <!-- Footer -->
    <Footer />

  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../store'
import PostCard from '../components/PostCard.vue'
import CommentModal from '../components/CommentModal.vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

export default {
  components: { PostCard, CommentModal, Navbar, Footer },
  setup() {
    const authStore = useAuthStore()
    const showModal = ref(false)
    const countdown = ref('')
    const showAddCommentButton = ref(false)

    // Set target date to 10th December 2024 at 6 PM
    const targetDate = new Date('2024-12-11T18:00:00'); // Set to 10th December 2024 at 6 PM

    // Countdown logic
    const updateCountdown = () => {
      const now = new Date()
      const timeLeft = targetDate - now
      if (timeLeft <= 0) {
        showAddCommentButton.value = true
        countdown.value = ''
      } else {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60)) % 24
        const minutes = Math.floor(timeLeft / (1000 * 60)) % 60
        const seconds = Math.floor(timeLeft / 1000) % 60
        countdown.value = `${hours}h ${minutes}m ${seconds}s`
      }
    }

    onMounted(() => {
      // Fetch posts from the store
      authStore.fetchPosts()
      
      // Update countdown every second
      setInterval(updateCountdown, 1000)
    })

    const openModal = () => {
      showModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
      showModal.value = false
      document.body.style.overflow = 'auto'
    }

    const displayRows = computed(() => {
      const rows = []
      const arr = authStore.posts

      if (!arr || arr.length === 0) {
        rows.push([{ type: 'addComment' }, { type: 'empty' }, { type: 'empty' }])
      } else {
        const firstRow = [{ type: 'addComment' }]
        if (arr[0]) firstRow.push({ type: 'post', post: arr[0] })
        if (arr[1]) firstRow.push({ type: 'post', post: arr[1] })
        while (firstRow.length < 3) firstRow.push({ type: 'empty' })
        rows.push(firstRow)

        const remainingPosts = arr.slice(2)
        for (let i = 0; i < remainingPosts.length; i += 3) {
          const chunk = remainingPosts.slice(i, i + 3).map(p => ({ type: 'post', post: p }))
          while (chunk.length < 3) chunk.push({ type: 'empty' })
          rows.push(chunk)
        }
      }

      return rows
    })

    return {
      authStore,
      showModal,
      openModal,
      closeModal,
      displayRows,
      countdown,
      showAddCommentButton
    }
  }
}
</script>

<style scoped>
/* Global Style Changes */
body {
  font-family: 'Inter', sans-serif;
  background-color: #f7fafc; /* light gray for consistency */
  overflow-x: hidden; /* Ensures no horizontal overflow */
}

.grid {
  gap: 1.5rem;
}

/* Style for the "Add Comment" button */
.bg-gradient-to-r {
  transition: all 0.3s ease-in-out;
}

h1, h2 {
  font-weight: 900;
}

h1 {
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
}

h2 {
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
}

</style>
