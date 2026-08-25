import { createSSRApp } from 'vue'
import { createApp } from './app'

createSSRApp(createApp()).mount('#app')
