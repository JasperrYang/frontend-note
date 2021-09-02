# 规范化

代码，文档，甚至是提交日志，开发过程中人为编写的内容，都需要统一标准。

## ESLint

- 最为主流的 JavaScript Lint 工具， 统一开发者的编码风格

安装扩展

```js
yarn add eslint --dev
```

初始化配置

```js
yarn eslint --init
```

![微信截图_20210817155622.png](https://upload-images.jianshu.io/upload_images/6010417-f17f035d1e185785.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

生产配置文件 `.eslintrc.js`

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-alert": "error",
  },
  plugins: ["vue"], // eslint-plugin-vue
};
```

- `extends` 继承共享配置，可以同时继承多个共享配置，是个数组
- `parserOptions` 设置语法解析器的相关配置，6（es2015）— 12（es2021），只代表语法检测，不代表成员是否可用，成员是否可用通过 env 环境
- `rules` 设置每个校验规则的开启或关闭
  - `off` 或 `0` 关闭规则
  - `warn` 或 `1` 将该规则作为警告打开（不影响退出代码）
  - `error` 或 `2` 将规则作为错误打开（触发时退出代码为 1）

### 结合 gulp 自动化工具

安装扩展包并初始化 eslint 配置

```js
yarn add gulp eslint gulp-eslint --dev
yarn eslint --init
```

添加工作流

```js
const script = () =>
  src("src/assets/scripts/*.js", { base: "src" })
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("temp"))
    .pipe(bs.reload({ stream: true }));
```

### 结合 webpack

通过 loader 进行 eslint 校验

安装扩展包并初始化 eslint 配置

```js
yarn add eslint eslint-loader --dev
yarn eslint --init
```

修改 webpack 配置

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        'eslint-loader'  // 添加eslint-loader
      ]
    }
  ]
},
```

### 对 ts 检测

配置文件添加 parser 解析器，解析 ts 语法

```js
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["standard"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ["@typescript-eslint"],
  rules: {},
};
```

## StyleLint

样式代码检查规则，提供了 cli 工具快速调用，可以使用（Sass，Less，PostCss），支持 Gulp，Webpack 集成

安装

```js
yarn add stylelint stylelint-config-standard --dev
```

创建 `.stylelintrc.js` 文件

```js
module.exports = {
  extends: "stylelint-config-standard", // 配置继承模块
};
```

执行

```js
yarn stylelint index.css
```

效验 sass 文件

```js
yarn add stylelint-config-sass-guidelines --dev
```

## Prettier

安装

```js
yarn add prettier --dev
```

执行
`yarn prettier *.js *.css` 会将所有的格式化后的内容输入到控制台，可以通过 `--write` 参数将格式化后的内容写入到文件

```js
yarn prettier *.js *.css --write
```

## HtmlLint

安装扩展包

```js
yarn add htmllint-cli --dev
```

初始化配置

```js
yarn htmllint init
```

执行

```js
yarn htmllint index.html
```

## Git Hooks

防止代码在提交至远程仓库之前未执行 lint 工作，通过 git hooks 在代码提交前强制 lint。

git hooks 也称钩子，每个钩子都对应一个任务，通过脚本编写钩子任务触发具体执行内容,查看 `.git/hooks` 下钩子文件。

`Husky` 包可以实现 Git Hooks 的使用需求, 在不编写 shell 的前提下使用 hooks 的功能

安装

```js
yarn add husky --dev
```

配置 `package.json` 文件

```js
  "husky": {
    "hooks": {
      "pre-commit": "yarn eslint index.js"
    }
  },
```

配置后在提交 `git commit -m "xx"` 时会触发 `pre-commit` 钩子并执行 `yarn eslint`

处理 commit 时检查后的代码配合 lint-staged

安装

```js
yarn add lint-staged --dev
```

配置 `package.json` 文件

```js
  "lint-staged": {
    "linters": {
      "*.js": [
        "eslint --fix",
        "git add"
      ],
      "*.html": [
        "htmllint",
        "git add"
      ],
      "*.{scss,css}": [
        "stylelint --fix",
        "git add"
      ]
    }
  }
```
