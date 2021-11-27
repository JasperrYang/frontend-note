# Vue 服务端渲染

## 什么是服务器端渲染 (SSR)？

Vue.js 是构建客户端应用程序的框架。但是可以将组件在服务器端渲染为 HTML 字符串，将它们直接发送到浏览器，最后将这些静态标记"激活"为客户端上完全可交互的应用程序。

## 为什么使用服务器端渲染 (SSR)？

- 更好的 SEO，由于搜索引擎爬虫抓取工具可以直接查看完全渲染的页面。
- 更快的响应时间，无需等待 JavaScript 加载

## 权衡？

- 开发条件所限
- 涉及构建设置和部署的更多要求
- 更多的服务器端负载

## 基本使用

### 安装

```js
npm install vue vue-server-renderer --S
```

### 渲染

```js
const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')

const app = new Vue({
  template: `<div>Hello World</div>`
})

createRenderer().renderToString(app, (err, html) => {
  console.log(html);
})
```

### 集成服务器

安装 [Express](https://expressjs.com/)

```js
npm install express --save
```

```js
const Vue = require('vue')
const { createRenderer } = require('vue-server-renderer')
const express = require('express')
const server = express()

const app = new Vue({
  template: `<div>Hello 小王</div>`
})

server.get('/', (req, res) => {
  createRenderer().renderToString(app, (err, html) => {
    res.end(html)
  })
})

server.listen('3000')
```

### 使用页面模板

在上面的案例中我们会发现中文显示乱码，原因是因为编译后的 HTML 文件缺少编码等说明
![image.png](https://upload-images.jianshu.io/upload_images/6010417-56d208b05a4ccaa6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

在这个示例中，我们必须用一个额外的 HTML 页面包裹容器，来包裹生成的 HTML 标记，为了简化这些，你可以直接在创建 renderer 时提供一个页面模板。我们会将页面模板放在特有的文件中，例如 `index.template.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta charset="utf-8" />
     <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
    <title>{{ title }}</title>
    <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

注意 `<!--vue-ssr-outlet-->` 注释，这里将是应用程序 HTML 标记注入的地方。

**模板插值**：我们可以通过传入一个"渲染上下文对象"，作为 renderToString 函数的第二个参数，来提供插值数据

```js
const Vue = require('vue')
const fs = require('fs')
const { createRenderer } = require('vue-server-renderer')
const express = require('express')
const server = express()

const app = new Vue({
  template: `<div>Hello 小王</div>`
})

const context = {
  title: 'hello'
}

const renderer = createRenderer({
  template: fs.readFileSync('./index.template.html', 'utf-8')
})

server.get('/', (req, res) => {
  renderer.renderToString(app, context ,(err, html) => {
    res.end(html)
  })
})

server.listen('3000')
```

## 通用模板

### 使用 webpack 的源码结构

我们需要使用 webpack 来打包我们的 Vue 应用程序，因为

- 通常 Vue 应用程序是由 webpack 和 vue-loader 构建，并且许多 webpack 特定功能不能直接在 Node.js 中运行
- 尽管 Node.js 最新版本能够完全支持 ES2015 特性，我们还是需要转译客户端代码以适应老版浏览器。

所以对于客户端应用程序和服务器应用程序，我们都要使用 webpack 打包，服务器需要「服务器 bundle」然后用于服务器端渲染(SSR)，而「客户端 bundle」会发送给浏览器，用于混合静态标记。

![image.png](https://upload-images.jianshu.io/upload_images/6010417-0bd46542901f3118.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

一个基本的项目

```txt
build # webpack 构建文件
├── setup-dev-server.js # develop 模式下 render 文件
├── webpack.base.config.js # 通用打包配置文件
├── webpack.client.config.js # 客户端打包配置文件
└── webpack.server.config.js # 服务端打包配置文件
src
├── pages
│   ├── Foo.vue
│   ├── Bar.vue
│   └── Baz.vue
├── App.vue
├── app.js # 通用 entry(universal entry)
├── entry-client.js # 仅运行于浏览器
└── entry-server.js # 仅运行于服务器
└── server.js # 启动文件
```

### 入口文件

- app.js：是我们应用程序的「通用 entry」。在纯客户端应用程序中，我们将在此文件中创建根 Vue 实例，并直接挂载到 DOM。但是，对于服务器端渲染(SSR)，责任转移到纯客户端 entry 文件。app.js 简单地使用 export 导出一个 createApp 函数：

```js
import Vue from 'vue'
import App from './App.vue'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp () {
  const app = new Vue({
    // 根实例简单的渲染应用程序组件。
    render: h => h(App)
  })
  return { app }
}
```

- entry-client.js：客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中

```js
import { createApp } from './app'

// 客户端特定引导逻辑……

const { app } = createApp()

// 这里假定 App.vue 模板中根元素具有 `id="app"`
app.$mount('#app')
```

- entry-server.js：服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。此时，除了创建和返回应用程序实例之外，它不会做太多事情。但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。

```js
import { createApp } from './app'

export default context => {
  const { app } = createApp()
  return app
}
```

### webpack 构建配置

- webpack.base.config.js：通用 webpack 打包配置文件，定义打包模式和出口文件路径，假猪 loader 打包各类文件，使用了 vueLoaderPlugin

```js
const path = require('path')
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const resolve = file => path.resolve(__dirname, file)

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    path: resolve('../dist'),
    publicPath: '/dist',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      '@': resolve('../src')
    },
    extensions: ['.js','.vue','.json']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
            limit: 8192,
            },
          }
        ]
      },
      // 处理字体资源
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
      // 处理 .vue 资源
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
    ]
  },
  plugins: [
    new vueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ]
}
```

- webpack.client.config.js：客户端 webpack 打包配置文件，定义客户端打包入口，ES6 的语法转换，使用了 VueSSRClientPlugin

```js
/**
 * 客户端打包配置
 */
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(baseConfig, {
  entry: {
    app: './src/entry-client.js',
  },
  module: {
    rules: [
      // ES6 转 ES5
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            cacheDirectory: true,
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
  // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
  // 以便可以在之后正确注入异步 chunk。
  optimization: {
    splitChunks: {
      name: 'manifest',
      minChunks: Infinity,
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
  ],
});
```

- webpack.server.config.js：服务端 webpack 打包配置文件，定义服务端打包入口，告知 `vue-loader` 输送面向服务器代码，使用了 VueSSRClientPlugin

```js
/**
 * 服务端打包配置
 */
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.config.js');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: './src/entry-server.js',
  // 这允许 webpack 以 Node 适用方式处理模块加载
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',
  output: {
    filename: 'server-bundle.js',
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    libraryTarget: 'commonjs2',
  },
  // 不打包 node_modules 第三方包，而是保留 require 方式直接加载
  externals: [
    nodeExternals({
      // 白名单中的资源依然正常打包
      allowlist: [/\.css$/],
    }),
  ],
  plugins: [
    // 这是将服务器的整个输出构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    new VueSSRServerPlugin(),
  ],
});
```

### 启动应用

安装开发依赖

| 包 | 说明 |
| - | - |
| webpack webpack-cli | webpack 核心包 |
| webpack-merge |webpack 配置信息合并工具 |
| webpack-node-externals | 排除 webpack 中的 Node 模块 |
| friendly-errors-webpack-plugin | 友好的 webpack 错误提示 |
| @babel/core  @babel/plugin-transform-runtime @babel/preset-env babel-loader | Babel 相关工具 |
| vue-loader vue-template-compiler | 处理 .vue 资源 |
| file-loader css-loader url-loader | 处理资源文件 |
| cross-env | 通过 npm scripts 设置跨平台环境变量 |

修改启动文件 server.js

```js
const express = require('express')
const { createBundleRenderer } = require('vue-server-renderer')
const server = express()
server.use('/dist', express.static('./dist'))

const template = require('fs').readFileSync('./index.template.html', 'utf-8');
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
renderer  = createBundleRenderer(serverBundle, { template, clientManifest })

const render = async (req, res) => {
  try {
    const html = await renderer.renderToString({
      title: '',
      meta: `
          <meta name="description" content="vue srr demo">
      `,
      url: req.url,
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  } catch (err) {
    res.status(500).end('Internal Server Error.')
  }
}

server.get('*', render)

server.listen(8080)
```

执行费打包命令

```js
npm run build:client

npm run build:server
```

打包成功后我即可在 dist 文件下看到打包后的结果，运行 server.js 文件可以查看页面

### production 与 develop 环境分离

上面虽然我们已经可以成功的运行，但其中还存在一些问题

- 每次写完代码，都要重新打包构建
- 重新启动 Web 服务

所以下面我们来实现项目中的开发模式构建，也就是我们希望能够实现：

- 写完代码，自动构建
- 自动重启 Web 服务
- 自动刷新页面内容

#### 思路

node 命令中使用 cross-env 携带 NODE_ENV 变量，区分执行的环境

- 生产模式
    - npm run build 构建
    - node server.js 启动
- 开发模式：
    - 监视代码变动，热更新

在 package.json 文件中加入命令脚本

```json
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "start": "cross-env NODE_ENV=production node server.js",
    "dev": "node server.js"
  },
```

安装扩展包

| 包 | 说明 |
| - | - |
| chokidar | 监听本地文件的改动 |
| webpack-dev-middlewar | 中间件 |
| webpack-hot-middleware | 热更新 |

修改启动脚本，生产环境下直接使用打包好的文件，开发环境下需要等待 renderer 函数的生成

```js
const express = require('express')
const setupDevServer = require('./build/setup-dev-server')
const { createBundleRenderer } = require('vue-server-renderer')
const server = express()
server.use('/dist', express.static('./dist'))

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
    })
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end(html)
  } catch (err) {
    res.status(500).end('Internal Server Error.')
  }
}

