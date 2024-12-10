// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router' // Use a named import
import { createPinia } from 'pinia'
import './assets/tailwind.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

app.mount('#app')