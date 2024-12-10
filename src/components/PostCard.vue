<template>
  <div class="post-card flex items-start gap-4">
    <img :src="post.image_url" alt="User Avatar" class="w-20 h-20 rounded-full" />
    <div class="flex-1">
      <div class="flex items-center justify-between">
        <span class="font-semibold text-gray-800">{{ post.username }}</span>
        <span class="text-sm text-gray-500">{{ formattedDate }}</span>
      </div>
      <p class="mt-1 text-gray-700">{{ post.feedback }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.post.created_at);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-indexed
      const year = date.getFullYear();
      
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format

      return `${day}-${month}-${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    },
    avatarUrl() {
      // Placeholder avatar (avatar left, name/message/timestamp to right)
      return 'https://via.placeholder.com/40';
    }
  }
}
</script>

<style scoped>
.post-card {
  border: 1px solid #e5e7eb;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
}
</style>