server.get('*', render)

server.listen(8080)
```

开发环境下 setup-dev-server.js 生成 renderer 函数

```js
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
  })
  clientCompiler.hooks.done.tap('client', () => {
    clientManifest = JSON.parse(clientDevMiddleware.context.outputFileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8'))
    update()
  })

  // clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
  server.use(clientDevMiddleware)

  server.use(hotMiddleware(clientCompiler, {
    log: false // 关闭它本身的日志输出
  }))

  return onReady
}
```

## 路由管理

安装 `vue-router` 创建 router.js 文件

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/Home'

Vue.use(VueRouter)

export const createRouter = () => {
  const router = new VueRouter({
    mode: 'history', // 兼容前后端
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/pages/About')
      },
      {
        path: '/posts',
        name: 'post-list',
        component: () => import('@/pages/Posts')
      },
      {
        path: '*',
        name: 'error',
        component: () => import('@/pages/404')
      }
    ]
  })

  return router
}
```

更新 app.js

```js
/**
 * 通用入口
 */
 import Vue from 'vue'
 import App from './App.vue'
 import { createRouter } from './router'

 Vue.use(VueMeta)

 // 导出一个工厂函数，用于创建新的
 // 应用程序、router 和 store 实例
 export function createApp () {
  const router = createRouter()
   const app = new Vue({
    router,
    render: h => h(App)
   })
   return { app, router }
 }
```

