<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcFfmc']" size="mini" placeholder="请输入操作服务名称" maxlength="50"></el-input>
      <el-input v-model="bindData['tcCzrzh']" size="mini" placeholder="请输入操作人帐号" maxlength="50"></el-input>
      <el-date-picker v-model="bindData['range']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Moment from 'moment'

export default {
  mixins: [Mixin.Filter],
  data () {
    return {
      bindData: {
        range: [Moment().subtract(1, 'days').format('YYYY-MM-DD'), Moment().format('YYYY-MM-DD')]
      }
    }
  }
}
</script>