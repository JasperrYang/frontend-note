<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <div><input type="" v-model="message"></div>
    <div><button @click="onClick" >点击</button></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      message: '首页1'
    }
  },
  methods: {
    onClick () {
      console.log('Hello World!')
      console.log(111);
    }
  }
}
</script>

<style>

</style>
