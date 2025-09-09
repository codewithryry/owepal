import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)
app.use(router)
app.mount('#app')

// ✅ Auto-handled Service Worker
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('A new version is available. Reload?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('OwePal is ready to work offline ✅')
  },
})
