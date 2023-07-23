<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input clearable v-model="bindData['tcJhmc']" size="mini" placeholder="请输入计划名称"></el-input>
      <!-- <el-select clearable v-model="bindData['tcJhzt']" size="mini" placeholder="请选择计划状态">
        <el-option v-for="option in optionsPlanState" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select> -->
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
      optionsPlanState: [],
      bindData: {}
    }
  },
  methods: {
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
