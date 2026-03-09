import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/useAuthStore'

import './assets/css/main.css'
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// هێنانەوەی داتای login لە localStorage (token/role)
const auth = useAuthStore()
auth.hydrate()

app.mount('#app')
