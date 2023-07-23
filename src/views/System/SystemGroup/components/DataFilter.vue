<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcJczmc']" size="mini" placeholder="工作组名称"></el-input>
      <!-- <el-input v-model="bindData['tcLx']" size="mini" placeholder="工作组类型"></el-input> -->
      <el-select v-model="bindData['tcLx']" size="mini" placeholder="工作组类型">
         <el-option
          v-for="item in groupTypes"
          :key="item.tcSjubm"
          :label="item.tcSjnr"
          :value="item.tcSjubm">
        </el-option>
      </el-select>
      <el-input v-model="bindData['tcZzmc']" size="mini" placeholder="组长名称"></el-input>
      <el-date-picker v-model="bindData['range']" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter, Mixin.init],
  data(){
    return{
      dict: ['000503'],
      groupTypes: []
    }
  },
  methods:{
    $init(options){
      if (options) {
        this.groupTypes = [{"tcSjubm":"","tcSjnr":"全部"}].concat(options['000503'])
        console.log(this.groupTypes)
      }
    }
  }
}
</script>