<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable v-model="bindData['tcDwdm']" size="mini" placeholder="请输入单位名称"></el-input>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  data() {
    return {
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  }
  
}
</script>

<style scoped>
  .demonstration {
    font-size: 14px;
    color: #666;
  }
</style>
