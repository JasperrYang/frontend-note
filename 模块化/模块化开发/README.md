## ES Modules

### 特性

- 自动采用严格模式，忽略 'user strict'
- 每个 ES Module 都是运行在单独的私有作用域中
- ESM 通过 CORS 请求外部 JS 模块
- ESM 的 script 标签会延迟执行脚本

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ES Module</title>
  </head>
  <body>
    hahhha
  </body>
  <script type="module">
    console.log("this is es module");
  </script>
  <!-- 1 自动采用严格模式，忽略 'user strict' -->
  <script type="module">
    console.log(this);
  </script>
  <!-- 2 每个 ES Module 都是运行在单独的私有作用域中 -->
  <script type="module">
    var foo = 100;
    console.log(foo);
  </script>
  <script type="module">
    console.log(foo);
  </script>
  <!-- 3 ESM 通过 CORS 请求外部 JS 模块 -->
  <script type="module" src=""></script>
  <!-- 4 ESM 的 script 标签会延迟执行脚本 -->
  <script defer>
    alert("hello");
  </script>
</html>
```

### export

可以单独导出变量，函数，类

```js
export var name = "foo module";

export function hello() {
  console.log("hello");
}

export class Person {}
```

可以在尾部统一导出

```js
var name = "foo module";

function hello() {
  console.log("hello");
}

class Person {}

export { name, hello, Person };
```

导出重命名

```js
var name = "foo module";

export { name as fullName };

// 导入
// import { fullName } from "./module.js";
// console.log(fullName);
```

default

```js
var name = "foo module";

function hello() {
  console.log("hello");
}

class Person {}

export default { name, hello };

// 导入
// import mode from "./module.js";
// console.log(mode.name);
// console.log(mode.hello());
```

```js
var name = "foo module";

function hello() {
  console.log("hello");
}

export { hello as default, name };

// 导入
// import { default as hello, name } from "./module.js";
// console.log(name);
// console.log(hello());
```

**注意事项**

- `export {}` 不是字面量对象，`import` 引入的也不是解构，都是固定语法
- 通过 `export` 导出的不是值，而是值的地址，外部取值会受到内部值修改的影响
- 外部导入的成员属于只读成员（常量），无法修改

### import

- `import xx from './module.js'` 路径名称必须完整不能省略（可以使用绝对或相对路径），`./` 或 `/` 不能省略，否则会认为是加载模块
- `import xx from 'http://module.js'`可以使用完整的 url 访问
- `import {} from './module.js'`只会执行模块，不会提取成员，等同于 `import './module.js'`
- `import * as all from './module.js'` 导入所有方法，通过 `all.xx` 使用成员
- `import()` 动态导入模块

## ESM in Node.js

- ES Modules 中可以导入 CommonJS 模块
- CommonJS 中不能导入 ES Modules 模块
- CommonJS 始终只会导出一个默认成员
- 注意 import 不是解构导出对象

将 `package.json` 中添加 `type = 'module'`
