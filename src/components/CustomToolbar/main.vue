<template>
  <div class="custom-toolbar" :class="{'custom-toolbar-border' : border}">
    <div class="toolbar-left" v-if="$slots.left">
      <slot name="left"></slot>
    </div>
    <div class="toolbar-right">
      <el-button-group>
        <slot></slot>
      </el-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomToolbar',
  props: {
    border: Boolean
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/define.scss";

.custom-toolbar{
  overflow: hidden;
  padding: 10px;

  &.custom-toolbar-border{
    border-bottom: 1px solid $border;
  }

  >.toolbar-left{
    float: left;
    >span{
     font-size: 14px; 
     line-height: 28px;
     vertical-align: middle;
    }
  }
  >.toolbar-right{
    float: right;
  }
}
</style>
