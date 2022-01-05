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

### 基本使用

安装 `gulp`

```js
yarn add gulp --dev
```

创建 `gulpfile.js` 文件

**在最新的 gulp 中约定每个任务都是异步任务，因此我们需要标记任务完成通过 done 参数**

```js
exports.foo = (done) => {
  console.log("foo task working...");
  done();
};
// 默认任务
exports.default = (done) => {
  console.log("this is default task");
  done();
};
// gulp 4.0 以前通过注册一个任务,不推荐
const gulp = require("gulp");
gulp.task("old", (done) => {
  console.log("old gulp task..");
  done();
});
```

执行任务

```
yarn gulp foo
```

### 组合任务

我们可以根据具体场景选择任务是并行执行（paralle）还是串行执行（series）。

- 部署需要先执行编译任务，在执行部署任务，那么应该是串行执行
- 编译时，less/sass 和 js 的编译并没有先后依赖关系，那么可以并行执行，提高效率

```js
const { series, parallel } = require("gulp");

const task1 = (done) => {
  setTimeout(() => {
    console.log("task1 working~");
    done();
  }, 1000);
};

const task2 = (done) => {
  setTimeout(() => {
    console.log("task2 working~");
    done();
  }, 1000);
};
const task3 = (done) => {
  setTimeout(() => {
    console.log("task3 working~");
    done();
  }, 1000);
};

exports.foo = series(task1, task2, task3); //串行依次执行

exports.bar = parallel(task1, task2, task3); //并行执行
```

### 异步任务

回调函数

```js
exports.callback = (done) => {
  console.log("callback task~");
  done();
};

//如果多个任务执行，后面不会再执行
exports.callback_error = (done) => {
  console.log("callback_error task~");
  done(new Error("task Failed"));
};
```

promise

```js
exports.promise = () => {
  console.log("promise task~");
  return Promise.resolve("ok"); //要返回一个promise对象
};

exports.promise_error = () => {
  console.log("promise_error task~");
  return Promise.reject(new Error("task Failed")); //要返回一个promise对象
};
```

async/await

```js
const timeout = (time) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
exports.async = async () => {
  await timeout(1000);
  console.log("async task~");
};
```

### Gulp 构建过程核心工作原理

- **基于流的构建系统**

```js
const fs = require("fs");
const { Transform } = require("stream");

exports.default = () => {
  //文件读取流
  const read = fs.createReadStream("normalize.css");

  //文件写入流
  const write = fs.createWriteStream("normalize.min.css");

  //文件转换流
  const transform = new Transform({
    //
    transform: (chunk, encoding, callback) => {
      //核心转换过程
      //核心转换过程实现
      //chunk => 读取流中读到的内容（Buffer）toString转化程字符串
      const input = chunk.toString();
      const output = input.replace(/\s+/g, "").replace(/\/\*.+?\*\//g, "");
      callback(null, output); //错误优先，没有错误传null
    },
  });

  //把读取出来的文件流导入写入文件流
  read.pipe(transform).pipe(write);

  return read;
};
```

### Gulp 文件操作 API

> 转换流一般都是通过插件提供 `src().pipe(转换流).pipe(dest(目标目录))`

```js
const { src, dest } = require("gulp");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");

exports.default = () => {
  return src("src/*.css") //创建文件读取流
    .pipe(cleanCss())
    .pipe(rename({ extname: ".min.css" })) //重命名扩展名
    .pipe(dest("dist")); //导出到dest写入流中  参数写入目标目录
};
```

## FIS

### 基本使用

安装

```js
yarn add fis3 --dev
```

添加 fis 配置文件 `fis-conf.js`

```js
//资源定位
fis.match("*.{js,scss,png}", {
  release: "/assets/$0", //当前文件原始目录结构
});
//编译压缩
//yarn global add fis-parser-node-sass
fis.match("**/*.scss", {
  rExt: ".css",
  parser: fis.plugin("node-sass"),
  optimizer: fis.plugin("clean-css"),
});

//yarn global add fis-parser-babel-6.x
fis.match("**/*.js", {
  parser: fis.plugin("babel-6.x"),
  optimizer: fis.plugin("uglify-js"),
});
```

执行，fis3 inspect 查看转换文件

```js
fis3 release -d output
```
