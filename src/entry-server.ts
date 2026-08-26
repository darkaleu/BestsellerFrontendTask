import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createApp } from './app'

export async function render(url: string) {
  const { App, router } = createApp()
  const app = createSSRApp(App)

  app.use(router)
  await router.push(url)
  await router.isReady()

  return await renderToString(app)
}