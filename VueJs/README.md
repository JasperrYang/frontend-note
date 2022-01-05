# Vue.js 源码分析

## 简述 Vue 首次渲染的过程。

![Vue首次渲染过程.png](https://upload-images.jianshu.io/upload_images/6010417-6911e88046677f05.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 1.Vue 初始化，调用 new Vue() 之前，已经初始化完毕

- 实例成员
    - _init() 方法
    - $data、$props、$set、$delete、$watch 属性
    - _update、$forceUpdate、$destroy 生命周期相关方法
    - $on、$once、$off、$emit 事件
    - $nextTick、_render 方法
- 静态方法
    - config、observable、util 对象
    - options 对象，并扩展 components、directives、filters、_base 方法
    - set、delete、nextTick 方法
    - keep-alive 组件
    - Vue.use()、Vue.mixin()、 Vue.extend()、Vue.directive()、 Vue.component()、Vue.filter()
- 平台相关
    - 全局之类：v-model、v-show
    - 全局组件：v-transition、v-transition-group
    - 全局方法：`__patch__`、$mount
    - $mount
    - Vue.compile()

### 2.实例化 Vue，调用 this._init() 方法

- vm 的生命周期相关变量初始化，$children/$parent/$root/$refs
- vm 的事件监听初始化，父组件绑定在当前组件上的事件
- vm 的编译 render 初始化，$slots/$scopedSlots/_c/$createElement/$attrs/$listeners
- **beforeCreate 生命钩子回调**
- 把 inject 的成员注入到 vm 上
- 初始化 vm 的 _props/methods/_data/computed/watch
- 初始化 provide
- 调用 `entry-runtime-with-compiler.js`入口文件中的 `this.$mount`
- **created 生命钩子回调**

### 3.编译模板，此处有两个 `this.$mount` 函数

- `entry-runtime-with-compiler.js`文件中的 `this.$mount`，这个`$mount()` 的核心作用是帮我们把模板编译成 render 函数
    - 将 `/src/platforms/web/runtime/index.js`文件中的 `this.$mount` 中的 `$mount` 保存后重写
    - 判断 options 中是否存在 render 函数，如果存在直接调用 `/src/platforms/web/runtime/index.js` 中的 `$mount`
    - 不存在则将编译 template 模板
        - 获取 options 中的 template，如果不存在则将获取 el 的 outerHTML 作为模板
        - 如果存在的话获取对应 DOM 对象的 innerHTML 作为模板
            - 如果 template 类型是 string 类型，获取 id 选择器
            - 如果 template 是元素节点，返回元素的 innerHTML
            - 如果以上都不是，警告并返回当前实例
        - 调用 compileToFunctions 将 template 转为 render 函数
    - 调用`/src/platforms/web/runtime/index.js` 中的 `$mount`
- `/src/platforms/web/runtime/index.js`文件中的 `this.$mount`
    - 重写获取 el，防止运行时版本没有执行上一步
    - 调用 mountComponent 开始挂载组件

### 4.挂载组件，页面渲染

- 判断是否有 render 选项，如果没有并且是开发环境并传入了 template 发送警告
- **beforeMount 生命钩子回调**
- 定义 updateComponent，这个方法最终会调用 `vm._update` 对比更新视图，这里只是定义
- 创建 watcher 实例，将 updateComponent 当作参数传入。
    - watcher 构造函数中会调用 watcher.get() 方法，get() 方法中会调用 `updateComponent` 函数
    - 调用 vm._render() 创建 VNode
    - 调用 vm.update() 挂载真实 DOM
- **mounted 生命钩子回调**
- 返回 Vue 实例

## 简述 Vue 响应式原理。

![Vue 响应式原理.png](https://upload-images.jianshu.io/upload_images/6010417-1d2bb77174f76672.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 在Vue实例化时调用 init() 方法中的 initState() 方法进行 Vue 实例状态的初始话，其中 initData() 是把 data 属性注入到 Vue 实例上并且调用 observe(data) 将 data 对象转化为响应式对象
- observe 是响应式的入口
    - 首先进行了数据格式的验证，判读是否是对象类型
    - 再检查了 data 是否存在 `__ob__` 属性，以此判断当前 data 是否已经做过响应式处理
    - 如果以上情况均正常（是对象类型且不存在`__ob__` 属性），实例化 observer 对象
- 实例化 observer 对象
    - 给当前的 data 对象定义不可枚举的 `__ob__` 属性，记录当前的 observer 对象
    - 判断当前 data 的类型，对数组和对象类型的数据做不同的处理
        - 数组
            - 保留数组原来的 `pop`,`push`,`shift`,`unshift`,`splice`,`sort`,`reverse` 方法
            - 调用 Object.defineProperty() 重新定义数组方法，重新遍历数组元素设置为响应式数据
        - 对象
            - 遍历对象的每一个属性，对每个属性调用 defineReactive 方法
- defineReactive 会为每一个属性创建对应的 dep 对象，让 dep 去收集依赖，如果当前属性的值是对象，会递归调用 observe。defineReactive 中最核心的方法是 getter 和 setter。getter 的作用是收集依赖，收集依赖时, 为每一个属性收集依赖，如果这个属性的值是对象，那也要为子对象收集依赖，最后返回属性的值，在为子属性添加或删除属性时发送通知。在 setter 中，先保存新值，如果新值是对象，也要调用 observe ，把新设置的对象也转换成响应式的对象,然后派发更新（发送通知），调用 dep.notify()
- 收集依赖时，在 watcher 对象的 get 方法中调用 pushTarget, 记录 Dep.target 属性，访问 data 中的成员的时候收集依赖，defineReactive 的 getter 中添加依赖，把属性对应的 watcher 对象添加到 dep 的 subs 数组中，给 childOb 收集依赖，目的是子对象添加和删除成员时发送通知。
- 在数据发生变化的时候，会调用 dep.notify() 发送通知，dep.notify() 会调用 watcher 对象的 update() 方法，update() 中的调用的 queueWatcher() 会去判断 watcher 是否被处理，如果这个 watcher 对象没有的话添加到 queue 队列中，并调用 flushScheduleQueue()，flushScheduleQueue() 触发 beforeUpdate 钩子函数调用 watcher.run()：run()-->get() --> getter() --> updateComponent()
- 然后清空上一次的依赖

- 触发actived的钩子函数

- 触发updated钩子函数

## 简述虚拟 DOM 中 Key 的作用和好处。

sameVnode 方法在比较判断两个 Vnode 是否相同节点时是通过 tag 和 key 判断的，通过设置 key 可以有效判断两个节点是否相同。

```js
function sameVnode (a, b) {
 return (
   a.key === b.key && (
     (
       a.tag === b.tag &&
       a.isComment === b.isComment &&
       isDef(a.data) === isDef(b.data) &&
       sameInputType(a, b)
     ) || (
       isTrue(a.isAsyncPlaceholder) &&
       a.asyncFactory === b.asyncFactory &&
       isUndef(b.asyncFactory.error)
     )
   )
 )
}
```

在 updateChildren 方法中进行 Diff 算法时，设置 key 可以更有效的判断两个节点，减少 patchVnode 方法的调用，以及 DOM 渲染的次数提高性能。

```js
// patch 函数
if (!isRealElement && sameVnode(oldVnode, vnode)) { //新旧
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
 } else {
   // 新旧Vnode 都存在且不相同时，删除旧Vnode，添加新的Vnode。
 }
```

## 简述 Vue 中模板编译的过程。

![模板编译过程.png](https://upload-images.jianshu.io/upload_images/6010417-770c6955f959e5e0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 判断是否传入了 template，没有的话，则获取 el 节点的 outerHTML 作为 template
- 从缓存中加载编译过的 render 函数，缓存中没有则调用 compile 编译
- 调用 compile 函数，合并 options 后调用 baseCompile 方法
- parse 将模板字符串的模板编译转换成 AST 抽象语法树
- optimize 对 AST 进行静态节点标记，主要用来做虚拟DOM的渲染优化
- 通过 generate 将 AST 抽象语法树转换为 render 函数的 js 字符串
- 将 render 函数返回的 js 字符串函数通过 createFunction 转换为 一个可以执行的函数
- 将可执行的 render 函数挂载到 option 中
- 执行公共的 mount 函数
