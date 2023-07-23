<template>
  <div class="custom-title" :class="{ 'custom-title-content': !block }">
    <div class="title-primary"><slot></slot></div>
    <div class="title-secondary" v-if="$slots.info"><slot name="info"></slot></div>
  </div>
</template>

<script>
export default {
  name: 'CustomTitle',
  props: {
    block: Boolean
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/define.scss";

.custom-title{
  padding: 20px;
  background: #fff;
  text-align: center;
  border-bottom: 1px solid $border;

  &.custom-title-content{
    margin-bottom: 10px;
  }

  >.title-primary{
    font-size: 20px;
    color: $text-dark;
    font-weight: bold;
  }
  >.title-secondary{
    margin-top: 10px;
    font-size: 12px;
    color: #999;
  }
}
</style>
