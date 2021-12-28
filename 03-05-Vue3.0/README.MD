# Vue 3.0

## Vue 3.0 性能提升主要是通过哪几方面体现的？

1. 响应式系统的升级

- Vue 2.0 使用 defineProperty
    - defineProperty 代理对象中的某个属性
    - 初始化时将 data 中的数据进行处理，如果属性时 object 类型还需要递归处理
- Vue 3.0 使用 Proxy 对象重写响应式系统
    - Proxy 代理整个对象
    - 调用时递归
    - 可以监听动态新增的属性
    - 可以监听删除的属性
    - 可以监听数组的索引和 length 属性

2. 编译优化

- Vue 2.0 中通过标记静态根节点，优化 diff 过程
- Vue 3.0 中标记和提升所有的静态根节点，diff 只需要对比动态节点内容
    - Fragments
    - 静态提升
    - Patch flag
    - 缓存事件处理函数

3. 源码体积优化

- Vue 3.0 中移除了一些不常用的 API
    - inline-tempalte、filter
- Tree-shaking

## Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

1. Vue 2.0 Options Api

> 在一个 `vue` 文件中使用 `data`、`methods`、`computed`、`watch` 定义属性和方法，共同处理页面逻辑

**问题：当组件开始变得更大时，逻辑关注点的列表也会增长。尤其对于那些一开始没有编写这些组件的人来说，这会导致组件难以阅读和理解。**

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // 使用 `this.user` 获取用户仓库
    }, // 1
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

2. Vue 3.0 Composition Api

> 在 Composition API 中，代码是根据逻辑功能来组织的，一个功能的所有 API 会放在一起（高内聚，低耦合）

```js
// src/components/UserRepositories.vue
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

## Proxy 相对于 Object.defineProperty 有哪些优点？

- defineProperty 代理对象中的某个属性，Proxy 代理整个对象
- defineProperty 无法监控到数组下标的变化， Proxy 可以

## Vue 3.0 在编译方面有哪些优化？

- Vue 2.0 中通过标记静态根节点，优化 diff 过程
- Vue 3.0 中标记和提升所有的静态根节点，diff 只需要对比动态节点内容
    - Fragments
    - 静态提升
    - Patch flag
    - 缓存事件处理函数

## Proxy 和 Reflect 中的 receiver 指向问题？

Proxy 中的 receiver 指向 proxy 实例

```js
const proxy = new Proxy({}, {
  get: function(target, key, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true
```

Reflect 中的 receiver

- 如果属性部署了读取函数（getter），则读取函数的 this 绑定 receiver。

```js
var myObject = {
  foo: 1,
  bar: 2,
  get baz() {
    return this.foo + this.bar;
  },
};

var myReceiverObject = {
  foo: 4,
  bar: 4,
};

Reflect.get(myObject, 'baz', myReceiverObject) // 8
```

- Reflect.set 一旦传 receiver，就会将属性赋值到 receiver 上面（即obj），导致触发 defineProperty 拦截

```js
      let p = {
        a: "a",
      };

      let handler = {
        set(target, key, value, receiver) {
          console.log("set");
          Reflect.set(target, key, value, receiver);
        },
        defineProperty(target, key, attribute) {
          console.log("defineProperty");
          Reflect.defineProperty(target, key, attribute);
        },
      };

      let obj = new Proxy(p, handler);
      obj.a = "A";
      // set
      // defineProperty
```

## Vue.js 3.0 响应式系统的实现原理？
