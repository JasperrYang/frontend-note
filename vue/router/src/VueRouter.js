let _Vue = null;

export default class VueRouter {
  constructor (options) {
    this.routerMap = {}
    this.options = options
    this.data = _Vue.observable({
      current: '/'
    })
    this.init()
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
      this.routerMap[route.path] = route.component
      if (route.children) {
        route.children.forEach(children => {
          this.routerMap[children.path] = children.component
        })
      }
    })
  }

  initComponents(Vue) {
    Vue.component('router-link', {
      props: { to: String },
      render(h){
        return h("a",{
            attrs:{
                href:this.to
            },
            on:{
                click:this.clickHandler
            }
        },[this.$slots.default])
    },
    methods:{
      clickHandler(e){
            history.pushState({}, "", this.to)
            this.$router.data.current = this.to
            e.preventDefault()
        }
    }
    })
    const self = this

    Vue.component("router-view",{
        render(h){
          console.log(self.routerMap);
          console.log(self.data.current);
            const cm=self.routerMap[self.data.current]
            return h(cm)
        }
    })
  }
}
