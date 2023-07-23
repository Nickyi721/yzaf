<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcYwjm']" size="mini" placeholder="请输入文件名称"></el-input>
      <el-select v-model="bindData['tcLxid']" size="mini" placeholder="请选择文件分类">
        <el-option v-for="zlkwjType in zlkwjTypes" :key="zlkwjType.tcSjubm" :label="zlkwjType.tcSjnr" :value="zlkwjType.tcSjubm"></el-option>
      </el-select>
      <el-select v-model="bindData['tnShzt']" size="mini" placeholder="请选择审核状态">
        <el-option v-for="shztType in shztTypes" :key="shztType.tcSjubm" :label="shztType.tcSjnr" :value="shztType.tcSjubm"></el-option>
      </el-select>
      <el-date-picker v-model='tdScsj' :unlink-panels="true" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日"
       value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
  props:[
    "zlkwjTypes","shztTypes"
  ],
  data () {
    return {
      tdScsj:'',
      bindData: {
        tcYwjm: '',
        // tcLxid: '',
        startDate:'',
        endDate:'',
      }
    }
  },
  methods: {
    _ButtonClick () {
      // if(this.tdScsj===null){
      //   this.tdScsj=[null, null]
      // }
      this.bindData.startDate = this.tdScsj ? this.tdScsj[0] : null
      this.bindData.endDate = this.tdScsj ? this.tdScsj[1] : null
      this.$emit('query', this.bindData)
    }
  }
}
</script>

<style lang="scss">
</style>
