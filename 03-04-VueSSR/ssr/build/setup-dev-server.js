const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const serverConfig = require('./webpack.server.config')
const clientConfig = require('./webpack.client.config')


const resolve = file => path.resolve(__dirname, file)
const templatePath = path.resolve(__dirname, '../index.template.html')

module.exports = async (server, callback) => {
  let ready, template, serverBundle, clientManifest

  const onReady = new Promise(r => ready = r)

  const update = () => {
    // if (template && serverBundle && clientManifest) {
      // ready()
      // callback(serverBundle, template, clientManifest)
    // }
  }

  // 监视构建 template
  template = fs.readFileSync(templatePath, 'utf-8')
  update()
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    update()
  })
  // 监视构建 serverBundle
  // const serverCompiler =
  const serverCompiler = webpack(serverConfig)
  const serverDevMiddleware = devMiddleware(serverCompiler)
  console.log(serverDevMiddleware);
  console.log(serverDevMiddleware.outputFileSystem);
  console.log(serverDevMiddleware.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'));
  // serverCompiler.hooks.done.tap('server', () => {
  //   // serverBundle = JSON.parse(serverDevMiddleware.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
  //   // console.log(serverBundle);
  //   update()
  // })
  // 监视构建 clientManifest
  // const clientCompiler = webpack(clientConfig)

  return onReady
}
