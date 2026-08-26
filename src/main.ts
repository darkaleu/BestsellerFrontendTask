import { createSSRApp } from 'vue'
import { createApp } from './app'

const { App, router } = createApp()
const app = createSSRApp(App)

app.use(router)
app.mount('#app')
