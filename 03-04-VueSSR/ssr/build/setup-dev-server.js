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

module.exports = (server, callback) => {
  let ready, template, serverBundle, clientManifest

  const onReady = new Promise(r => ready = r)

  const update = () => {
    if (template && serverBundle && clientManifest) {
      ready()
      callback(serverBundle, template, clientManifest)
    }
  }

  // 监视构建 template
  template = fs.readFileSync(templatePath, 'utf-8')
  update()
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    update()
  })
  // 监视构建 serverBundle
  const serverCompiler = webpack(serverConfig)
  const serverDevMiddleware = devMiddleware(serverCompiler)
  serverCompiler.hooks.done.tap('server', () => {
    serverBundle = JSON.parse(serverDevMiddleware.context.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
    update()
  })
  // 监视构建 clientManifest
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  clientConfig.entry.app = [
    'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新一个客户端脚本
    clientConfig.entry.app
  ]
  const clientCompiler = webpack(clientConfig)
  const clientDevMiddleware = devMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    writeToDisk: true
  })
  clientCompiler.hooks.done.tap('server', () => {
    clientManifest = JSON.parse(clientDevMiddleware.context.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8'))
    update()
  })

  // clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
  // server.use(clientDevMiddleware)

  server.use(hotMiddleware(clientCompiler, {
    log: false // 关闭它本身的日志输出
  }))

  return onReady
}
