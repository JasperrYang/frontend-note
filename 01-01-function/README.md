![函数式编程.png](https://upload-images.jianshu.io/upload_images/6010417-d43f385c32427453.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 概念

> 把现实世界的事物和事物之间的联系抽象到程序世界（对运算过程进行抽
> 象）

**个人理解，仅供参考，以下将用大象装进冰箱举例**

- 面向对象：在代码中，我们操作的类和实例对象。将 _冰箱_ 抽象为 _容器类_，_大象_ 抽象为 _物体类_，容器具有收纳的属性，物体具有放置的属性；可将容器类实例化为冰箱对象，物体类实例化为大象对象，操作冰箱的收纳方法和大象的放置方法完成操作。
- 函数式编程：在代码中，我们操作的是方法。将大象装进冰箱的过程梳理为一套流程，也就是一套方法，我们无需关心流程内具体发生了什么。只需要输入冰箱和大象，从而通过内部流程获得最终的结果。
- 面向过程：一步步操作，打开冰箱，装进大象，关闭冰箱。

```js
// 非函数式
let num1 = 2;
let num2 = 3;
let sum = num1 + num2;
console.log(sum);
// 函数式
function add(n1, n2) {
  return n1 + n2;
}
let sum = add(2, 3);
console.log(sum);
```

## 基础知识

### 高阶函数

> - 可以把函数作为参数传递给另一个函数
> - 可以把函数作为另一个函数的返回结果

```js
// filter 高阶函数实现
Array.prototype.filterTest = function (fn) {
  let result = [];
  for (let index = 0; index < this.length; index++) {
    if (fn(this[index])) {
      result.push(this[index]);
    }
  }
  return result;
};

let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(array.filterTest((value) => value > 5));
```

### 闭包

> **本质：函数在执行的时候会放到一个执行栈上当函数执行完毕之后会从执行栈上移除，但是堆上的作用域成员因为被外部引用不能释放，因此内部函数依然可以访问外部函数的成员**

```js
function once(fn) {
  let done = false;
  return function () {
    if (!done) {
      done = true;
      return fn.apply(this, arguments);
    }
  };
}
let pay = once((money) => {
  console.log(`支付了${money}`);
});

pay(10);
pay(10);
pay(10);
```

### 纯函数

> 相同的输入永远会得到相同的输出，[lodash](https://www.lodashjs.com/) 是一个纯函数的功能库。

**优点**

- 因为纯函数对相同的输入始终有相同的结果，所以可以把纯函数的结果缓存起来
- 纯函数让测试更方便（单元测试）
- 并行处理

```js
const _ = require("lodash");

function getArea(r) {
  return Math.PI * r * r;
}

// memoize 实现
function memoize(fn) {
  let cache = {};
  return function () {
    let arg_str = JSON.stringify(arguments);
    cache[arg_str] = cache[arg_str] || fn.apply(fn, arguments);
    return cache[arg_str];
  };
}
let getAreaWithMemory = memoize(getArea);
console.log(getAreaWithMemory(5));

// let getAreaWithMemory = _.memoize(getArea);
// console.log(getAreaWithMemory(4));
```

**副作用**

- 副作用让一个函数变的不纯，纯函数的根据相同的输入返回相同的输出，如果函数依赖于外部的状态就无法保证输出相同，就会带来副作用。

### 柯里化

> 当一个函数有多个参数的时候先传递一部分参数调用它（这部分参数以后永远不变）。然后返回一个新的函数接收剩余的参数，返回结果

```js
const _ = require("lodash");

function getSum(a, b, c) {
  return a + b + c;
}

function curry(func) {
  return function curriedFn(...args) {
    if (args.length < func.length) {
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)));
      };
    }
    return func(...args);
  };
}
let curried = curry(getSum);
console.log(curried(1)(2)(3));
console.log(curried(1, 2)(3));

// let curried = _.curry(getSum);
// curried(1)(2)(3);
// curried(1, 2)(3);
```

### 函数组合（Point Free 模式）

> 如果一个函数要经过多个函数处理才能得到最终值，这个时候可以把中间过程的函数合并成一个函数

```js
const _ = require("lodash");

// const toUpper = (s) => s.toUpperCase();
// const reverse = (arr) => arr.reverse();
// const first = (arr) => arr[0];
// const f = _.flowRight(toUpper, first, reverse);
// console.log(f(["one", "two", "three"]));

function compose(...fns) {
  return function (value) {
    return fns.reverse().reduce(function (acc, fn) {
      return fn(acc);
    }, value);
  };
}

const toUpper = (s) => s.toUpperCase();
const reverse = (arr) => arr.reverse();
const first = (arr) => arr[0];
const f = compose(toUpper, first, reverse);
console.log(f(["one", "two", "three"]));
```

## 函子

> 是一个特殊的容器，通过一个普通的对象来实现，该对象具有 map 方法，map 方法可以运行一个函数对值进行处理。

- 函子就是一个实现了 map 契约的对象
- map 方法返回一个包含新值的函子

### Functor

```js
class Container {
  constructor(value) {
    this._value = value;
  }

  map(fn) {
    return Container.of(fn(this._value));
  }

  static of(value) {
    return new Container(value);
  }
}

let result = Container.of(5)
  .map((x) => x + 1)
  .map((x) => x * x);

console.log(result._value);
```

### Maybe

> 处理外部的空值情况，防止空值的异常

```js
class Maybe {
  constructor(value) {
    this._value = value;
  }

  map(fn) {
    return this.isNull() ? Maybe.of(null) : Maybe.of(fn(this._value));
  }

  isNull() {
    return this._value === null || this._value === undefined;
  }

  static of(value) {
    return new Maybe(value);
  }
}

// let result = Maybe.of(null).map((x) => x + 1);
// console.log(result);

let result = Maybe.of(10).map((x) => x + 1);
console.log(result._value);
```

### Either

> 可以用来做异常处理

```js
class Left {
  constructor(value) {
    this._value = value;
  }

  map(fn) {
    return this;
  }

  static of(value) {
    return new Left(value);
  }
}

class Right {
  constructor(value) {
    this._value = value;
  }

  map(fn) {
    return Right.of(fn(this._value));
  }

  static of(value) {
    return new Right(value);
  }
}

function parseJson(value) {
  try {
    return Right.of(JSON.parse(value));
  } catch (e) {
    return Left.of({ error: e.message });
  }
}

let result = parseJson('{ "key": "value" }').map((x) => x.key.toUpperCase());
console.log(result);
```

### IO

> 内部封装的值是一个函数，把不纯的操作封装到这个函数，不纯的操作交给调用者处理

```js
const fp = require("lodash/fp");

class IO {
  constructor(fn) {
    this._value = fn;
  }

  map(fn) {
    return new IO(fp.flowRight(fn, this._value));
  }

  static of(x) {
    return new IO(() => x);
  }
}
let path = IO.of(process).map((p) => p.execPath);
console.log(path._value());
```

### Task 异步执行

> [folktale](https://folktale.origamitower.com/docs/v2.3.0/) 一个标准的函数式编程库

```js
const fp = require("lodash/fp");
const fs = require("fs");
const { task } = require("folktale/concurrency/task");
function readFile(filename) {
  return task((resolve) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) {
        resolve.reject(err);
      }
      resolve.resolve(data);
    });
  });
}

readFile("package.json")
  .run()
  .listen({
    onRejected: (err) => {
      console.log(err);
    },
    onResolved: (data) => {
      console.log(data);
    },
  });
```

### Monad（单子）

> 通过 join 方法避免函子嵌套

```js
const fs = require("fs");
const fp = require("lodash/fp");

class IO {
  constructor(fn) {
    this._value = fn;
  }

  static of(x) {
    return new IO(() => {
      return x;
    });
  }

  map(fn) {
    return new IO(fp.flowRight(fn, this._value));
  }

  join() {
    return this._value();
  }

  flatMap(fn) {
    return this.map(fn).join();
  }
}
let readFile = function (filename) {
  return new IO(() => {
    return fs.readFileSync(filename, "utf-8");
  });
};
let print = function (x) {
  return new IO(() => {
    console.log(x);
    return x;
  });
};
let result = readFile("package.json").flatMap(fp.toUpper).join();
console.log(result);
```
