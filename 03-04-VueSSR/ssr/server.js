const express = require('express')
const setupDevServer = require('./build/setup-dev-server')
const { createBundleRenderer } = require('vue-server-renderer')
const server = express()
server.use('/dist', express.static('./dist'))

const isProd = process.env.NODE_ENV === 'production'
let onReady, renderer
if (isProd) {
  const template = require('fs').readFileSync('./index.template.html', 'utf-8');
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  renderer  = createBundleRenderer(serverBundle, { template, clientManifest })
} else {
  onReady = setupDevServer(server, (serverBundle, template, clientManifest) => {
    renderer  = createBundleRenderer(serverBundle, { template, clientManifest })
  })
}

const render = async (req, res) => {
  // try {
    if (!isProd) {
      await onReady
    }
    const html = await renderer.renderToString({
      title: 'vue ssr',
      metas: `
          <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
          <meta name="keyword" content="vue,ssr">
          <meta name="description" content="vue srr demo">
      `,
      url: req.url,
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  // } catch (err) {
  //   res.status(500).end('Internal Server Error.')
  // }
}

server.get('*', render)

server.listen(8080)
