import fs from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const isProduction = process.env.NODE_ENV === 'production'
const root = process.cwd()
const app = express()
let vite

if (!isProduction) {
  vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' })
  app.use(vite.middlewares)
} else {
  app.use(express.static(path.resolve(root, 'dist/client'), { index: false }))
}

app.use(/.*/, async (request, response, next) => {
  try {
    const url = request.originalUrl
    let template
    let render
    if (!isProduction) {
      template = await fs.readFile(path.resolve(root, 'index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.ts')).render
    } else {
      template = await fs.readFile(path.resolve(root, 'dist/client/index.html'), 'utf-8')
      render = (await import('../dist/server/entry-server.js')).render
    }
    const appHtml = await render(url)
    const html = template.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)
    response.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (error) {
    vite?.ssrFixStacktrace(error)
    next(error)
  }
})

app.listen(5173, () => console.log('SSR app running at http://localhost:5173'))