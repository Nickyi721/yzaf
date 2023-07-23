<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcCjrmc']" size="mini" placeholder="请输入创建人"></el-input>
      <el-date-picker v-model="time" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  props: ['tcSsdwbm'],
  data() {
    return {
      time: '',
      bindData: {
        tcSsdwbm: '',
        tcCjrmc: '',
        beginDate: '',
        endDate: ''
      }
    }
  },
  methods: {
    _ButtonClick () {
      this.bindData.tcSsdwbm = this.tcSsdwbm
      // this.time = this.time ? this.time : [null, null]
      this.bindData.beginDate = this.time ? this.time[0] : null
      this.bindData.endDate = this.time ? this.time[1] : null
      this.$emit('query', this.bindData)
    }
  },
}
</script>