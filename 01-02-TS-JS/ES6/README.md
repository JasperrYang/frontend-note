## ECMAScript2015

### 箭头函数与 this

> 规律：**`this` 的指向在函数定义的时候是确定不了的，只有函数执行的时候才能确定 `this` 到底指向谁，实际上 `this` 的最终指向的是那个调用它的对象。在 ES6+ 的箭头函数中是没有自己 `this` 的，处理机制是使用自己上下文里的 `this`**

#### 为何 `this`？

- `this` 就是当前函数执行的主体（谁执行了函数）。

#### 常见 `this` 场景

- 事件绑定：事件触发时 `this` 一般都是被操作的元素
- 普通函数：
  - 函数执行时查看前面是否有点，如果有点，则点前面的就是执行主体，没有点就是 window，严格模式下是 undefined。
  - 匿名函数、回调函数中的 `this` 是 `window` 或者 `undefined`。
- 构造函数：待定。。。
- 箭头函数：函数中是没有自己 `this` 的，处理机制是使用自己上下文里的 `this`。
- 基于 call/bind/apply 强制改变 this 指向

### Proxy

> Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```js
const person = {
  name: "李四",
  sex: "男",
  age: 18,
};

var obj = new Proxy(person, {
  get: function (target, propKey, receiver) {
    return target[propKey];
  },
  set: function (target, propKey, value, receiver) {
    console.log("value --->", value);
    return target[propKey];
  },
});

obj.name = "jack";
console.log(obj.name);

// 输出
// value ---> jack
// 李四
```

#### 对比 defineProperty

```js
Object.defineProperty(object1, "property1", {
  value: 42,
  writable: false,
});

object1.property1 = 77;
// throws an error in strict mode

console.log(object1.property1);
// expected output: 42
```

- `defineProperty` 只能监视属性的读写，`Proxy` 可以监视到删除、调用等
- `defineProperty` 需要重写数组上的方法才能劫持，`Proxy` 可以直接监视
- `Proxy` 以非侵入的方式监管的对象的读写

### Reflect

> 统一提供一套操作对象的 API

```js
const person = {
  name: "李四",
  sex: "男",
  age: 18,
};

// console.log("name" in person);
// console.log(delete person["age"]);
// console.log(Object.keys(person));

Reflect.has(person, "name");
Reflect.defineProperty(person, "age");
Reflect.ownKeys(person);
```

- `Reflect.apply(target, thisArg, args)`：等同于 `Function.prototype.apply.call(func, thisArg, args)`，用于绑定 `this` 对象后执行给定函数。
- `Reflect.construct(target, args)`：同于 `new target(...args)`，这提供了一种不使用 `new`，来调用构造函数的方法。
- `Reflect.get(target, name, receiver)`：查找并返回 `target` 对象的 `name` 属性，如果没有该属性，则返回 `undefined`。
- `Reflect.set(target, name, value, receiver)`：设置 `target` 对象的 `name` 属性等于 `value`。
- `Reflect.defineProperty(target, name, desc)`：基本等同于 `Object.defineProperty`，用来为对象定义属性
- `Reflect.deleteProperty(target, name)`：等同于 `delete obj[name]`，用于删除对象的属性。
- `Reflect.has(target, name)`：对应 `name in obj` 里面的 `in` 运算符。
- `Reflect.ownKeys(target)`：用于返回对象的所有属性，基本等同于 `Object.getOwnPropertyNames` 与 `Object.getOwnPropertySymbols` 之和。
- `Reflect.isExtensible(target)`：对应`Object.isExtensible`，返回一个布尔值，表示当前对象是否可扩展。
- `Reflect.preventExtensions(target)`：对应 `Object.preventExtensions` 方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功。
- `Reflect.getOwnPropertyDescriptor(target, name)`：基本等同于 `Object.getOwnPropertyDescriptor`，用于得到指定属性的描述对象
- `Reflect.getPrototypeOf(target)`：用于读取对象的 `__proto__` 属性，对应 `Object.getPrototypeOf(obj)`。
- `Reflect.setPrototypeOf(target, prototype)`：用于设置目标对象的原型（prototype），对应`Object.setPrototypeOf(obj, newProto)`方法。它返回一个布尔值，表示是否设置成功。

## 集合

### Set

> 类似于数组，但是成员的值都是唯一的，没有重复的值。

```js
const s = new Set();

s.add(1).add(2).add(3).add(4);

console.log(s);
// 循环
for (item of s) {
  console.log(item);
}
// 大小
console.log(s.size);
// 判断是否存在
console.log(s.has(1));
// 删除
console.log(s.delete(1));
console.log(s);
// 清空集合
s.clear();
console.log(s);
// 数组转换
const arr = [1, 2, 3, 4, 5, 6, 7];
// const result = Array.from(new Set(arr));
const result = [...new Set(arr)];
console.log(result);
```

