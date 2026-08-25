import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createApp } from './app'

export async function render() {
  return await renderToString(createSSRApp(createApp()))
}