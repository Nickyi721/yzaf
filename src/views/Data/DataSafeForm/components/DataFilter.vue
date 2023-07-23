<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcAqjcbmc']" size="mini" placeholder="请输入检查表名称"></el-input>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  data() {
    return{
      bindData:{
        tcAqjcbmc:''
      }
    }
  },
  methods:{
    _ButtonClick(){
      this.$emit("query", this.bindData)
    }
  }
}
</script>

<style lang="scss">
</style>
