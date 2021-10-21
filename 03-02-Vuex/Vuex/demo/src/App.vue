<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
    <h1>Vuex - Demo</h1>
    <!-- msg: {{ $store.state.status }} <br /> -->
    msg: {{ status }} <br />

    <h2>Getter</h2>
    <!-- upperMsg: {{ $store.getters.upperMsg }} <br /> -->
    upperMsg: {{ upperMsg }} <br />

    <h2>Mutation</h2>
    <!-- <button @click="$store.commit('changeStatus', 'reject')">Mutation</button> <br /> -->
    <button @click="changeStatus('reject')">Mutation</button> <br />

    <h2>Action</h2>
    <button @click="update('success')">Action</button> <br />

    <h2>Module</h2>
    <!-- products: {{ $store.state.products.products }} <br> -->
    products: {{ products }} <br>
    <button @click="setProducts([])">Mutation</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['status']),
    ...mapGetters(['upperMsg']),
    ...mapState('products', ['products'])
  },
  methods: {
    ...mapMutations(['changeStatus']),
    ...mapActions(['update']),
    ...mapMutations('products', ['setProducts'])
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
