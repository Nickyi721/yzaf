<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-date-picker clearable v-model="bindData['tcNd']" type="year" size="mini" placeholder="选择年度"></el-date-picker>
      <el-select clearable v-model="bindData['tnZt']" size="mini" placeholder="请选择考评状态">
        <el-option v-for="option in optionsStatus" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
      <el-select clearable v-model="bindData['tcKpdj']" size="mini" placeholder="请选择考评等级">
        <el-option v-for="option in optionsLevel" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
      </el-select>
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
      optionsStatus: [
        {
          tcSjubm: 0,
          tcSjnr: '未考评'
        },
        {
          tcSjubm: 1,
          tcSjnr: '已考评'
        }
      ],
      optionsLevel: [
        {
          tcSjubm: 0,
          tcSjnr: '优秀'
        },
        {
          tcSjubm: 1,
          tcSjnr: '合格'
        },
        {
          tcSjubm: 2,
          tcSjnr: '不合格'
        },
      ],
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  },
}
</script>

<style scoped>
  .demonstration {
    font-size: 14px;
    color: #666;
  }
</style>

