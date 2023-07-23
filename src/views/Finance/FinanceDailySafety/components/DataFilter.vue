<template>
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcJcrmc']" size="mini" placeholder="请输入检查人"></el-input>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        size="mini"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
      <el-select size="mini" v-model="bindData['tcYyzt']" placeholder="请选择">
          <el-option v-for="item in option" :key="item.tcSjubm" :value="item.tcSjubm" :label="item.tcSjnr"></el-option>
      </el-select>        
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Model from './../model.js'

export default {
    mixins: [Mixin.Filter, Mixin.init],
    data() {
      return{
        dict: ['031103'],        
        bindData: {},
        option: [],
        time:''
      }
    },
    methods: {
      $init(options) {
        this.option = options['031103']
        // this.option.splice(-1,1)
      },
      //查询
      _ButtonClick() {
          if(this.time){
            this.bindData.beginDate = this.time[0]
            this.bindData.endDate = this.time[1]
          }
          // if(this.bindData.tcYyztbm){
          //   this.bindData.tcYyzt = this.option.filter(item => item.tcSjubm === this.bindData.tcYyztbm)[0].tcSjnr
          // }
          this.$emit('query', this.bindData)
      },
    },
}
</script>

