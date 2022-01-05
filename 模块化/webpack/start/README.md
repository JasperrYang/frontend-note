# webpack

webpack 就是一个前端资源打包工具，它根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应静态资源。

## 基本使用

在本地安装 webpack

```js
yarn add webpack webpack-cli --dev
```

[文件目录](https://github.com/29984608/frontend-study-note/tree/main/02-02-%E6%A8%A1%E5%9D%97%E5%8C%96/webpack%20%E6%89%93%E5%8C%85/start)，创建 `webpack.config.js` 配置文件（在 webpack v4 中，可以无须任何配置，然而大多数项目会需要很复杂的设置）。

```js
const path = require("path");

module.exports = {
  /**
   * 默认值为 production
   * development 优化打包速度，添加一些调试过程需要的辅助
   * production 优化打包结果
   **/
  mode: "development",
  entry: "./src/main.js", // 入口文件
  output: {
    filename: "bundle.js", // 输出文件名
    path: path.join(__dirname, "dist"), // 输出文件路径
  },
};
```

运行打包命令

```js
yarn webpack
```

## 资源模块加载

Webpack 默认只能处理 js 文件，非 js 文件通过 loader 加载处理

### 文件资源

安装文件资源对应 loader

```js
yarn add css-loader style-loader --dev
```

文件引入

```js
// main.js

import createHeading from "./heading.js";
import "./main.css";

const heading = createHeading();

document.body.append(heading);
```

webpack 配置文件

通过`css-loader`完成对 css 文件的处理，还需要`style-loader`将打包后的 css 文件引入页面

**注意：loader 的记载机制是从后往前，所以数组中 css loader 在后先使用，style loader 在后，后使用**

```js
const path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

### 图片资源

由于 `index.html` 没有生成到 `dist` 目录，而是放在项目的根目录下，所以把项目根目录作为网站根目录，而 webpack 会默认认为所有打包结果都放在网站的根目录下面，导致在根目录下查找图片资源。解决方法配置 `publicPath: 'dist/'`。

webpack 打包时遇到图片文件，根据配置文件配置，匹配到文件加载器，文件加载器开始工作，先将导入的文件 copy 到输出目录，然后将文件 copy 到输出目录过后的路径，作为当前模块的返回值返回,这样资源就被发布出来了。

安装图片资源对应 loader

```js
yarn add file-loader --dev
```

文件引入

```js
import createHeading from "./heading.js";
import "./main.css";
import icon from "./icon.png";

const heading = createHeading();

document.body.append(heading);

const img = new Image();
img.src = icon;
document.body.append(img);
```

webpack 配置文件

```js
const path = require("path");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: "dist/",
  },
  module: {
    rules: [
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.png$/,
        use: "file-loader",
      },
    ],
  },
};
```

### URL 资源

`data urls` 是特殊的 `url` 协议，可以用来直接表示一个文件，传统 `url` 要求服务器有一个对应文件，然后我们通过请求这个地址得到这个对应文件。 而 `data url` 是一种当前 `url` 就可以直接表示文件内容的方式，这种 `url` 中的文本包含文件内容，使用时不会发送任何 http 请求。

html 内容： `data:text/html;charset=UTF-8,<h1>xxx</h1> `

png 类型文件：`data:image/png;base64,iVBORw0KGgoAAAANSUhE... `

安装资源对应 loader

```js
yarn add url-loader --dev
```

webpack 配置文件

```js
  ...
  module: {
    rules: [
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.png$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024, // 对于小于10kb的图片资源使用 url-loader, 大于则使用 file-loader
          },
        },
      },
    ],
  },
```

### 常用加载器分类

- 编译转换类
- 文件操作类
- 代码检查类

### webpack 与 es2015

webpack 因为模块打包需要，所以处理了 import 和 export，但是并不能转化代码中其他的 es6 特性

安装资源对应 loader

```js
yarn add babel-loader @babel/core @babel/preset-env --dev
```

```js
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.png$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024, // 对于小于10kb的图片资源使用 url-loader, 大于则使用 file-loader
          },
        },
      },
    ],
  },
