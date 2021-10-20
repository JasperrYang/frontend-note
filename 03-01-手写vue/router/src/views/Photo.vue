<template>
  <div>
    这是 Photo 页面
    <br>
    {{ num }}
    <br>
    {{ $route.params.num }}
  </div>
</template>

<script>

export default {
  name: 'Photo',
  props: ['num']
}
</script>
