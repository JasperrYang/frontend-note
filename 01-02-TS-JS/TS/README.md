# TypeScript

## Flow

> JavaScript 的类型检查器

- `yarn add flow-bin --dev` 安装 `flow`
- 代码开始添加`// @flow`注释
- `yarn flow init` 生产 `flow` 配置文件
- `yarn flow` 运行

```js
// @flow
function add(n: number, m: number) {
  return n + n;
}
add(2, 3);
add("2", "3"); // Error!
```

### 编译移除注解

> 注解只是在开发阶段帮助我们控制数据类型，在实际生产环境我们并不需要他。这里我们介绍两种方法

#### babel

`yarn add --dev @babel/core @babel/cli @babel/preset-flow` 安装 babel 依赖

在根目录下创建`.babelrc`文件，且配置`presets`

```js
{
"presets": ["@babel/preset-flow"]
}
```

执行 `yarn run babel src/ -d lib/`

#### 官方组件

`yarn add flow-remove-types --dev` 安装官方依赖

`yarn flow-remove-types ./src -d ./lib` 执行

### 注解类型

```js
// 变量类型
let num: number = 100;
// 函数返回类型
function sum(): number() {}
// 基本类型
const a: string = 'aa';
const b: numebr = 11;
const c: boolean = false;
const d: null = null;
const e: void = undefined;
const f: symbol = Symbol();
// 数组
const arr1: Array<number> = [1, 2, 3];
const arr2: number[] = [1, 2, 3];
const foo: [String, number] = ["haha", 11];
// 对象类型
const obj1 = { foo: string, bar: number} = { foo: "haha", bae: 111 };
const obj2: { foo?: string, bar: number } = { bar: 100 }; // foo 可有可无
const obj3: { [string]: string } = {}; // 限制键值类型

obj3.key1 = 'value'
obj3.key2 = 'value'
// 函数类型
function foo(callback: (string, number) => void) {
  // 显示回调函数返回值类型
  callback('string', 100)
}
// 特殊类型
const a: 'foo' = 'foo'
const type: 'success' | 'warning' | 'danger' = 'success';
type StringOrNumber = string | number
const b: StringOrNumber = 'string';

const gender: ?number  = undefined;
const gender: number | undefined | null = undefined;
//mixed 强类型-所有
function passMixed(value: mixed) {
  if(typeof value === 'string') {
    value.substr(1)
  }
}
//any 弱类型-所有
function passAny(value: any) {
  value.substr(1)
}
```
