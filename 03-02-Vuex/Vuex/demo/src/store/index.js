import Vue from 'vue'
import Vuex from 'vuex'
import products from './modules/products'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: 'pending'
  },
  mutations: {
    changeStatus(state, status) {
      state.status = status
    }
  },
  actions: {
    update(context, status) {
      setTimeout(() => {
        context.commit('changeStatus', status)
      }, 2000)
    }
  },
  modules: {
    products,
    cart
  },
  getters: {
    upperMsg (state) {
      return state.status.toUpperCase();
    }
  }
})
