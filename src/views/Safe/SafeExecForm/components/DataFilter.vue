<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <span>计划状态:</span>
      <el-select v-model="bindData['tnJhzt']" size="mini" placeholder="请选择计划状态">
        <el-option v-for="jhztType in jhztTypes" :key="jhztType.tcSjubm" :label="jhztType.tcSjnr" :value="jhztType.tcSjubm"></el-option>
      </el-select>
      <el-select v-model="bindData['tnJhlx']" size="mini" placeholder="请选择计划类型">
        <el-option v-for="jhlx in jhlxs" :key="jhlx.tcSjubm" :label="jhlx.tcSjnr" :value="jhlx.tcSjubm"></el-option>
      </el-select>
      <el-input v-model="bindData['tcJhmc']" size="mini" placeholder="计划名称"></el-input>
      <el-date-picker v-model="bindData['time']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-select v-model="bindData['tbzt']" size="mini" placeholder="请选择填报状态">
        <el-option v-for="jhtbType in jhtbTypes" :key="jhtbType.tcSjubm" :label="jhtbType.tcSjnr" :value="jhtbType.tcSjubm"></el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  props:[
    "jhztTypes", "jhtbTypes", "jhlxs"
  ],
  data () {
    return {
      bindData: {
        tnJhzt: '0',
        tnJhlx: '0',
        tnJhztMc:'',
        tcJhmc:'',
        startTime:'',
        endTime:'',
        time:'',
        // orgId:''
      }
    }
  },
  methods: {
    _ButtonClick () {
      // if(this.bindData.time===null){
      //   this.bindData.time=[null, null]
      // }
      this.bindData.startTime = this.bindData.time ? this.bindData.time[0] : null
      this.bindData.endTime = this.bindData.time ? this.bindData.time[1] : null
      this.$emit('query', this.bindData)
    }
  }
}
</script>

<style lang="scss">
</style>
