class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }

  // 编译模板，处理文本节点和元祖节点
  compile (el) {
    Array.from(el.childNodes).forEach(node => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node)
      }

      // 判断node节点，是否有子节点，如果有子节点，要递归调用compile
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }

  // 编译文本节点，处理差值表达式
  compileText (node) {
    const reg = /\{\{(.+?)\}\}/
    if (reg.test(node.textContent)) {
      const key = RegExp.$1.trim();
      node.textContent = node.textContent.replace(reg, this.vm[key]);

      // 创建watcher对象，当数据改变更新视图
      new Watcher(this.vm, key, (newValue) => { node.textContent = newValue });
    }
  }

  // 编译元素节点，处理指令
  compileElement (node) {
    Array.from(node.attributes).forEach(attr => {
      if (this.isDirective(attr.name)) {}
        const attrName = attr.name.substr(2);
        const key = attr.value;
        const updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    })
  }

  // v-text
  textUpdater (node, value, key) {
    node.textContent = value;

    // 创建watcher对象，当数据改变更新视图
    new Watcher(this.vm, key, (newValue) => { node.textContent = newValue });
  }
  // v-model
  modelUpdater (node, value, key) {
    node.value = value;

    // 创建watcher对象，当数据改变更新视图
    new Watcher(this.vm, key, (newValue) => { node.value = newValue });

    // 双向绑定
    node.addEventListener('input', () => { this.vm[key] = node.value });
  }

  // 判断元素属性是否是指令
  isDirective (attrName) {
    return attrName.startsWith('v-');
  }

  // 判断节点是否是文本节点
  isTextNode (node) {
    return node.nodeType === 3;
  }

  // 判断节点是否是元素节点
  isElementNode (node) {
    return node.nodeType === 1;
  }
}
