<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-select v-model="query['tcSglx']" size="mini" placeholder="请选择事故类型">
        <el-option
          v-for="el in [{tcSjubm: '', tcSjnr: '请选择事故类型' }, ...options['110201']]"
          :key="el && el.tcSjubm"
          :label="el && el.tcSjnr"
          :value="el && el.tcSjubm">
        </el-option>
      </el-select>
      <el-select v-model="bindData['tcTjdw']" size="mini" placeholder="请选择提交单位">
        <el-option
          v-for="el in [{tcSjubm: '', tcSjnr: '请选择事故类型' }, ...options['110201']]"
          :key="el && el.tcSjubm"
          :label="el && el.tcSjnr"
          :value="el && el.tcSjubm">
        </el-option>
      </el-select>      
      <el-input v-model="bindData['tcSglx']" size="mini" placeholder="请选择事故类型"></el-input>
      <el-date-picker v-model="bindData['time']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter, Mixin.init],
  data() {
    return {
      bindData: {
        tcSglx: '',
        time: '',
      },
      options: {}
    }
  },
  methods: {
    $init(options){
      if (options && options['1101']) {
        this.options = options['1101']
      }
    },
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  },
}
</script>