<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcYhzh']" size="mini" placeholder="请输入用户账户"></el-input>
      <el-input v-model="bindData['tcYhmc']" size="mini" placeholder="请输入用户名称"></el-input>
      <el-input v-model="bindData['tcDwmc']" size="mini" placeholder="请输入单位名称"></el-input>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
}
</script>