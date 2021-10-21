<template>
  <div>
    <h1>父给子传值</h1>
    <child title="My journey with Vue"></child>
  </div>
</template>

<script>
import child from './Child'
export default {
  components: {
    child
  }
}
</script>
