# 脚手架工具

## 工程化概述

> 一切以提高效率、降低成本、质量保证为目的的手段都属于工程化

- 创建项目
  - 通过脚手架工具创建项目结构
- 编码
  - 格式化代码
  - 编译、构建、打包
- 预览/测试
  - Web Server/Mock
  - HMR
  - Source Map
- 提交
  - Git Hooks
  - 持续集成
- 部署
  - CI/CD
  - 自动发布

## 脚手架工具

> **本质**：创建项目基础结构、提供项目规范和约定

### Yeoman（通用型脚手架工具）

#### 基本使用

安装 `yeoman`

```
npm install -g yo
```

然后安装所需的 `generator`，`Generators` 是名为 `generator-XYZ` 的 `npm` 包。这里安装 `node generator`

```
npm install -g generator-node
```

执行脚手架搭建新项目

```
yo node
```

#### Sub Generator

> 需要根据对应的 `Generator` 文档判断是否存在 `Sub Generator`

![Sub Generator](https://upload-images.jianshu.io/upload_images/6010417-9f67105ef9cbae15.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

安装对应 `sub Generator`

```
yo node:cli
```

链接当前模块到全局

```
npm link
```

执行查看结果

```txt
my-module --help

// 输出
  testing

  Usage
    $ my-module [input]

  Options
    --foo  Lorem ipsum. [Default: false]

  Examples
    $ my-module
    unicorns
    $ my-module rainbows
    unicorns & rainbows
```

#### 使用步骤总结

- 明确需求，找到合适的 Generator
- 全局范围安装找到的 Generator
- 通过 yo 运行对应的 Generator
- 通过命令行交互填写选项
- 生成所需要的项目结构

#### 自定义 Generator

![目录结构](https://upload-images.jianshu.io/upload_images/6010417-8d3cab32e84e5610.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

安装 generator 基类

```
yarn add yeoman-generator
```

创建 `generators/app/index.js` 为 Generator 的核心入口

```js
// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  writing() {
    // Yeoman 自动在生成文件阶段调用此方法
    this.fs.write(this.destinationPath("temp.txt"), Math.random().toString());
  }
};
```

执行 `npm link`后，创建新模块并执行

```
yo sample
```

根据模板创建文件

```js
// 模板
module.exports = class extends Generator {
  writing() {
    // 模板文件路径
    const tmpl = this.templatePath("foo.txt");
    // 输出文件路径
    const output = this.destinationPath("foo.txt");
    // 模板数据上下文
    const context = { title: "hello", success: true };
    this.fs.copyTpl(tmpl, output, context);
  }
};
```

接收用户输入

```js
module.exports = class extends Generator {
  prompting() {
    // Yeoman 在询问用户环节会自动调用此方法
    // 在此方法中可以调用父类的 prompt() 方法发出对用户的命令行询问
    return this.prompt([
      {
        type: "input", // 用户输入类
        name: "title", // 接收参数的键
        message: "message title", // 提示
        default: "hello", // 默认值
      },
      {
        type: "input", // 用户输入类
        name: "success", // 接收参数的键
        message: "message status", // 提示
        default: false, // 默认值
      },
    ]).then((answer) => {
      this.answer = answer;
    });
  }
  writing() {
    // 模板文件路径
    const tmpl = this.templatePath("foo.txt");
    // 输出文件路径
    const output = this.destinationPath("input.txt");
    // // 模板数据上下文
    // const context = { title: "hello", success: true };
    this.fs.copyTpl(tmpl, output, this.answer);
  }
};
```

### Plop（创建特定类型文件）

#### 基本使用

- 将 plop 模块作为项目开发依赖安装
- 在项目根目录下创建一个 plopfile.js 文件
- 在 plopfile.js 文件中定义脚手架任务
- 编写用于生成特定类型文件的模板
- 通过 plop 提供的 cli 运行脚手架任务

安装 `plop` 扩展模块

```js
yarn add plop --dev
```

在项目根目录下创建 `plopfile.js` 入口文件

```js
// plop 入口文件，需要导出一个函数
// 此函数接收一个 plop 对象，用户创建生成器任务

module.exports = (plop) => {
  plop.setGenerator("component", {
    description: "create component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "component name",
        default: "myComponent",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{name}}/index.js",
        templateFile: "templates/component.js.hbs",
      },
      {
        type: "add",
        path: "src/components/{{name}}/index.css",
        templateFile: "templates/component.css.hbs",
      },
      {
        type: "add",
        path: "src/components/{{name}}/index.html",
        templateFile: "templates/component.html.hbs",
      },
    ],
  });
};
```

编写用于生成特定类型文件的模板 `component.html.hbs`

```js
console.log("{{name}}")
```

运行

```js
yarn plop component
```

### 脚手架工具原理

- 通过命令行交互询问用户问题
- 根据用户回答的结果生成文件

Node CLI 的入口配置是 `package.json` 文件中的 `bin`，应用入口文件必须要有这样的文件头。如果是 Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755

```js
#!/usr/bin/env node
```

文件配置

```js
#!/usr/bin/env node

console.log("start......");

const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

inquirer
  .prompt([
    {
      type: "input",
      name: "name",
      message: "project name",
    },
  ])
  .then((answer) => {
    console.log(answer);

    // 模板目录
    const tmplDir = path.join(__dirname, "templates");
    // 目标目录
    const destDir = process.cwd();

    // 将模板下的文件全部转换到目标目录
    fs.readdir(tmplDir, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        // 通过模板引擎渲染文件
        ejs.renderFile(path.join(tmplDir, file), answer, (err, result) => {
          if (err) throw err;

          // 将结果写入目标文件路径
          fs.writeFileSync(path.join(destDir, file), result);
        });
      });
    });
  });

```