### Map

> 键值对集合。与普通对象不用的是，键可以为任何值。普通对象的键位字符。

```js
let map = new Map().set("name", "jaco").set("sex", "男").set("age", 18);
console.log(map);
console.log(map.has("name"));
// map.delete();
// map.size;
// map.clear();
```

### Symbol

> `Symbol` 一种新的原始数据类型，表示独一无二的值。它是 `JavaScript` 语言的第七种数据类型，前六种是：`undefined`、`null`、`Boolean`、`String`、`Number`、`Object`。

```js
console.log(Symbol("foo"));
console.log(Symbol("bba"));
const obj = {};
obj[Symbol("foo")] = 123;
obj[Symbol("bba")] = 123;
console.log(obj);
// 获取相同symbol
const s1 = Symbol.for("foo");
const s2 = Symbol.for("foo");
console.log(s2 === s1);
```

#### 自定义 toString 标签

```js
const obj = {
  [Symbol.toStringTag]: "hahaha",
  [Symbol()]: "ttttt",
};
console.log(obj.toString());
```

#### 获取 symbol 属性名

- `Object.keys(obj)`，无法获取 `symbol` 类型属性名。
- `JSON.stringify(obj)`，序列化时会忽略 `symbol` 类型。

```js
console.log(Object.getOwnPropertySymbols(obj));
```

### 可迭代接口

> 是一种接口，为各种不同的数据结构（数组、对象、set、map）提供统一的访问机制。任何数据结构只要部署 `Iterator` 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

```js
var it = makeIterator(["a", "b"]);

it.next(); // { value: "a", done: false }
it.next(); // { value: "b", done: false }
it.next(); // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function () {
      return nextIndex < array.length
        ? { value: array[nextIndex++], done: false }
        : { value: undefined, done: true };
    },
  };
}
```

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的 next 方法，直到它指向数据结构的结束位置。

对象类型调用

```js
const obj = { a: 1, b: 2, c: 3 };

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, "->", value);
}
```

## ECMAScript2016 概述

- `includes`

```js
const arr = [1, 2, 3, 45, NaN, false];

console.log(arr.indexOf(45));
console.log(arr.indexOf(NaN));

console.log(arr.includes(NaN));
// 3
// -1
// true
```

- 指数运算符

```js
console.log(Math.pow(2, 4)); // 16
console.log(2 ** 4); // 16
```

## ECMAScript2017 概述

- `Object.values` 返回对象中值组成的数组

```js
const person = {
  name: "李四",
  sex: "男",
  age: 18,
};
// Object.values;
console.log(Object.keys(person)); // [ 'name', 'sex', 'age' ]
console.log(Object.values(person)); // [ '李四', '男', 18 ]
```

- `Object.entries` 以数组形式返回对象中的键值对

```js
const person = {
  name: "李四",
  sex: "男",
  age: 18,
};

console.log(Object.entries(person));
// [ [ 'name', '李四' ], [ 'sex', '男' ], [ 'age', 18 ] ]
for (const [key, value] of Object.entries(person)) {
  console.log(key, value);
}
// name 李四
// sex 男
// age 18
console.log(new Map(Object.entries(person)));
// Map(3) { 'name' => '李四', 'sex' => '男', 'age' => 18 }
```

- `String.prototype.padStart / String.prototype.padEnd`：字符串增加前缀后缀

```js
const obj = {
  num: 10,
  perice: 100,
};
for (const [name, count] of Object.entries(obj)) {
  console.log(
    `${name.padStart(10, "-")}|${count.toString().padStart(10, "0")}`
  );
}
// -------num|0000000010
// ----perice|0000000100
```

- `Object.getOwnPropertyDescriptors`：获取对象描述信息

```js
const p1 = {
  firstName: "jasper",
  lastName: "yang",
  get fullName() {
    return this.firstName + this.lastName;
  },
};
console.log(p1.fullName);
// 通过 Object.assign 方式复制对象 get 方法被当作普通属性复制过来，所以更改 lastName 并没有改变 p2
// const p2 = Object.assign({}, p1);
// p2.lastName = "wang";
// console.log(p2.fullName);
const desc = Object.getOwnPropertyDescriptors(p1);
const p2 = Object.defineProperties({}, desc);
p2.lastName = "wang";
console.log(p2.fullName); // jasperwang
```

## ECMAScript2018 概述

## ECMAScript2019 概述

## ECMAScript2020 概述
