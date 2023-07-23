<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-select clearable v-model="bindData['tnJhzt']" size="mini" placeholder="请选择计划状态">
        <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value"></el-option>
      </el-select>
      <el-input clearable v-model="bindData['tcJhmc']" size="mini" placeholder="计划名称"></el-input>
      <span class="demonstration">计划时间段：</span>
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
  data () {
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
      bindData: {}
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    },
  },
}
</script>

<style lang="scss">
  .demonstration {
    font-size: 14px;
    color: #666;
  }
</style>
