# Parcel

Parcel 是 Web 应用打包工具，利用多核处理提供了极快的速度，并且不需要任何配置。

Parcel 可以使用任何类型的文件作为入口，与 webpack 不同的是 Parcel 建议使用 HTML 文件为入口文件。如果在 HTML 中使用相对路径引入主要的 JavaScript 文件，Parcel 也将会对它进行处理将其替换为相对于输出文件的 URL 地址。

安装

```js
yarn add parcel-bundler --dev
```

当前模块，或者当前模块所依赖模块更新后，回调会自动执行

```js
import foo from "./foo";

foo.bar();

if (module.hot) {
  module.hot.accept(() => {
    console.log("hmr");
  });
}
```

Parcel 内置了一个当你改变文件时能够自动重新构建应用的开发服务器，而且为了实现快速开发，该开发服务器支持热模块替换。只需要在入口文件指出：

```js
yarn parcel src/index.html
```

现在在浏览器中打开 `http://localhost:1234/`

## 自动安装依赖

```js
import $ from "jquery";

$(document.body).append("<h1>Hello Parcel</h1>");
```

## 非 js 类型文件

```js
import $ from "jquery";
import "./style.css";
import logo from "./zce.png";

$(document.body).append(`<img src="${logo}" />`);
```

## 支持动态导入

```js
import("jquery").then(($) => {
  $(document.body).append("<h1>Hello Parcel</h1>");

  $(document.body).append(`<img src="${logo}" />`);
});
```

## 生产模式打包

这将关闭监听模式和热模块替换，所以它只会编译一次。它还会开启 minifier 来减少输出包文件的大小。Parcel 使用的 minifiers 有 JavaScript 的 terser ，CSS 的 cssnano 还有 HTML 的 htmlnano。Parcel 还将会给大多数 bundles 文件名添加 hash，以获得最佳性能和效率

```js
yarn parcel build src/index.html
```
