# 模拟 Vue.js 响应式原理

## 数据驱动

> 开发过程中只需要关注数据，而不需要关系数据如何渲染到视图

- 数据响应式：数据修改时，视图会随之更新，避免 DOM 操作
- 双向绑定：数据改变，视图改变；视图改变，数据改变

## 发布订阅模式和观察者模式

> 定义了对象间一种一对多的依赖关系，当目标对象的状态发生改变时，所有依赖它的对象都会得到通知。

### 观察者模式

- 发布者：具有 notify 方法，当发生变化时调用观察者对象的 update 方法
- 观察者：具有 update 方法

```js
  class Subscriber {
    constructor () {
      this.subs = []
    }

    add(sub) {
      this.subs.push(sub)
    }

    notify() {
      this.subs.forEach(handler => { handler.update() })
    }
  }

  class Observer {
    constructor (name) {
      this.name = name;
    }

    update() {
      console.log('接到通知', this.name);
    }
  }

  const subscriber = new Subscriber();
  const jack = new Observer('jack');
  const tom = new Observer('tom');

  subscriber.add(jack)
  subscriber.add(tom)

  subscriber.notify()
```

### 发布订阅模式

> 发布订阅模式与观察者模式的不同，在发布者和观察者之间引入了事件中心。使得目标对象并不直接通知观察者，而是通过事件中心来派发通知。

```js
  class EventController {
    constructor() {
      this.subs = {}
    }

    subscribe(key, fn) {
      this.subs[key] = this.subs[key] || []
      this.subs[key].push(fn)
    }

    publish(key, ...args) {
      if (this.subs[key]) {
        this.subs[key].forEach(handler => { handler(...args) });
      }
    }
  }

  const event = new EventController()
  event.subscribe('onWork', time => { console.log('上班了', time) });
  event.subscribe('offWork', time => { console.log('下班了', time); });
  event.subscribe('onLaunch', time => { console.log('吃饭了', time); });

  event.publish('offWork', '18:00:00');
  event.publish('onLaunch', '20:00:00');
```

### 总结

- **观察者模式**是由具体目标调度，事件触发时发布者会主动调用观察者的方法，所以发布者和观察者之间存在依赖
- **发布订阅模式**是由事件中心统一调度，因为发布者和订阅者二者之间没有强依赖关系

## 数据响应式核心原理

### Vue2

> 当你把一个普通的 JavaScript 对象传入 Vue 实例作为 `data` 选项，Vue 将遍历此对象所有的 property，并使用 `Object.defineProperty` 把这些 property 全部转为 `getter/setter`。`Object.defineProperty` 是 ES5 中一个无法 shim 的特性，这也就是 Vue 不支持 IE8 以及更低版本浏览器的原因。

```js
  function proxyData(data) {
    // 遍历 data 对象的所有属性
    Object.keys(data).forEach(key => {
      // 把 data 中的属性，转换成 vm 的 setter/setter
      Object.defineProperty(vm, key, {
        enumerable: true,
        configurable: true,
        get () {
          console.log('get: ', key, data[key])
          return data[key]
        },
        set (newValue) {
          console.log('set: ', key, newValue)
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
          // 数据更改，更新 DOM 的值
          document.querySelector('#app').textContent = data[key]
        }
      })
    })
  }
```

> 由于 JavaScript 的限制，Vue 不能检测以下数组的变动：
>
> - 当利用索引直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`
> - 当修改数组的长度时，例如：`vm.items.length = newLength`

`Object.defineProperty` 在数组中的表现和在对象中的表现是一致的，数组的索引就可以看做是对象中的 key 。

- 通过索引访问或设置对应元素的值时，可以触发 getter 和 setter 方法
- 通过 push 或 unshift 会增加索引，对于新增加的属性，需要再手动初始化才能被 observe 。
- 通过 pop 或 shift 删除元素，会删除并更新索引，也会触发 setter 和 getter 方法。

官方文档中对于这两点都是简要的概括为“由于JavaScript的限制”无法实现，其实原因并不是因为 `Object.defineProperty` 存在漏洞，而是出于性能问题的考虑。

### Vue3

- Proxy 是 ES 6 中新增的语法，IE 不支持，性能由浏览器优化。
- Proxy 直接监听对象，而非属性，defineProperty 监听的是对象中的某一个属性。

```js
  let vm = new Proxy(data, {
    // 执行代理行为的函数
    // 当访问 vm 的成员会执行
    get (target, key) {
      console.log('get, key: ', key, target[key])
      return target[key]
    },
    // 当设置 vm 的成员会执行
    set (target, key, newValue) {
      console.log('set, key: ', key, newValue)
      if (target[key] === newValue) {
        return
      }
      target[key] = newValue
      document.querySelector('#app').textContent = target[key]
    }
  })
```

## 实现过程

### Vue

### Observer

### Compiler

### Dep

### Watcher

### 双向绑定
