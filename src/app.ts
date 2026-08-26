import './style.css'
import App from './App.vue'
import { createAppRouter } from './router'

export function createApp() {
  return { App, router: createAppRouter() }
}