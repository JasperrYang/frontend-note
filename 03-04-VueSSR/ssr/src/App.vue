<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <div><input type="" v-model="message"></div>
    <button @click="onClick">onClick</button>
    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
      <li>
        <router-link to="/posts">Posts</router-link>
      </li>
    </ul>

    <!-- 路由出口 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      message: 'vue-ssr'
    }
  },
  methods: {
    onClick () {
      console.log('Hello World!')
    }
  }
}
</script>

<style>

</style>
