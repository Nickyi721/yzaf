<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable v-model="bindData['tcDwmc']" size="mini" placeholder="请输入单位名称"></el-input>
      <el-input clearable v-model="bindData['tcZzjgdm']" size="mini" placeholder="请输入单位编码"></el-input>
      <el-input clearable v-model="bindData['tcSjjgdm']" size="mini" placeholder="请输入上级机构代码"></el-input>
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
