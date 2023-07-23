<template>
  <i :class="icon"></i>
</template>

<script>
export default {
  name: 'CustomIcon',
  props: {
    name: String
  },
  computed: {
    icon () {
      const style = { iconfont: true }
      style['icon-' + this.name] = true
      return style
    }
  }
}
</script>