在 entry-server.js 中实现服务器端路由逻辑

```js
/**
 * 服务端
 */
 import { createApp } from './app'

 export default async context => {
   const { app, router } = createApp()
   router.push(context.url)
   await new Promise(router.onReady.bind(router))
   return app
 }
```

在 entry-client.js 中实现客户器端路由逻辑

```js
/**
 * 客户端
 */
 import { createApp } from './app'

 // 客户端特定引导逻辑……

 const { app, router } = createApp()

  // 这里假定 App.vue 模板中根元素具有 `id="app"`
  router.onReady(() => {
    app.$mount('#app')
  })
```

修改 App.vue 文件

```js
<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <div><input type="" v-model="message"></div>
    <button @click="onClick">onClick</button>
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li>
        <router-link to="/posts">Posts</router-link>
      </li>
    </ul>

    <!-- 路由出口 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      message: 'vue-ssr'
    }
  },
  methods: {
    onClick () {
      console.log('Hello World!')
    }
  }
}
</script>
```

启动成功，访问页面我们会发现除了 app 主资源外，其它的资源也被下载下来了，但我们的路由配置是动态引入，也就是当我们访问时才应该加载，而这里却是一上来就加载了。

**原因是在页面的头部中的带有 preload 和 prefetch 的 link 标签**。

我们期望客户端 JavaScript 脚本尽快加载尽早的接管服务端渲染的内容，让其拥有动态交互能力，但是
如果你把 script 标签放到这里的话，浏览器会去下载它，然后执行里面的代码，这个过程会阻塞页面的
渲染。

所以看到真正的 script 标签是在页面的底部的。而这里只是告诉浏览器可以去预加载这个资源。但是不
要执行里面的代码，也不要影响网页的正常渲染。直到遇到真正的 script 标签加载该资源的时候才会去
执行里面的代码，这个时候可能已经预加载好了，直接使用就可以了，如果没有加载好，也不会造成重
复加载，所以不用担心这个问题。

而 prefetch 资源是加载下一个页面可能用到的资源，浏览器会在空闲的时候对其进行加载，所以它并
不一定会把资源加载出来，而 preload 一定会预加载。所以你可以看到当我们去访问 about 页面的时
候，它的资源是通过 prefetch 预取过来的，提高了客户端页面导航的响应速度。

## 管理页面 Head

