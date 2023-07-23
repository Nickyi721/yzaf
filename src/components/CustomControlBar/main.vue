<template>
  <div class="custom-control-bar">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'CustomControlBar',
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/define.scss";

.custom-control-bar{
  padding: 10px 20px;
  background: #fff;
  text-align: center;
  border-top: 1px solid $border;
}
</style>
