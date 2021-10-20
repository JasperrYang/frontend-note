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

![实现过程](https://upload-images.jianshu.io/upload_images/6010417-09dba3a94373a54a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Vue

- 接收初始化的参数，注入到 Vue 实列 $options 属性中
- 把 data 中的属性注入到 Vue 实列 $data 属性中，并生成 getter/setter
- 调用 observer 监听 data 中属性的变化
- 调用 compiler 解析指令/插值表达式

```js
class Vue {
  constructor (options) {
    // 1. 通过属性保存选项的数据
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
    // 2. 把data中的成员转换成getter和setter，注入到vue实例中
    this._proxyData(this.$data);
    // 3. 调用observer对象，监听数据的变化
    new Observer(this.$data);
    // 4. 调用compiler对象，解析指令和差值表达式
    new Compiler(this);
  }

  _proxyData(data) {
    Object.keys(data).forEach(key => {
      // 把data的属性注入到vue实例中
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get () {
          return data[key];
        },
        set (newValue) {
          if (newValue === data[key]) {
            return;
          }
          data[key] = newValue;
        }
      })
    })
  }
}
```

### Observer

- 把 data 中的属性转换为响应式数据
- 数据变化发送通知

```js
class Observer {
  constructor(data) {
    this.walk(data);
  }

  walk(data) {
    // 1. 判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2. 遍历data对象的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  defineReactive(data, key, val) {
    // 如果val是对象，把val内部的属性转换成响应式数据
    this.walk(val)
    const that = this;
    // 收集依赖，并发送通知
    const dep = new Dep();
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get() {
        // 收集依赖
        Dep.target && dep.addSubs(Dep.target);
        return val;
      },
      set(newVal) {
        if (newVal === val) { return; }
        val = newVal;
        // 如果newValue是对象，把newValue内部的属性转换成响应式数据
        that.walk(newVal);
        // 发送通知
        dep.notify();
      }
    })
  }
}
```

### Compiler

- 编译模板，解析指令
- 页面渲染，当数据变化后重新渲染视图

```js
class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }

  // 编译模板，处理文本节点和元祖节点
  compile (el) {
    Array.from(el.childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }

      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译文本节点，处理差值表达式
  compileText (node) {
    const reg = /\{\{(.+?)\}\}/
    if (reg.test(node.textContent)) {
      const key = RegExp.$1.trim();
      node.textContent = node.textContent.replace(reg, this.vm[key]);

      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => { node.textContent = newValue });
    }
  }

  // 编译元素节点，处理指令
  compileElement (node) {
    Array.from(node.attributes).forEach(attr => {
      if (this.isDirective(attr.name)) {}
        const attrName = attr.name.substr(2);
        const key = attr.value;
        const updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    })
  }

  // v-text
  textUpdater (node, value, key) {
    node.textContent = value;

    // 创建watcher对象，当数据改变更新视图
    new Watcher(this.vm, key, (newValue) => { node.textContent = newValue });
  }
  // v-model
  modelUpdater (node, value, key) {
    node.value = value;

    // 创建watcher对象，当数据改变更新视图
    new Watcher(this.vm, key, (newValue) => { node.value = newValue });

    // 双向绑定
    node.addEventListener('input', () => { this.vm[key] = node.value });
  }

  // 判断元素属性是否是指令
  isDirective (attrName) {
    return attrName.startsWith('v-');
  }

  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3;
  }

  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1;
  }
}
```

### Dep

- 发布者
- 在 getter 中添加观察者，在 setter 中发送通知

```js
class Dep {
  constructor() {
    // 存储所有的观察者
    this.subs = [];
  }
  // 添加观察者
  addSubs(sub) {
    if (sub && sub.update) {
      this.subs.push(sub);
    }
  }
  // 发送通知
  notify() {
    this.subs.forEach(sub => { sub.update() });
  }
}
```

### Watcher

- 实例化时添加到 dep
- 数据发生变化时，dep 通知所有 watcher 实列更新视图

```js
class Watcher {
  constructor(vm, key, cb) {
    // vue 实列
    this.vm = vm;
    // data中的属性名称
    this.key = key;
    // 回调函数负责更新视图
    this.cb = cb;
    // 把watcher对象记录到Dep类的静态属性target
    Dep.target = this;
    // 触发get方法，在get方法中会调用addSub
    this.oldValue = vm[key];
    // 置空，防止影响其他属性
    Dep.target = null;
  }

  // 当数据发生变化的时候更新视图
  update() {
    const newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }
    this.cb(newValue);
  }
}
```

### 双向绑定

- 监听文本框 input 事件，更新节点 value

```js
  // 双向绑定
  node.addEventListener('input', () => { this.vm[key] = node.value });
```
