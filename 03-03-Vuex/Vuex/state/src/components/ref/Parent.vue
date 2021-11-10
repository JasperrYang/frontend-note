<template>
  <div>
    <h1>ref Parent</h1>
    <child ref="c"></child>
  </div>
</template>

<script>
import child from './Child'
export default {
  components: {
    child
  },
  mounted () {
    this.$refs.c.test()
    this.$refs.c.value = 'hello input'
  }
}
</script>