页面中的 body 是动态渲染出来的，但是页面的 head 是写死的，使用 [vue-meta](https://github.com/nuxt/vue-meta)

Vue Meta 是一个支持 SSR 的第三方 Vue.js 插件，可让你轻松的实现不同页面的 head 内容管理。

```js
<template>
...
</template>
<script>
 export default {
    metaInfo: {
        title: 'My Example App',
        titleTemplate: '%s - Yay!',
        htmlAttrs: { lang: 'en', amp: true }
        }
    }
</script>
```

安装 `npm i vue-meta -S`

在通用入口 app.js 中通过插件的方式将 vue-meta 注册到 Vue 中。

```js
 import VueMeta from 'vue-meta'

 Vue.use(VueMeta)

 Vue.mixin({
   metaInfo: {
     titleTemplate: '%s - vue-ssr'
   }
 })
```

然后在服务端渲染 entry-server.js 文件中适配 vue-meta：

```js
/**
 * 服务端
 */
 import { createApp } from './app'

 export default async context => {
   const { app, router } = createApp()
   const meta = app.$meta()
   router.push(context.url)
   context.meta = meta
   await new Promise(router.onReady.bind(router))

   return app
 }
```

最后在模板页面 index.template.html 中注入 meta 信息

```html
<head>
  {{{ meta.inject().meta.text() }}}
  {{{ meta.inject().title.text() }}}
</head>
```

## 数据预取

假设需求为渲染文章列表

- 服务端渲染：在服务端的情况下，这个需求很简单，无非是发送请求拿到数据渲染
- 客户端渲染：在客户端会有以下问题
    - 只支持 beforeCreate 和 created 生命周期
    - 不会等待 beforeCreate 和 created 生命周期中的异步操作
    - 不支持响应式数据，也就是说拿到数据也无法动态渲染到页面

官方文档给出的解决办法的核心思路就是把在服务端渲染期间获取的数据存储到 Vuex 容器中，
然后把容器中的数据同步到客户端，这样就保持了前后端渲染的数据状态同步，避免了客户端重新渲染
的问题。

安装 Vuex ：`npm i vuex`

创建 Vuex 容器 store/index.js

```js
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      posts: []
    }),

    mutations: {
      setPosts (state, data) {
        state.posts = data
      }
    },

    actions: {
      // 在服务端渲染期间务必让 action 返回一个 Promise
      async getPosts ({ commit }) {
        // return new Promise()
        const { data } = await axios.get('https://cnodejs.org/api/v1/topics')
        commit('setPosts', data.data)
      }
    }
  })
}
```

在通用应用入口中将 Vuex 容器挂载到 Vue 根实例

```js
/**
 * 通用入口
 */
 import Vue from 'vue'
 import App from './App.vue'
 import { createRouter } from './router'
 import { createStore } from './store'
 import VueMeta from 'vue-meta'

 Vue.use(VueMeta)

 Vue.mixin({
   metaInfo: {
     titleTemplate: '%s - vue-ssr'
   }
 })

 // 导出一个工厂函数，用于创建新的
 // 应用程序、router 和 store 实例
 export function createApp () {
  const router = createRouter()
  const store = createStore()
   const app = new Vue({
    router,
    store,
    render: h => h(App)
   })
   return { app, router, store }
 }
```

在服务端渲染应用入口中将容器状态序列化到页面中，从而避免
两个端状态不一致导致客户端重新渲染的问题。

- 将容器中的 state 转为 JSON 格式字符串
- 生成代码： `window.__INITIAL__STATE = store` 语句插入模板页面中
- 客户端通过 `window.__INITIAL__STATE` 获取该数据

entry-server.js

```js
   context.rendered = () => {
    // Renderer 会把 context.state 数据对象内联到页面模板中
    // 最终发送给客户端的页面中会包含一段脚本：window.__INITIAL_STATE__ = context.state
    // 客户端就要把页面中的 window.__INITIAL_STATE__ 拿出来填充到客户端 store 容器中
    context.state = store.state
  }
```

entry-client.js 在客户端渲染入口中把服务端传递过来的状态数据填充到客户端 Vuex 容器中

```js
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
```

## 页面缓存

虽然 Vue 的服务器端渲染 (SSR) 相当快速，但是由于创建组件实例和虚拟 DOM 节点的开销，无法与纯基于字符串拼接的模板的性能相当。在 SSR 性能至关重要的情况下，明智地利用缓存策略，可以极大改善响应时间并减少服务器负载。

### 页面级别缓存

可以利用名为 micro-caching 的缓存策略，来大幅度提高应用程序处理高流量的能力。但并非所有页面都适合应用 micro-caching 缓存策略，我们可以将资源分为三类：

- 静态资源：如 js 、 css 、 images 等
- 用户特定的动态资源：不同的用户访问相同的资源会得到不同的内容。
- 用户无关的动态资源：任何用户访问该资源都会得到相同的内容，但该内容可能在任意时间发生变
化，如博客文章

安装依赖

```js
npm i lru-cache -S
```

server.js

```js
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
```

### 组件级别缓存

vue-server-renderer 内置支持组件级别缓存。要启用组件级别缓存，需要在创建 renderer 时提供具体缓存实现方式。

```js
const LRU = require('lru-cache')

const renderer = createRenderer({
  cache: LRU({
    max: 10000,
    maxAge: ...
  })
})
```

然后，你可以通过实现 serverCacheKey 函数来缓存组件。

```js
export default {
  name: 'item', // 必填选项
  props: ['item'],
  serverCacheKey: props => props.item.id,
  render (h) {
    return h('div', this.item.id)
  }
}
```
