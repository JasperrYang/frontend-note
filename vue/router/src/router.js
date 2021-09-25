import Vue from "vue";
// import VueRouter from "vue-router";
import VueRouter from "./VueRouter.js";
import Index from './views/Index.vue'
import Layout from './components/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        name: 'index',
        path: '',
        component: Index
      },
      {
        path: '/blog',
        name: 'Blog',
        component: () => import(/* webpackChunkName: "blog" */ './views/Blog.vue')
      },
      {
        path: '/photo/:num',
        props: true,
        name: 'Photo',
        component: () => import(/* webpackChunkName: "photo" */ './views/Photo.vue')
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: "404" */ './views/404.vue')
  }
]

export default new VueRouter({ routes })
