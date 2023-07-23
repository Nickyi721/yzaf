<template lang="html">
  <el-card class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['c_sjubm']" size="mini" placeholder="请输入单位名称"></el-input>
      <el-input v-model="bindData['c_sjubm']" size="mini" placeholder="请输入组织机构代码"></el-input>
      <el-input v-model="bindData['c_sjnr']" size="mini" placeholder="请输入上级机构代码"></el-input>
    </div>
    <div class="filter-btn">
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </el-card>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
}
</script>
