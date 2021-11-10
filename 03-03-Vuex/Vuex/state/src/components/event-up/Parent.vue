<template>
  <div>
    <h1>子给父传值</h1>
    这里的文字不需要变化
    <child :fontSize="hFontSize" @enlargeText="enlargeText"></child>
  </div>
</template>

<script>
import child from './Child'
export default {
  components: {
    child
  },
  data () {
    return {
      hFontSize: 1
    }
  },
  methods: {
    enlargeText (size) {
      this.hFontSize += size
    }
  }
}
</script>
