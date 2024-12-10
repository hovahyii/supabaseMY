import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../services/supabaseClient'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAdmin = ref(false)
  const posts = ref([])

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      posts.value = data
    }
  }

  // Add a new post to Supabase
  const addPost = async (newPost) => {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        username: newPost.username,
        feedback: newPost.feedback,
        image_url: newPost.image_url || null
      }])
      .select()

    if (error) {
      console.error('Error adding post:', error)
    } else {
      posts.value.unshift(data[0])
    }
    return { data, error }
  }

  // Update a post's feedback
  const updatePost = async (id, updates) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating post:', error)
    } else {
      const idx = posts.value.findIndex(p => p.id === id)
      if (idx !== -1) {
        posts.value[idx] = { ...posts.value[idx], ...data[0] }
      }
    }
    return { data, error }
  }

  // Delete a post from Supabase
  const deletePost = async (id) => {
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error deleting post:', error)
    } else {
      posts.value = posts.value.filter(p => p.id !== id)
    }
    return { data, error }
  }

  // Login function
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('Error logging in:', error)
      return { error }
    }
    const session = data.session
    user.value = session.user
    sessionStorage.setItem('supabase_session', JSON.stringify(session)) // Persist session in sessionStorage
    // Check if the logged-in user is an admin
    if (user.value.email === 'hovahyii@gmail.com') {
      isAdmin.value = true
    } else {
      isAdmin.value = false
    }
    return { data, error }
  }

  // Logout function to clear the session
  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    isAdmin.value = false
    sessionStorage.removeItem('supabase_session') // Remove session from sessionStorage
  }

  // Additional Supabase logout to ensure full session removal
  const logoutSupabase = async () => {
    await supabase.auth.signOut()
    sessionStorage.removeItem('supabase_session')
  }

  // Initialize session on page load or refresh
  const initializeSession = () => {
    const storedSession = sessionStorage.getItem('supabase_session')
    if (storedSession) {
      const parsedSession = JSON.parse(storedSession)
      user.value = parsedSession.user
      isAdmin.value = user.value.email === 'hovahyii@gmail.com'
    }
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      user.value = session.user
      isAdmin.value = user.value?.email === 'hovahyii@gmail.com'
      sessionStorage.setItem('supabase_session', JSON.stringify(session)) // Save new session
    } else {
      user.value = null
      isAdmin.value = false
      sessionStorage.removeItem('supabase_session') // Remove session on logout
    }
  })

  // Initialize session on store initialization
  initializeSession()

  // Fetch the unique users count from posts table
  const fetchUserCount = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('username')
  
    if (error) {
      console.error('Error fetching user count:', error)
    } else {
      // Count the number of unique usernames
      const uniqueUsers = new Set(data.map(post => post.username))
      return uniqueUsers.size
    }
  }
  

  // Fetch post count from posts table
  const fetchPostCount = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })  // Count all posts

    if (error) {
      console.error('Error fetching post count:', error)
    } else {
      return data.length  // The count of posts
    }
  }

  return {
    user,
    isAdmin,
    posts,
    fetchPosts,
    fetchUserCount,  // Expose the function to fetch user count
    fetchPostCount,  // Expose the function to fetch post count
    addPost,
    updatePost,
    deletePost,
    login,
    logout,
    logoutSupabase
  }
})
