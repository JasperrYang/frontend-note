<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <props-down></props-down>
    <event-up></event-up>
    <sibling01 :num="num"></sibling01>
    <sibling02></sibling02>
    <ref></ref>
  </div>
</template>

<script>
import PropsDown from './components/props-down/Parent'
import EventUp from './components/event-up/Parent.vue'
import sibling01 from './components/event-bus/Sibling-01'
import sibling02 from './components/event-bus/Sibling-02'
import ref from './components/ref/Parent'

export default {
  name: 'App',
  components: {
    PropsDown,
    EventUp,
    sibling01,
    sibling02,
    ref
  },
  data () {
    return {
      num: 1
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
