<template>
  <div class="common-filter">
    <div class="filter-items">
      <!-- <el-input v-model="bindData['tcJcrmc']" size="mini" placeholder="请输入检查人姓名"></el-input> -->
      <!-- <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        size="mini"
        value-format="yyyy-MM-dd"
      ></el-date-picker> -->
        <el-time-picker
            is-range
            size="mini"
            v-model="time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
        </el-time-picker>      
        <el-select size="mini" v-model="bindData['tcLxbm']" placeholder="请选择">
            <el-option v-for="item in option" :key="item.tcSjubm" :value="item.tcSjubm" :label="item.tcSjnr"></el-option>
        </el-select>        
        <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Model from './../model.js'
import Moment from "moment";

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
      },
      //查询
      _ButtonClick() {
          if(this.time){
            this.bindData.tdKssj = Moment(this.time[0]).format('HH:mm:ss')
            this.bindData.tdJssj = Moment(this.time[1]).format('HH:mm:ss')
          }
          if(this.bindData.tcLxbm){
            this.bindData.tcLxbm = this.option.filter(item => item.tcSjubm === this.bindData.tcLxbm)[0].tcSjnr
          }
          this.$emit('query', this.bindData)
      },
    },
}
</script>

