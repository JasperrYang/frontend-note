const express = require('express')
const setupDevServer = require('./build/setup-dev-server')
const { createBundleRenderer } = require('vue-server-renderer')
const LRU = require('lru-cache')
const server = express()
server.use('/dist', express.static('./dist'))

const cache = new LRU({
  max: 100,
  maxAge: 10000 // Important: entries expires after 1 second.
})

const isCacheable = req =>
{
  console.log(req.url)
  if (req.url === '/posts') {
    return true
  }
}

const isProd = process.env.NODE_ENV === 'production'
let onReady, renderer
if (isProd) {
  // 生产模式，直接基于已构建好的包创建渲染器
  const template = require('fs').readFileSync('./index.template.html', 'utf-8');
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer  = createBundleRenderer(serverBundle, { template, clientManifest })
} else {
  // 开发模式 打包构建（客户端 + 服务端） -> 创建渲染器
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer  = createBundleRenderer(serverBundle, { template, clientManifest })
  })
}

const render = async (req, res) => {
  try {
    const cacheable = isCacheable(req)
    if (cacheable) {
      const html = cache.get(req.url)
      if (html) {
        return res.end(html)
      }
    }
    if (!isProd) {
      await onReady
    }
    /**
     * 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
     * bundle renderer 在调用 renderToString 时，它将自动执行「由 bundle 创建的应用程序实例」所导出的函数（传入上下文作为参数），然后渲染它。
     */
    const html = await renderer.renderToString({
      title: '',
      meta: `
          <meta name="description" content="vue srr demo">
      `,
      url: req.url,
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
    if (cacheable) { cache.set(req.url, html) }
  } catch (err) {
    res.status(500).end('Internal Server Error.')
  }
}

server.get('*', render)

server.listen(8080)
