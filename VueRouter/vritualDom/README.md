# Virtual DOM

## 虚拟 DOM

> 普通 JS 对象描述 DOM 对象

DOM 对象：成员多，成本高

![image.png](https://upload-images.jianshu.io/upload_images/6010417-0591fe26c2954d64.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

虚拟 DOM

```js
{
    sel: 'div', //节点的选择器
    data: {}, // 一个存储节点属性的对象，对应节点的sel[prop]属性，例如onclick , style
    text: 'Hello', //如果是文本节点，对应文本节点的textContent，否则为null
    children: undefined,  //存储子节点的数组，每个子节点也是vnode结构
    elm: undefined, //对真实的节点的引用
    key: 'msg',
}
```

### 为什么使用虚拟 DOM

- 维护视图和状态的关系，虚拟 DOM 可以维护程序状态，跟踪上一次的状态
- 复杂视图情况下提升渲染性能，通过比较前后两次差异更新真实 DOM
- 跨平台
    - 浏览器平台渲染 DOM
    - 服务端渲染 SSR(Nuxt.js/Next.js)
    - 原生应用(Weex/React Native)
    - 小程序(mpvue/uni-app)

### 虚拟 DOM 库

- [Snabbdom](https://github.com/snabbdom/snabbdom)
    - Vue2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom
    - 通过模块可扩展
    - 源码使用 TypeScript
- virtual-dom

## Snabbdom

```js
// 1. 导入模块
import { init, h, styleModule, eventListenersModule } from 'snabbdom';

// 2. 注册模块
const patch = init([
  styleModule,
  eventListenersModule
]);

// 3. 使用h() 函数的第二个参数传入模块中使用的数据（对象）
let vnode = h(
  'div',
  [
    h(
      'h1',
      {
        style: {
          backgroundColor: 'red'
        }
      },
      'Hello World'
    ),
  h(
    'p',
    {
      on: {
        click: eventHandler
      }
    },
    'this is button'
  )
])

function eventHandler () {
  alert('hello')
}

let app = document.querySelector('#app')
patch(app, vnode)

```

init

- 挂载hooks函数，接收一个模块列表数组，返回 patch 函数

```js
import { classModule, styleModule } from "snabbdom";

const patch = init([classModule, styleModule]);
```

patch

- init 函数返回，接受两个参数，第一个代表当前视图的 DOM 元祖或 Vnode（如果是 DOM 将会转为 Vnode），第二个表示新的 Vnode。
- 如果传入一个带有父元素的 DOM 元素，传入的元素会被转换为 DOM 的 newVnode 替换。如果传入的是 oldVnode，snabbdom 将匹配更新 Vnode。

```js
patch(oldVnode, newVnode);
```

h

- 接收一个字符串类型的标签/选择器，一个可选的数据对象和一个可选的字符串或子数组。

```js
import { h } from "snabbdom";

const vnode = h("div", { style: { color: "#000" } }, [
  h("h1", "Headline"),
  h("p", "A paragraph"),
]);
```

Hooks

- Snabbdom 提供了丰富的钩子选择。钩子既被模块用来扩展 Snabbdom，也被用在普通代码中，用于在虚拟节点的生命周期中的所需时间点执行任意代码。
- Snabbdom 支持以为几种钩子: `pre`, `create`, `update`, `destroy`, `remove`, `post`

```js
h("div.row", {
  key: movie.rank,
  hook: {
    insert: (vnode) => {
      movie.elmHeight = vnode.elm.offsetHeight;
    },
  },
});
```

## Diff 算法

![传统diff](https://upload-images.jianshu.io/upload_images/6010417-f53c2ae479b8b0ea.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> Snbbdom 根据 DOM 的特点对传统的diff算法做了优化，只比较同级别的节点

![snbbdom diff](https://upload-images.jianshu.io/upload_images/6010417-98f01d2f3935a42d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 执行过程

> `oldCh` 和 `newCh` 各有两个头尾的变量 `oldStartIdx` 、 `oldEndIdx`、 `newStartIdx`、`newEndIdx`，它们的 2 个变量相互比较，一共有 4 种比较方式。如果4种比较都没匹配，如果设置了 `key`，就会用 `key` 进行比较，在比较的过程中，变量会往中间靠，一旦 `newStartIdx > newEndIdx` 或 `oldStartIdx > oldEndIdx` 表明 `oldCh` 和 `newCh` 至少有一个已经遍历完了，就会结束比较。

- 循环遍历比对
    - `oldStartVnode` | `newStartVnode`
        ![image.png](https://upload-images.jianshu.io/upload_images/6010417-3cfcb752d3c7c59d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        - 如果新旧开始节点是 sameVnode (key 和 sel 相同)
        - 调用 patchVnode() 对比和更新节点
        - 把旧开始和新开始索引往后移动 oldStartIdx++ / newStartIdx++
        - 如果新旧节点不是 sameVnode，则进行下一步比对
    - `oldEndVnode` | `newEndVnode`
        - 如果新旧开始节点是 sameVnode (key 和 sel 相同)
        - 调用 patchVnode() 对比和更新节点
        - 把旧开始和新开始索引往前移动 oldStartIdx-- / newStartIdx--
        - 如果新旧节点不是 sameVnode，则进行下一步比对
    - `oldStartVnode` | `newEndVnode`
    ![image.png](https://upload-images.jianshu.io/upload_images/6010417-56385938d9b62dbd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        - 如果新旧开始节点是 sameVnode (key 和 sel 相同)
        - 调用 patchVnode() 对比和更新节点
        - 把 oldStartVnode 对应的 DOM 元素，移动到右边，更新索引
        - 如果新旧节点不是 sameVnode，则进行下一步比对
    - `oldEndVnode` | `newEndVnode`
    ![image.png](https://upload-images.jianshu.io/upload_images/6010417-d12e302d14226fbd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        - 如果新旧开始节点是 sameVnode (key 和 sel 相同)
        - 调用 patchVnode() 对比和更新节点
        - 把 oldEndVnode 对应的 DOM 元素，移动到左边，更新索引
        - 如果新旧节点不是 sameVnode，则进行下一步比对
    - 非上述四种情况
    ![image.png](https://upload-images.jianshu.io/upload_images/6010417-cda9169d69162e57.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        - 遍历新节点，使用 newStartNode 的 key 在老节点数组中找相同节点
        - 如果没有找到，说明 newStartNode 是新节点，创建新节点对应的 DOM 元素，插入到 DOM 树中
        - 如果找到了，判断新节点和找到的老节点的 sel 选择器是否相同
            - 如果不相同，说明节点被修改了，重新创建对应的 DOM 元素，插入到 DOM 树中
            - 如果相同，把 elmToMove 对应的 DOM 元素，移动到左边

- 循环结束
    - 当老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)， 循环结束
![image.png](https://upload-images.jianshu.io/upload_images/6010417-95e50a91005423f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

        - 说明新节点有剩余，把剩余节点批量插入到右边
    - 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，循环结束
    ![image.png](https://upload-images.jianshu.io/upload_images/6010417-35c51fe429cb9a38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

        - 说明老节点有剩余，把剩余节点批量删除

### key 的作用

- 通过 key 值来精确地判断两个节点是否为同一个，从而避免频繁更新不同元素，减少不必要的DOM操作，提高性能。
- 使用同标签名元素的过渡切换是也需要加key属性，让他们区分开来，否则虚拟 DOM 同标签名只会更新内容
