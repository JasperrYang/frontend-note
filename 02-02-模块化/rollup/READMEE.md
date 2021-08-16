# Rollup

与 webpack 作用类似，Rollup 更为小巧，它仅仅是一款 ESM 打包器，并没有其他额外功能，例如自动化的插件，HMR 等在 Rollup 中不支持

安装

```js
yarn add rollup --dev
```

执行打包命令

- `file`：打包输出的文件目录
- `format`：指定打包输出的格式

```js
yarn rollup ./src/index.js --file dist/bundle.js --format iife
```

查看打包结果

```js
(function () {
  "use strict";

  const log = (msg) => {
    console.log("---------- INFO ----------");
    console.log(msg);
    console.log("--------------------------");
  };

  var messages = {
    hi: "Hi~",
  };

  // 导入模块成员

  // 使用模块成员
  const msg = messages.hi;

  log(msg);
})();
```

代码相比 webpack 大量引导代码和模块函数，这里的输出很简略清晰，没有多余代码，输出代码中只会保留用到的部分，对于未引用的部分都没有输出，这是因为 rollup 默认会自动开启 tree shaking

## 配置文件

在项目中创建一个名为 `rollup.config.js` 的文件，增加如下代码：

```js
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
};
```

执行打包命令

```js
yarn rollup --config rollup.config.js
```

## 使用插件

rollup 的自身功能就是 ESM 模块的合并打包，如果有加载其他类型资源文件，导入 Commonjs，编译 ES6+ 新特性等需要使用插件扩展实现

安装对应插件

```js
yarn add rollup-plugin-json --dev
```

修改配置

```js
import json from "rollup-plugin-json";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [json()],
};
```

## 加载 npm 模块

rollup 默认只能按文件路径的方式加载本地文件模块，对于 node_modules 下的第三方模块，并不能像 webapck 通过模块名称导入对应模块

`rollup-plugin-node-resolve` 可以解决 rollup 使用第三方模块名称导入模块的问题

安装扩展模块

```js
yarn add rollup-plugin-node-resolve --dev
```

引用 NPM 模块

```js
import _ from "lodash-es";

_.camelCase("hello world");
```

更改配置

```js
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [json(), resolve()],
};
```

**注意：使用 lodash-es（lodash esm 版本） 而不是 lodash 是因为 ，rollup 默认只能处理 ESM 模块，如果使用普通版本需要做额外处理**

```js
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [json(), resolve()],
  // 指出应将哪些模块视为外部模块
  external: ["lodash"],
};
```

## 加载 CommonJS 模块

rollup-plugin-commonjs 解决了 commonjs 模块打包问题

安装扩展包

```js
yarn add rollup-plugin-commonjs --dev
```

修改配置文件

```js
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [json(), resolve(), commonjs()],
  // 指出应将哪些模块视为外部模块
  external: ["lodash"],
};
```

## Code Splitting

Dynamic Imports 实现按需加载，rollup 内部会进行代码拆分

```js
import("./logger").then(({ log }) => {
  log("code splitting!");
});
```

修改配置文件

- 代码分割输出多文件 chunks 需要修改，file 为 dir
- 因为 iife 会把所有模块放在同一个函数中，相比于 webpack 并没有引导代码，没法实现代码拆分，因此修改 format 为 `amd` or `cjs`

```js
import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [json(), resolve(), commonjs()],
  // 指出应将哪些模块视为外部模块
  external: ["lodash"],
};
```

## 多入口打包

公共部分也会提取出来作为独立的 bundle

```js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: "src/index.js",
    bar: "src/album.js",
  },
  output: {
    dir: "dist",
    format: "amd",
  },
};
```

amd 规范无法在浏览器直接引用，通过实现 amd 标准的库加载（Require.js）

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <!-- AMD 标准格式的输出 bundle 不能直接引用 -->
    <!-- <script src="foo.js"></script> -->

    <!-- 需要 Require.js 这样的库 -->
    <script
      src="https://unpkg.com/requirejs@2.3.6/require.js"
      data-main="foo.js"
    ></script>
    <!-- data-main执行入口模块路径 -->
  </body>
</html>
```

## 原则

- 如果我们正在开发应用程序，需要大量引入第三方模块，应用过大还要分包，应选择 webpack

- 如果我们开发一个框架或者类库，很少依赖第三方模块，应选择 rollup。大多数知名框架/库都在使用 Rollup 作为模块打包
