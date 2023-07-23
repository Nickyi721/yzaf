<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable v-model="bindData['tcJhmc']" size="mini" placeholder="请输入计划名称"></el-input>
      <el-select v-model="bindData['tnJhlx']" size="mini" placeholder="请选择计划类型">
        <el-option v-for="jhlx in jhlxs" :key="jhlx.tcSjubm" :label="jhlx.tcSjnr" :value="jhlx.tcSjubm"></el-option>
      </el-select>
      <el-select clearable v-model="bindData['tnJhzt']" size="mini" placeholder="请选择计划状态">
        <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
      <el-date-picker v-model="bindData['tcJhsj']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
  
</template>

<script>
import Mixin from '@mixins'
import CommonModel from '@commons/model.js'

export default {
  mixins: [Mixin.Filter],
  data() {
    return {
      options: [
        {
          label: '进行中',
          value: 0
        },
        {
          label: '完结',
          value: 1
        }
      ],
      bindData: {
        tnJhlx: '0'
      },
      jhlxs: [
        {tcSjubm:'0',tcSjnr:'专项'},
        {tcSjubm:'1',tcSjnr:'例项'}
      ],
    }
  },
  methods: {
    _ButtonClick() {
      this.$emit("query", this.bindData)
    },
    // 获取计划状态
    async getPlanStateOptions () {
      const result = await CommonModel.getDictData(['04020201'])
      if (result && result.data) {
        this.optionsPlanState = result.data;
      }
    },
  },
  created() {
    // this.getPlanStateOptions()
  }
}
</script>

<style scoped>
  .demonstration {
    font-size: 14px;
    color: #666;
  }
</style>
