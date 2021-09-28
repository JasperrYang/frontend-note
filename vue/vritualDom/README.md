# Virtual DOM

## 虚拟 DOM

> 普通 JS 对象描述 DOM 对象

DOM 对象：成员多，成本高

![image.png](https://upload-images.jianshu.io/upload_images/6010417-0591fe26c2954d64.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

虚拟 DOM

```js
{
    sel: 'div',
    data: {},
    text: 'Hello',
    key: 'msg',
    children: undefined,
    elm: undefined,
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

##
