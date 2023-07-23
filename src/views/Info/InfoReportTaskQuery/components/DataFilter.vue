<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable v-model="bindData['tcRwmc']" size="mini" placeholder="请输入任务名称"></el-input>
      <el-input clearable v-model="bindData['tcMbmc']" size="mini" placeholder="请输入报表名称"></el-input>
      <el-select clearable v-model="bindData['tcRwzt']" size="mini" placeholder="请选择任务状态">
        <el-option v-for="option in optionsStatus" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <el-date-picker v-model="bindData['tcRwsj']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Model from '../model.js'

export default {
  mixins: [
    Mixin.Filter
  ],
  data () {
    return {
      optionsStatus: [
        {
          tcSjubm: 0,
          tcSjnr: '进行中'
        },
        {
          tcSjubm: 1,
          tcSjnr: '完结'
        }
      ],
    }
  },
  methods: {
   
  }
}
</script>

<style scoped>
  .demonstration {
    font-size: 14px;
    color: #666;
  }
</style>
