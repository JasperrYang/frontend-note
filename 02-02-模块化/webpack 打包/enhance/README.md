# Webpack 优化开发体验

## Webpack Dev Server

集成了 自动编译 和 自动刷新浏览器 等功能。webpack-dev-server 在编译之后不会写入到任何输出文件，而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中。

```js
yarn add webpack-dev-server --dev
```

```js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
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
      {
        test: /.png$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Ideal Webpack Develop Env",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
    }),
    // 开发阶段最好不要使用这个插件，频繁复制静态资源文件
    // new CopyWebpackPlugin({
    //   patterns: ["public"],
    // }),
  ],
  devServer: {
    // 指定额外静态资源文件路径
    contentBase: ["./public"],
    proxy: {
      "/api": {
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: "https://api.github.com",
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
```

```
yarn webpack serve --open
```

## Source Map

Source map 就是一个信息文件，里面储存着位置信息。也就是说，转换后的代码的每一个位置，所对应的转换前的位置。

有了它，出错的时候，除错工具将直接显示原始代码，而不是转换后的代码。这无疑给开发者带来了很大方便。

启用 Source map 只需要在转换后的代码尾部加上 `//# sourceMappingURL=/path/to/file.js.map`

### Webpack 中的 source map

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  devtool: "source-map",
};
```

常用模式：

- `eval`：只能定位文件，没有生成 source map 文件，构建速度快，不能知道行列信息
- `eval-source-map`：可以定位文件和行列信息
- `eval-cheap-source-map`：只能定位到行信息，代码经过 loader 转化
- `eval-cheap-module-source-map`：开发环境的源代码

## HMR(Hot Module Replacement)

HMR 允许在运行时更新所有类型的模块，而无需完全刷新

```js
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
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
      {
        test: /.png$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024,
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Ideal Webpack Develop Env",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
    }),
  ],
  devServer: {
    hot: true,
    // hotOnly: true // 只使用 HMR，不会 fallback 到 live reloading
  },
  devtool: "source-map",
};
```

因为 css 具有统一的规则，只需要覆盖替换样式即可，而且 style-loader 已经实现过 HMR 的热替换。而 js 文件是没有复杂多样的，没有统一的规则，所以需要我们自己根据实际情况实现

```js
import "./main.css";
import createEditor from "./editor";

const editor = createEditor();
document.body.appendChild(editor);

// ================================================================
// HMR 手动处理模块热更新
// 不用担心这些代码在生产环境冗余的问题，因为通过 webpack 打包后，
// 这些代码全部会被移除，这些只是开发阶段用到
if (module.hot) {
  let hotEditor = editor;
  module.hot.accept("./editor.js", () => {
    // 当 editor.js 更新，自动执行此函数
    // 临时记录编辑器内容
    const value = hotEditor.innerHTML;
    // 移除更新前的元素
    document.body.removeChild(hotEditor);
    // 创建新的编辑器
    // 此时 createEditor 已经是更新过后的函数了
    hotEditor = createEditor();
    // 还原编辑器内容
    hotEditor.innerHTML = value;
    // 追加到页面
    document.body.appendChild(hotEditor);
  });

  module.hot.accept("./better.png", () => {
    // 当 better.png 更新后执行
    // 重写设置 src 会触发图片元素重新加载，从而局部更新图片
    img.src = background;
  });

  // style-loader 内部自动处理更新样式，所以不需要手动处理样式模块
}
```

## 不同环境下的配置

为不同环境创建不同的配置，使用`webpack-merge`合并相同的配置

webpack.common.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "js/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            outputPath: "img",
            name: "[name].[ext]",
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack Tutorial",
      template: "./src/index.html",
    }),
  ],
};
```

webpack.dev.js

```js
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    hot: true,
    contentBase: "public",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
```

webpack.prod.js

```js
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "production",
  plugins: [new CleanWebpackPlugin(), new CopyWebpackPlugin(["public"])],
});
```

执行打包命令

```js
yarn webpack --config webpack.dev.js
```

## DefinePlugin

`DefinePlugin` 允许在 编译时 将你代码中的变量替换为其他值或表达式。这在需要根据开发模式与生产模式进行不同的操作时，非常有用。例如替换域名

```js
    new webpack.DefinePlugin({
      // 值要求的是一个代码片段
      API_BASE_URL: JSON.stringify("https://api.example.com"),
    }),
```

注意，由于本插件会直接替换文本，因此提供的值必须在字符串本身中再包含一个实际的引号。通常，可以使用类似 `'"production"'` 这样的替换引号，或者直接用 `JSON.stringify('production')`。

## Tree Shaking

用于描述移除 JavaScript 上下文中的未引用代码。`production` 模式下已经默认启用。

```js
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 压缩输出结果
    minimize: true,
  },
};
```

## sideEffects

通过 `package.json` 的 `"sideEffects"` 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯正 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。

```js
{
  "sideEffects": false
}
```

如果你的代码确实有一些副作用，可以改为提供一个数组：

```js
{
  "sideEffects": ["./src/some-side-effectful-file.js"]
}
```

> "side effect(副作用)" 的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export。

## 代码分包

### 多入口打包

适用于多页面打包，一个页面对应一个打包入口，提取公共部分

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",
  entry: {
    index: "./src/index.js",
    album: "./src/album.js",
  },
  output: {
    filename: "[name].bundle.js",
  },
  optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Multi Entry",
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      title: "Multi Entry",
      template: "./src/album.html",
      filename: "album.html",
      chunks: ["album"],
    }),
  ],
};
```

### 动态导入

动态导入的模块会被自动分包，实现按需加载

**魔法注释：给分包的 bundle 定义名称**

```js
// import posts from './posts/posts'
// import album from './album/album'

const render = () => {
  const hash = window.location.hash || "#posts";

  const mainElement = document.querySelector(".main");

  mainElement.innerHTML = "";

  if (hash === "#posts") {
    // mainElement.appendChild(posts())
    import(/* webpackChunkName: 'components' */ "./posts/posts").then(
      ({ default: posts }) => {
        mainElement.appendChild(posts());
      }
    );
  } else if (hash === "#album") {
    // mainElement.appendChild(album())
    import(/* webpackChunkName: 'components' */ "./album/album").then(
      ({ default: album }) => {
        mainElement.appendChild(album());
      }
    );
  }
};

render();

window.addEventListener("hashchange", render);
```

## CSS 文件压缩分包

```js
yarn add terser-webpack-plugin optimize-css-assets-webpack-plugin mini-css-extract-plugin --dev
```

- `terser-webpack-plugin`: 该插件使用 terser 来压缩 JavaScript
- `optimize-css-assets-webpack-plugin`: 使用 cssnano 优化和压缩 CSS
- `mini-css-extract-plugin`: 本插件会将 CSS 提取到单独的文件中，为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "none",
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
  },
  optimization: {
    minimizer: [
      // 声明数组会让webpack认为我们需要自定义压缩，所以需要自己声明js文件的压缩
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin(),
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 将样式通过 style 标签注入
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Dynamic import",
      template: "./src/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
};
```

## Hash 文件名

依赖文件名 hash 缓存。

项目级，项目任何改动都会变

```js
  output: {
    filename: "[name]-[hash].js",
  },
```

chunk 级，同一 chunk 改动会引用同 chunk 的变化

```js
  output: {
    filename: "[name]-[chunkhash].js",
  },
```

文件级，不同的文件不同的 hash 值，且 hash 长度为 8 位

```js
  output: {
    filename: "[name]-[contenthash:8].js",
  },
```
