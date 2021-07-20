# 自动化构建

## 自动化构建

> 在开发阶段使用提高效率的语法、规范和标准，将源代码自动构建为生产代码

## NPM Script

> 每当执行 `npm run`，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 `npm` 脚本里面。这意味着，当前目录的`node_modules/.bin` 子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。

```json
"build": "sass sass/main.sass css/style.css --watch",
```
不用写成
```json
"build": "./node_modules/.bin/sass sass/main.sass css/style.css --watch",
```

### 默认值

一般来说，npm 脚本由用户提供。但是，npm 对两个脚本提供了默认值。也就是说，这两个脚本不用定义，就可以直接使用。

```json
"start": "node server.js"，
"install": "node-gyp rebuild"
```

上面代码中，`npm run start` 的默认值是 `node server.js`，前提是项目根目录下有 `server.js` 这个脚本；`npm run install` 的默认值是 `node-gyp rebuild`，前提是项目根目录下有 `binding.gyp`文件。

### 钩子

npm 脚本有 `pre` 和 `post `两个钩子。举例来说，build 脚本命令的钩子就是 `prebuild` 和 `postbuild`。

```json
"prebuild": "echo I run before the build script",
"build": "cross-env NODE_ENV=production webpack",
"postbuild": "echo I run after the build script"
```

用户执行npm run build的时候，会自动按照下面的顺序执行。
```json
npm run prebuild && npm run build && npm run postbuild
```

### npm package

- npm-run-all：同时启动运行多个命令
  - parallel: 并行运行多个命令，例如：`npm-run-all --parallel lint build`
  - serial: 多个命令按排列顺序执行，例如：`npm-run-all --serial clean lint build:**`
  - continue-on-error: 是否忽略错误，添加此参数 `npm-run-all` 会自动退出出错的命令，继续运行正常的
  - race: 添加此参数之后，只要有一个命令运行出错，那么 `npm-run-all` 就会结束掉全部的命令
- [browser-sync](https://browsersync.bootcss.com/docs/options)

## Grunt

## Gulp

## FIS
