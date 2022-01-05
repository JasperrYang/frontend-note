# JavaScript 性能优化

## 垃圾回收

### 内存管理

> JavaScript 没有提供操作内存的 API，一切内存操作都是自动的。

- 申请
- 使用
- 释放

### 何为垃圾

- 对象不再被引用
- 对象不能从根上访问到

### 可达对象

- 可以访问到的对象（引用、作用域链）
- 标准是从根出发是否能被找到
- JavaScript 中的根可以理解为全局变量对象

## GC 算法

- GC 就是垃圾回收机制的简写
- GC 可以找的内存中的垃圾、并释放和回收空间
  - 程序中不再需要使用的对象
  - 程序中不能在访问到的对象
- 算法就是工作时查找和回收所遵循的规则

### 引用计算算法

> **核心思想**：设置引用计数器，引用关系改变时修改引用数字，当引用数字为 0 时立即回收

#### 优点

- 发现垃圾立即回收
- 最大限度减少程序暂停（GC 时程序是暂停的）

#### 缺点

- 无法回收循环引用的对象

```js
// 当 fn 执行完毕后，obj1 和 obj2 将不在被全局引用，计数器应该为 0
// 但 obj1 和 obj2 在方法内还存在指向关系，所以计数器不为 0，无法被回收
function fn() {
  const obj1 = {};
  const obj2 = {};

  obj1.name = obj2;
  obj2.name = obj1;

  return "haha";
}

fn();
```

- 时间开销大（监控维护计数器）

### 标记清除算法

> **核心思想**：分为标记和清楚两个阶段。第一阶段便利所有对象标记活动对象（可达对象），第二阶段便利所有对象清楚没有被标记的对象，最后回收相应的空间。

![图解](https://upload-images.jianshu.io/upload_images/6010417-8d2812784a889cde.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 优点

- 相比于引用计算算法，标记清除可以清除掉没有被引用的对象

#### 缺点

- 空间碎片化

![空间碎片化](https://upload-images.jianshu.io/upload_images/6010417-00ee703f7da8f8c1.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

如上图，GC 进行操作时发现只有中间对象可达进行标记，左右两边对象进行清除。在我们下次进行内存分配时假设需求 3 个域大小的内存，但目释放出来的空间因为不连续所以只有两个，需要开辟新的内存空间，造成浪费。

### 标记整理算法

> **核心思想**：标记整理可以看作是标记清除的增强，在标记阶段是完全一致的，在清除阶段会先执行整理，使空间连续，再去清除。

![标记整理](https://upload-images.jianshu.io/upload_images/6010417-106015c3f724789f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 认识 V8

- V8 是一款主流的 JavaScript 执行引擎
- V8 采用即时编译
- V8 内存设限(64 为 1.5g / 32 位 800m)

### 回收策略

> 采用分代回收的思想，将内存分为新生代和老生代。针对不同对象采用不同的算法

![Untitled Diagram (3).jpg](https://upload-images.jianshu.io/upload_images/6010417-1a1a495de237b912.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 新生代

- 新生代指存活时间较短的对象(局部作用域等)。
- 小空间用户存储新生代对象(32M|16M)

#### 回收过程

- 回收过程采用复制算法 + 标记整理
- 新生代将内存分为两个等大小的空间
  - 使用空间为 From，空闲空间为 To
- 活动对象存储在 From 空间
- 标记整理后将活动对象拷贝至 To
- From 进行释放
- From 与 To 交换空间完成释放

**说明**：一轮 GC 后还存活的新生代需要晋升（将新生代对象移动到老生代），To 空间使用率超过 25% 也需要晋升

### 老生代

- 放置在右侧老生代区域(1.4G|700G)
- 老年代对象就是指存活时间较长的对象（全局属性、闭包等）

#### 回收过程

- 主要采用标记清除、标记整理、增量标记算法
- 首先使用标记清除完成垃圾空间回收
- 采用标记整理进行空间优化（晋升）
- 采用增量标记进行效率优化（GC 与程序交替进行）

#### 对比

- 新生代区域垃圾回收使用空间换时间
- 老生代区域垃圾回收不适合复制算法，因为数据量大

## 性能优化

- 缓存数据
- 减少访问层级
- 减少判断层级
- 减少循环体活动

## 防抖与节流

- 防抖：高频点击操作我们可以人为控制是第一次还是最后一次
- 节流：高频操作我们可以自己设置频率，让本来会触发多次的事件可以按照我们定义的频率执行

### 防抖

```js
var oBtn = document.getElementById("btn");
/**
 * handle 需要执行的事件
 * wait 事件触发多久后开始执行
 * immediate 控制是第一次执行还是最后一次
 * */
function myDebounce(handle, wait = 1000, immediate = false) {
  let timer = null;
  return function proxy() {
    clearTimeout(timer);
    const init = immediate && !timer;
    // immediate = false 也就是最后一次执行时触发
    timer = setTimeout(() => {
      timer = null;
      !immediate ? handle() : null;
    }, wait);
    // immediate = true 也就是第一次执行时触发
    // 立即执行也需要依赖于 setTimeout 控制时间，当 timer 为空时执行
    init ? handle() : null;
  };
}

function btnClick() {
  console.log("点击了");
}

oBtn.onclick = myDebounce(btnClick, 500, true);
```

### 节流

```js
function scrollFn() {
  console.log("滚动了");
}
/**
 * wait 频率
 * now 现在时间
 * pervious 上次执行时间
 * wait - (now - previous)
 * 如上述计算结果是大于0的，就意味着当前操作是一个高频的，我们就要想办法让他不去执行handle
 * 如果小于0，那就是一个非高频的，那么就可以直接触发handler
 * */
function myThrottle(handle, wait = 1000) {
  let previous = 0; // 上一次执行时间
  let timer = null;
  return function proxy() {
    let now = new Date(); // 当前次执行时间
    let interval = wait - (now - previous);
    if (interval <= 0) {
      // 非高频次可以立即执行
      // 防止浏览器监听触发的事件和我们节流的时间重合，只走第一个if
      clearTimeout(timer);
      timer = null;
      handle();
      previous = new Date();
    } else if (!timer) {
      // 当系统中已经有一个定时器再等待，那么就不需要再次开启一个定时器
      // 高频次，等待 interval 执行
      timer = setTimeout(() => {
        clearTimeout(timer); // 是清除了定时器，但 timer 值还在
        timer = null;
        handle();
        previous = new Date();
      }, interval);
    }
  };
}

window.onscroll = myThrottle(scrollFn, 2000);
```
