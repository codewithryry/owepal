import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
// main.js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Create Vue app

const app = createApp(App)

// Use router
app.use(router)

// Mount to DOM
app.mount('#app')

// Register Service Worker (PWA support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        console.log('✅ Service Worker registered:', reg)
      })
      .catch((err) => {
        console.error('❌ Service Worker registration failed:', err)
      })
  })
}
