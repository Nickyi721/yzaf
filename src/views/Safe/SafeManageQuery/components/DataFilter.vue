<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcJhmc']" size="mini" placeholder="计划名称"></el-input>
      <el-select v-model="bindData['tnJhlx']" size="mini" placeholder="请选择计划类型">
        <el-option v-for="jhlx in jhlxs" :key="jhlx.tcSjubm" :label="jhlx.tcSjnr" :value="jhlx.tcSjubm"></el-option>
      </el-select>
      <el-date-picker v-model="bindData['time']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  props:["jhlxs"],
  data () {
    return {
      bindData: {
        tnJhlx: '0'
      }
    }
  },
  methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  }
}
</script>

<style lang="scss">
</style>
