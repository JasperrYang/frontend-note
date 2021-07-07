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

## TypeScript

> JavaScript 的超集

### 快速上手

`yarn init --yes` 初始化模块

`yarn add typescript --dev` 安装扩展模块

新建 `helloTypeScript.ts` 文件

```js
const hello = (name: string) => {
  console.log(`Hello ${name}`);
};
hello("TypeScript");
```

通过 `yarn tsc ./helloTypeScript.ts` 命令编译运行

### 配置文件

> 如果一个目录下存在一个 `tsconfig.json` 文件，那么它意味着这个目录是 `TypeScript` 项目的根目录。 `tsconfig.json` 文件中指定了用来编译这个项目的根文件和编译选项。

创建 `tsconfig.json` 文件：`yarn tsc --init`

| 配置             | 含义                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| target           | 指定 ECMAScript 目标版本                                                                         |
| module           | 指定生成哪个模块系统代码                                                                         |
| lib              | 编译过程中需要引入的库文件的列表                                                                 |
| outDir           | 重定向输出目录                                                                                   |
| rootDir          | 仅用来控制输出的目录结构                                                                         |
| strict           | 启用所有严格类型检查选项。                                                                       |
| strictNullChecks | 在严格的 null 检查模式下， null 和 undefined 值不包含在任何类型里，只允许用它们自己和 any 来赋值 |

### 类型

#### 作用域问题

```ts
// (function(){
//   const a: number = 123;
// })()

const a: number = 123;
// 以模块的方式工作
export {};
```

#### 普通类型

```ts
/**
 * 原始类型（严格模式）
 */

const a: string = "string";

const b: number = 100; // NaN Infinity

const c: boolean = false;

// const d: boolean = null;

const e: void = undefined;

const f: null = null;

const g: undefined = undefined;
// 需要版本为 ES2015
const h: symbol = Symbol();
```

#### Object 类型

> 可以是除普通类型外的数组、对象、函数类型

```ts
const foo: object = {};
// const foo: object = []
// const foo: object = function(){}
const obj: { foo: number; bar: string } = { foo: 123, bar: "aa" };
```

#### 数组类型

```ts
const arr1: Array<number> = [1, 3, 4];
const arr2: number[] = [1, 3, 4, 5, 6];
```

#### 元祖类型

> 表示一个已知元素数量和类型的数组，各元素的类型不必相同

```ts
/**
 * 元组类型
 */
const tuple: [number, string] = [123, "ha"];
```

#### 枚举类型

> 默认情况下，从 `0` 开始为元素编号。 你也可以手动的指定成员的数值

```ts
// enum Color {
//   Red,
//   Green,
//   Blue,
// }
// const color: Color = Color.Green;

const enum Color {
  Red = 1,
  Green,
  Blue,
}
const colorName: string = Color[2];

console.log(colorName); // 显示'Green'因为上面代码里它的值是2
```

建议使用`const`定义枚举类型，因为在编译时会生成键值对对象，而我们实际使用过程中并不需要这种形式

```js
var Color;
(function (Color) {
  Color[(Color["Red"] = 1)] = "Red";
  Color[(Color["Green"] = 2)] = "Green";
  Color[(Color["Blue"] = 3)] = "Blue";
})(Color || (Color = {}));
var colorName = Color[2];
console.log(colorName); // 显示'Green'因为上面代码里它的值是2
```

#### 函数类型

```ts
function add(a: number, b: number): number {
  return a + b;
}

const func: (a: number, b: number) => number = function (
  a: number,
  b: number
): number {
  return a * b;
};
```

#### 任意类型

```ts
let child: any = "rob";

child = 123;

child = false;
```

#### 隐式类型推断

> 如果我们没有明确指定变量的类型，那么 ts 将会根据我们的使用情况自动推断变量的类型。如果没有办法推断那默认会是 any 类型

#### 类型断言

> 断言并非类型转换。类型转换是运行时，断言是编译时。

```js
const nums = [1,3,4,5,6];
const res = nums.find(num => num > 0)
// const square = res * res; // 无法确定其类型
const num1 = res as number;
const num2 = <number>res; // JSX 下会和标签语法冲突
```

### 接口

> 在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义约束。

```js
export {}
interface Post {
  title: string
  content: string
  total: number
  status?: boolean // 可选
  readonly summary: string // 只读
}

const hello: Post = {
  title: 'TypeScript',
  content: 'hello',
  total: 100,
  status: true,
  summary: '好书'
}
```

### 类

> 增强了 ES6 中的 class，增加了访问修饰符、只读属性等

- public：默认的，全部可见的
- private：不能在声明它的类的外部访问
- protected：与 `private` 修饰符的行为很相似，但 `protected` 成员在派生类中仍然可以访问

```js
export {}
class person {
  // 类型属性必须赋值
  public name: string
  private age: number
  protected readonly gender: string

  constructor(name: string, age: number, gender: string) {
    this.name = name
    this.age = age
    this.gender = gender
  }

  sayHi(msg: string) {
    console.log(`I am ${this.name}, ${msg}`);
  }
}
```

### 泛型

> 把定义时不明确的参数定义为一个类型，让我们可以在使用时传入一个类型

```js
export {};

function createNumberArray(length: number, value: number) {
  return Array < number > length.fill(value);
}

function createStringArray(length: number, value: string) {
  return Array < string > length.fill(value);
}

createNumberArray(3, 100); //[100, 100, 100]

function createArray<T>(length: number, value: T) {
  return Array < T > length.fill(value);
}

createArray < number > (3, 100); //[100, 100, 100]
```

### 类型声明

> `declare`

```js
import { cameCase } from "lodash";

declare function cameCase(input: string): string;
const res = cameCase("hello");
```
