# Vuex 数据流管理

## 组件通讯

### 父子组件传值

**通过 `props` 向子组件传递数据**

Parent

```js
<template>
  <div>
    <h1>父给子传值</h1>
    <child title="My journey with Vue"></child>
  </div>
</template>

<script>
import child from './Child'
export default {
  components: {
    child
  }
}
</script>
```

Child

```js
<template>
  <div>
    <h1>Props Down Child</h1>
    <h2>{{ title }}</h2>
  </div>
</template>

<script>
export default {
  // props: ['title'],
  props: {
    title: String
  }
}
</script>
```

### 子父组件传值

**通过监听子组件事件**

Parent

```html
<template>
  <div>
    <h1>子给父传值</h1>
    这里的文字不需要变化
    <child :fontSize="hFontSize" @enlargeText="enlargeText"></child>
  </div>
</template>

<script>
import child from './Child'
export default {
  components: {
    child
  },
  data () {
    return {
      hFontSize: 1
    }
  },
  methods: {
    enlargeText (size) {
      this.hFontSize += size
    }
  }
}
</script>
```

Child

```html
<template>
  <div>
    <h1 :style="{ fontSize: fontSize + 'em' }">Props Down Child</h1>
    <button @click="handler">文字增大</button>
  </div>
</template>

<script>
export default {
  props: {
    fontSize: Number
  },
  methods: {
    handler () {
      this.$emit('enlargeText', 0.1)
    }
  }
}
</script>
```

### 不相关组件传值

**通过 `EventBus` 事件总线**

> `EventBus` 又称为事件总线。在 Vue 中可以使用 `EventBus` 来作为沟通桥梁的概念，就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件，所以组件都可以上下平行地通知其他组件，但也就是太方便所以若使用不慎，就会造成难以维护的“灾难”，因此才需要更完善的 Vuex 作为状态管理中心，将通知的概念上升到共享状态层次。

- 初始化

首先需要创建事件总线并将其导出，以便其它模块可以使用或者监听它。我们可以通过两种方式来处理。先来看第一种，新创建一个 .js 文件，比如 eventbus.js

```js
import Vue from 'vue'
export default new Vue()
```

另外一种方式，[可以直接在项目中的 main.js 初始化全局 EventBus](http://www.imooc.com/article/289043)

- 发送事件

现在有两个不相关组件 01 和 02，当 01 组件中对应操作触发 value 变化时发送 `numchange` 事件

```html
<!-- 01 -->
<template>
  <div>
    <h1>不相关组件-01</h1>
    <div class="number" @click="sub">-</div>
    <input type="text" style="width: 30px; text-align: center;" :value="value">
    <div class="number" @click="add">+</div>
  </div>
</template>

<script>
import bus from './eventbus'

export default {
  props: {
    num: Number
  },
  created () {
    this.value = this.num
  },
  methods: {
    sub () {
      if (this.value > 1) {
        this.value--
        bus.$emit('numchange', this.value)
      }
    },
    add () {
      this.value++
      bus.$emit('numchange', this.value)
    }
  }
}
</script>

<style>
.number {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  text-align: center;
}
</style>
```

- 接收事件

```html
<!--02-->
<template>
  <div>
    <h1>不相关组件-02</h1>

    <div>{{ msg }}</div>
  </div>
</template>

<script>
import bus from './eventbus'
export default {
  data () {
    return {
      msg: ''
    }
  },
  created () {
    bus.$on('numchange', (value) => {
      this.msg = `您选择了${value}件商品`
    })
  }
}
</script>
```

### 其他通讯方式

通过 `ref` 操作子组件

Parent

```js
<template>
  <div>
    <h1>ref Parent</h1>
    <child ref="c"></child>
  </div>
</template>

<script>
import child from './Child'
export default {
  components: {
    child
  },
  mounted () {
    this.$refs.c.test()
    this.$refs.c.value = 'hello input'
  }
}
</script>
```

Child

```js
<template>
  <div>
    <h1>ref Child</h1>
    <input ref="input" type="text" v-model="value">
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    test () {
      this.$refs.input.focus()
    }
  }
}
</script>
```

## Vuex

### [Vuex 是什么？](https://vuex.vuejs.org/zh/#%E4%BB%80%E4%B9%88%E6%98%AF-%E7%8A%B6%E6%80%81%E7%AE%A1%E7%90%86%E6%A8%A1%E5%BC%8F)

#### State

Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态。

使用 mapState 简化 State 在视图中的使用，mapState 返回计算属性

- 数组参数

```js
// 该方法是 vuex 提供的，所以使用前要先导入
import { mapState } from 'vuex'
// mapState 返回名称为 count 和 msg 的计算属性
// 在模板中直接使用 count 和 msg
computed: {
  ...mapState(['count', 'msg']),
}
```

- 对象参数

```js
// 该方法是 vuex 提供的，所以使用前要先导入
import { mapState } from 'vuex'
// 通过传入对象，可以重命名返回的计算属性
// 在模板中直接使用 num 和 message
computed: {
  ...mapState({
    num: state => state.count,
    message: state => state.msg
  })
}
```

#### Getter

Getter 就是 store 中的计算属性，使用 mapGetter 简化视图中的使用

```js
import { mapGetter } from 'vuex'

computed: {
  ...mapGetter(['reverseMsg']),
  // 改名，在模板中使用 reverse
  ...mapGetter({ reverse: 'reverseMsg' })
}
```

#### Mutation

更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每
个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们
实际进行状态更改的地方，并且它会接受 state 作为第一个参数

使用 Mutation 改变状态的好处是，集中的一个位置对状态修改，不管在什么地方修改，都可以追踪到
状态的修改。可以实现高级的 time-travel 调试功能

```js
import { mapMutations } from 'vuex'
methods: {
  ...mapMutations(['increate']),
  // 传对象解决重名的问题
 ...mapMutations({ increateMut: 'increate' })
}
```

#### Action

Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

```js
import { mapActions } from 'vuex'
methods: {
  ...mapActions(['increate']),
  // 传对象解决重名的问题
  ...mapActions({ increateAction: 'increate' })
 }
```

#### Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对
象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、
mutation、action、getter、甚至是嵌套子模块

### Vuex 插件

Vuex 的 store 接受 plugins 选项，这个选项暴露出每次 mutation 的钩子。Vuex 插件就是一个函数，它接收 store 作为唯一参数：

在插件中不允许直接修改状态——类似于组件，只能通过提交 mutation 来触发变化。

```js
const myPlugin = store => {
  // 当 store 初始化后调用
  store.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}

// 使用
const store = new Vuex.Store({
  // ...
  plugins: [myPlugin]
})
```

### 严格模式

在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

```js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

## 模拟实现

- 实现 install 方法
    - Vuex 是 Vue 的一个插件，先实现 Vue 插件约定的 install 方法
- 实现 Store 类
    - 实现构造函数，接收 options
    - state 的响应化处理
    - getter 的实现
    - commit、dispatch 方法

install 方法

```js
function install(Vue) {
  _Vue = Vue;
  _Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        _Vue.prototype.$store = this.$options.store;
      }
    },
  });
}
```

Store 类

```js
class Store {
  constructor(options) {
    const { state = {}, getters = {}, mutations = {}, actions = {} } = options;
    this.state = _Vue.observable(state);
    this.getters = Object.create(null);
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state),
      });
    });
    this._mutations = mutations;
    this._actions = actions;
  }

  commit(type, payload) {
    this._mutations[type](this.state, payload);
  }

  dispatch(type, payload) {
    this._actions[type](this, payload);
  }
}
```
