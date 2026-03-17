import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import { initLiff } from '@/liff.js'

initLiff()
  .then(() => {
    const app = createApp(App)
    app.mount('#app')
  })
  .catch((err) => {
    console.error('LIFF init failed:', err)
    const app = createApp(App)
    app.mount('#app')
  })
