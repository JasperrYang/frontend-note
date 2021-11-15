const Vue = require('vue')
const express = require('express')
const template = require('fs').readFileSync('./index.template.html', 'utf-8');

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer  = require('vue-server-renderer').createBundleRenderer(serverBundle, { template, clientManifest })

const server = express()
server.use('/dist', express.static('./dist'))

const context = {
  title: 'vue ssr',
  metas: `
      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
      <meta name="keyword" content="vue,ssr">
      <meta name="description" content="vue srr demo">
  `,
};

server.get('/', (req, res) => {
  renderer.renderToString(context, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(html)
  })
})

server.listen(8080)
