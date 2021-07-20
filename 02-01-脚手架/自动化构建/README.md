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

用户执行 npm run build 的时候，会自动按照下面的顺序执行。

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

### 基本使用

安装依赖

```js
yarn add grunt
```

创建入口文件 `gruntfile.js`

```js
// grunt 入口文件，用于定义需要 grunt 自动执行的任务
// 需要导出一个函数，此函数接收一个 grunt 的形参，内部提供一些创建任务时可以用到的 api
module.exports = (grunt) => {
  // 注册一个名为 foo 的任务
  grunt.registerTask("foo", () => {
    console.log("hello grunt");
  });
  // 注册一个名为 bar, 描述为 任务描述 的任务
  grunt.registerTask("bar", "任务描述", () => {
    console.log("other task");
  });
  // 注册一个 default 任务, 执行时不需要指定任务名称 yarn grunt
  // grunt.registerTask("default", () => {
  //   console.log("default task");
  // });
  // 注册一个 default 任务, 依次执行 foo 和 bar 任务
  grunt.registerTask("default", ["foo", "bar"]);
  // 注册一个 async-task 的异步任务
  grunt.registerTask("async-task", function () {
    // 声明这是一个异步任务
    this.async();
    setTimeout(() => {
      console.log("async task");
    }, 1000);
  });
};
```

通过命令执行

```js
yarn grunt ${taskName}
```

### 标记任务失败

grunt 中标记任务失败后，后续任务一般将不会在执行。可以通过 `--force` 参数强制执行失败任务的后续任务

```shell
yarn grunt --force
```

- 同步任务：通过返回 false 标记失败

```js
module.exports = (grunt) => {
  grunt.registerTask("foo", () => {
    console.log("hello grunt");
    return false;
  });
};
```

- 异步任务：通过执行状态

```js
module.exports = (grunt) => {
  grunt.registerTask("async-task", function () {
    // 声明这是一个异步任务
    const done = this.async();
    setTimeout(() => {
      console.log("async task");
      done(false);
    }, 1000);
  });
};
```

### 配置选项方法

可以通过 `grunt.initConfig` 方法配置 grunt 属性

```js
module.exports = (grunt) => {
  grunt.initConfig({
    foo: { name: "jasper" },
  });

  grunt.registerTask("foo", () => {
    console.log(grunt.config().foo.name);
  });
};
```

### 多目标任务

`initConfig` 配置中，每一个和任务同名的配置下的属性就是一个目标，通过运行该任务可以执行配置下的所有目标。

```js
module.exports = (grunt) => {
  grunt.initConfig({
    foo: {
      options: {
        sex: "男",
      },
      name: "jasper",
      age: 25,
    },
  });
  // 多目标
  grunt.registerMultiTask("foo", function () {
    console.log(this.options());
    console.log(`target: ${this.target}, data: ${this.data}`);
  });
};
```

### 插件使用

安装插件

```js
yarn add grunt-contrib-clean --dev
```

加载插件

```js
grunt.loadNpmTasks("grunt-contrib-clean");
```

配置目标

```js
grunt.initConfig({
  clean: {
    temp: "temp/**",
  },
});
```

执行

```js
yarn grunt clean
```

```js
module.exports = (grunt) => {
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.initConfig({
    clean: {
      temp: "temp/**",
    },
  });
};
```

常用插件

- load-grunt-tasks
- grunt-sass
- grunt-babel
- grunt-contrib-watch

## Gulp

## FIS
