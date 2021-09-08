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
