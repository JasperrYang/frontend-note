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