```

### 模块加载方式

模块加载的方式有遵循 ES Modules 标准的 `import` 声明，遵循 CommonJS 标准的 `require` 函数，遵循 AMD 标准的 `define` 函数和 `require` 函数

除了上面方式，触发模块加载方式还有 css 样式代码中的 `url` 函数和 `@import` 指令，html 代码中图片标签的 `src` 属性

html 中的 `src` 属性触发模块加载

```js
yarn add html-loader --dev
```

```js
{
  test:/.html$/,
  use:{
    loader:'html-loader'
  }
}
```

但是 html-loader 只能处理 html 下 img:src 属性，其他额外属性通过 attrs 配置

```js
{
  test:/.html$/,
  use:{
    loader:'html-loader', //默认只能处理html img src属性，其他额外属性通过attrs配置
    options:{
      attrs:['img:src','a:href']
    }
  }
}
```

### 开发一个 loader

webpack 加载资源过程类似于工作管道，可以在加载过程中依次使用多个 loader，但是最终结果必须是 js 代码。

每个 webpack loader 都需要导出一个函数，输入就是加载到的资源文件的内容，输出就是此次加工过后的结果。

```js
const marked = require("marked");

module.exports = (source) => {
  const html = marked(source);
  return html;
};
```

```js
module: {
  rules: [
    {
      test: /.md$/,
      use: [
        "html-loader",
        "./md-loader", //模块名称或文件路径，类似nodejs的require
      ],
    },
  ];
}
```

## 插件机制

loader 专注实现资源模块加载，plugin 解决其他自动化工作，增强 webpack 自动化能力

### 自动清除目录插件

安装扩展包

```js
yarn add clean-webpack-plugin --dev
```

```js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: "dist/",
  },
  module: {
    rules: [
      ...
    ],
  },
  plugins: [new CleanWebpackPlugin()],
};
```

### 自动生成 HTML

安装扩展包

```js
yarn add html-webpack-plugin --dev
```

dist 下生成 html，解决以前根下 html 中的引入路径需要通过 publicpath 声明硬编码的问题。

```js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    // publicPath: "dist/",
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin()],
};
```

#### 自定义元数据

```js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack plugin sample",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
    }),
  ],
};
```

模板文件

```html
<!--./src/index.html-->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Webpack</title>
  </head>
  <body>
    <div class="container">
      <!-- 访问插件配置数据 -->
      <h1><%= htmlWebpackPlugin.options.title %></h1>
    </div>
  </body>
</html>
```

#### 同时输出多个页面文件

```js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "webpack plugin sample",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "about.html",
    }),
  ],
};
```

### 静态文件拷贝插件

```js
yarn add copy-webpack-plugin --dev
```

```js
const CopyWebpackPlugin = require("copy-webpack-plugin");

plugins: [
  //参数数组，指定拷贝的文件路径（通配符，目录，相对路径）
  new CopyWebpackPlugin({
    patterns: ["public"],
  }),
];
```

### 插件机制工作原理

webpack plugin 是通过钩子机制实现。

钩子机制类似于 web 中的事件。在 webpack 工作过程中会有很多环节，为了便于插件的扩展，webpack 几乎给每一个环节都埋下了钩子，这样我们在开发插件时，可以通过往这些不同的节点上去挂载不同任务，就可以轻松扩展 webpack 的能力。

### 开发一个插件

webpack 要求插件必须是一个函数或者是一个包含 apply 方法的对象，一般我们都会把插件定义为一个类型，然后再这个类型中定义一个 apply 方法

定义一个插件往钩子上挂载任务，这个插件用于清除 bundle.js 中无用的注释

MyPlugin 文件

```js
module.exports = class MyPlugin {
  apply(compiler) {
    // 此方法在webpack启动时自动被调用，compile配置对象，配置信息

    console.log("MyPlugin 启动");

    // 通过hooks属性访问钩子emit
    // 参考：https://webpack.docschina.org/api/compiler-hooks/
    // tap方法注册钩子函数(参数1:插件名称，参数2:挂载到钩子上的函数)

    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation 可以理解为此次打包的上下文,所有打包过程产生的结果都会放到这个对象中
      // compilation.assets属性是个对象，用于获取即将写入目录当中的资源文件信息

      for (const name in compilation.assets) {
        // console.log("文件名称:",name); 如图
        // console.log("文件内容:",compilation.assets[name].source());

        if (name.endsWith(".js")) {
          //获取内容
          const contents = compilation.assets[name].source();

          //替换内容
          const withoutComments = contents.replace(/\/\*\*+\*\//g, "");

          //覆盖老内容
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length, //返回内容的大小，webpack要求必须加
          };
        }
      }
    });
  }
};
```

配置文件

```js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const myPlugin = require("./MyPlugin.js");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    // publicPath: "dist/",
  },

  plugins: [new CleanWebpackPlugin(), new myPlugin()],
};
```
