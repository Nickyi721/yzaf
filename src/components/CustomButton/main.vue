<template lang="html">
  <el-button size="mini" @click="_ButtonClick" class="common-button-toolbar">
    <CustomIcon :name="icon"/>
    {{text}}
  </el-button>
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    text: String,
    icon: String
  },
  methods: {
    _ButtonClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="css">
</style>
