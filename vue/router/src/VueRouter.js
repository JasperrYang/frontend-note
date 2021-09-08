let _Vue = null;

export default class VueRouter {
  constructor (options) {
    console.log(options);
    this.routerMap = {}
    this.options = options
    this.data = _Vue.observable({
      current: '/'
    })
  }

  static install(Vue) {
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      },
    })
    _Vue = Vue
  }

  init() {
    this.createRouterMap()
    this.initComponents(_Vue)
  }

  createRouterMap() {
    this.options.routes.forEach(route => {
      console.log(route);
      this.routerMap[route.path] = route.component
    })
  }

  initComponents(Vue) {
    Vue.component('router-link', {
      props: { to: String },
      template: '<a :href="to"><slot></slot></a>'
    })
  }
}
