# router

## Hash 和 History 模式

### Hash 模式

`http://localhost.com/#/user/id`

Hash 模式基于锚点，以及 onhashchange 事件。

- 通过 `window.location.href` 改动浏览器地址， 如果只改变 `#` 后面的地址，不会触发服务端请求，会把 `#` 后的值作为路由地址
- 当地址发生变化时触发 `onhashchange` 事件，监听事件并做相应处理
- 切换显示不同的组件

### History 模式

`http://localhost.com/user/id`

History 模式基于 HTML5 中的 History API

- 通过 history.pushState() 方法改变浏览器地址，只会改变浏览器地址而不会向服务端发送请求，并把当前地址记录到浏览器的历史记录中

    - history.pushState()：不会向服务端发送请求，pushState 会在 history 栈中添加一个新的记录

    - history.replaceState()： 不会向服务端发送请求，replaceState 不会添加新的 history 栈记录，而是替换当前的url
- 监听 popstate 事件，可以监听到浏览器历史数据的变化。事情不会在 pushStash 或 replaceStash 中触发，只会在浏览器前进或回退时触发
- 根据当前路由地址找到对应组件重新渲染

**nginx**环境配置

```text
location / { root	html;
    index	index.html index.htm; #新添加内容
    #尝试读取$uri(当前请求的路径)，如果读取不到读取$uri/这个文件夹下的首页
    #如果都获取不到返回根目录中的 index.html try_files $uri $uri/ /index.html;
}
```

## 模拟实现

- 创建 VueRouter 插件，静态方法 install
    - 判断插件是否已经被加载
    - 当 Vue 加载的时候把传入的 router 对象挂载到 Vue 实列上（全局混入的目的是拿到 Vue 实列）
- 创建 VueRouter 类
    - 初始化，options、routeMap、data(路径，创建 Vue 实例作为响应式数据记录当前路径)
    - createRouteMap() 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中
    - initComponent() 创建 router-link 和 router-view 组件
    - initEvent() 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径
    - 当路径改变的时候通过当前路径在 routerMap 对象中找到对应的组件，渲染 router-view

```js
let _Vue = null;

export default class VueRouter {
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    this.data = _Vue.observable({
      current: "/",
    });
    this.createRouteMap();
    this.initComponent(_Vue);
    this.initEvent();
  }

  static install(Vue) {
    //1 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    //2 把Vue的构造函数记录在全局
    _Vue = Vue;
    //3 把创建Vue的实例传入的router对象注入到Vue实例
    // _Vue.prototype.$router = this.$options.router
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }

  // 遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
  createRouteMap() {
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }
  // 创建 router-link 和 router-view 组件
  initComponent(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickHandler,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickHandler(e) {
          // 改变地址，不发送请求，记录地址历史
          history.pushState({}, "", this.to);
          this.$router.data.current = this.to;
          // 阻住后续执行，不让超链接跳转
          e.preventDefault();
        },
      },
      // template:"<a :href='to'><slot></slot><>"
    });
    const self = this;
    Vue.component("router-view", {
      render(h) {
        const cm = self.routeMap[self.data.current];
        return h(cm);
      },
    });
  }
  // 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径
  initEvent() {
    window.addEventListener("popstate", () => {
      this.data.current = window.location.pathname;
    });
  }
}
```
