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
