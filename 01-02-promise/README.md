# 异步编程

![异步编程.png](https://upload-images.jianshu.io/upload_images/6010417-3d14b33cd456e8a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 同步与异步

- 同步：按代码顺序依次执行
- 异步：先执行同步代码，完成后再执行异步代码

```js
// 同步
console.log("begin");

function output() {
  console.log("this is output function");
}
output();

console.log("end");
// 输出
// begin
// this is output function
// end

// 异步
console.log("begin");

setTimeout(function timer1() {
  console.log("timer1 invoke");
}, 3000);

setTimeout(function timer2() {
  console.log("timer2 invoke");

  setTimeout(function inner() {
    console.log("inner invoke");
  }, 1000);
}, 1000);

console.log("end");
// 输出
// begin
// end
// timer2 invoke
// inner invoke
// timer1 invoke
```

- **事件循环与消息队列**：当代码执行到异步方法时，会把异步方法放入消息队列中。在所有同步方法执行完成之后，通过事件循环从消息队列中按压栈顺序读取其中的方法执行。

## 回调函数

> 传入一个函数，表示任务执行结束后要做的事情

```js
// 回调函数

function foo(callback) {
  setTimeout(function () {
    callback();
  }, 3000);
}
```

## Promise

> `Promise` 是一个对象，从它可以获取异步操作的消息。三种状态：`Pending`（进行中）、`Resolved`（已完成）和 `Rejected`（已失败）。

- **状态不受外界影响**：只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态
- **状态不可逆**：`Promise` 对象的状态改变，只有两种可能：从 `Pending` 变为 `Resolved` 和从 `Pending` 变为 `Rejected`

`Promise` 构造函数接受一个函数作为参数，该函数的两个参数分别是 `resolve` 和 `reject`。

```js
const promise = new Promise((resolve, reject) => {
  resolve("true");
  reject("false");
});

promise.then(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.log(error);
  }
);
```

此外，`Promise` 对象提供统一的接口，使得控制异步操作更加容易。

### `then`

> 为 `Promise` 实例添加状态改变时的回调函数，`then` 方法的第一个参数是 `Resolved` 状态的回调函数，第二个参数（可选）是 `Rejected` 状态的回调函数。

```js
function add(data, index) {
  return new Promise((resolve, reject) => {
    try {
      resolve(data * index);
    } catch (error) {
      reject(new Error(error));
    }
  });
}
add(10, 1)
  .then(
    (value) => {
      console.log(value);
      return value;
    },
    (error) => {
      console.log(error);
    }
  )
  .then((value) => {
    console.log(value + 1);
  });
```

### `catch`

> 用于指定发生错误时的回调函数。

```js
// then
promise.then(
  function (data) {
    // success
  },
  function (err) {
    // error
  }
);

// catch
promise
  .then(function (data) {
    // success
  })
  .catch(function (err) {
    // error
  });
```

上面代码中，`catch` 可以捕获调用链中所有的异常，`then` 的第二个参数只能捕获前一步的异常，同时，使用 `catch` 更接近我们代码中的 `try/catch` 操作，所以建议使用 `catch` 处理异常而不是依赖于`then` 的第二个参数

### `all`

> 该方法方法接受一个数组作为参数，用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

- 只有所有的 `Promise` 实例状态变为 `fulfilled`，最终执行结果状态才会为 `fulfilled`

- 只要有一个 `Promise` 实例为 `rejected`，那执行结果就会变为 `rejected`，此时第一个被 `reject` 的实例的返回值，会传递给回调函数

- 允许按照异步代码的调用顺序得到异步代码的执行结果

```js
let p1 = setTimeout(function timer1() {
  console.log("p1");
}, 1000);

let p2 = setTimeout(function timer1() {
  console.log("p2");
}, 2000);

let p3 = setTimeout(function timer1() {
  console.log("p3");
}, 3000);
Promise.all([p1, p2, p3]);
// 输出
// p1
// p2
// p3
```

### `race`

> 同样是将多个 Promise 实例，包装成一个新的 Promise 实例。**与 `all` 不同的是，只要有一个实例状态改变，最终的状态就就跟着改变。率先改变的 `Promise` 实例的返回值，就传递给回调函数。**

### `resolve`

> 将现有对象转为 `Promise` 对象

### `finally`

> 用于指定不管 `Promise` 对象最后状态如何，都会执行的操作。

### 宏任务与微任务

- `setTimeout` 的回调是 **宏任务**，进入回调队列排队
- `Promise` 的回调是 **微任务**，本轮调用末尾直接执行

## Generator

> 是一个状态机，封装了多个内部状态。

- `function` 关键字与函数名之间有一个星号
- 函数体内部使用 `yield` 语句，定义不同的内部状态

```js
function* helloWorld() {
  yield "hello";
  yield "world";
  return "ending";
}

var hw = helloWorld();

console.log(hw.next());
// { value: 'hello', done: false }

console.log(hw.next());
// { value: 'world', done: false }

console.log(hw.next());
// { value: 'ending', done: true }

console.log(hw.next());
// { value: undefined, done: true }
```

## async/await

> Generator 函数的语法糖。

```js
var fs = require("fs");

var readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function (error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
};

// let gen = function* () {
//   var f1 = yield readFile("./users.json");
//   var f2 = yield readFile("./posts.json");
//   // console.log(f1.toString());
//   // console.log(f2.toString());
// };

// var x = gen();

// console.log(x.next().value.then((value) => console.log(value.toString())));

// console.log(x.next().value.then((value) => console.log(value.toString())));

// console.log(x.next());

// console.log(x.next());

async function asyncReadFile() {
  var f1 = await readFile("./users.json");
  var f2 = await readFile("./posts.json");
  console.log(f1.toString());
  console.log(f2.toString());
}

asyncReadFile();
```

`async` 函数就是将 `Generator` 函数的星号（\*）替换成 `async`，将 `yield` 替换成 `await`，仅此而已。
