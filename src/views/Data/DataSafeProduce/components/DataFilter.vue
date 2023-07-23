<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcSbmc']" size="mini" placeholder="请输入设备名称"></el-input>
      <el-select v-model="bindData['tcXxxlxbm']" placeholder="请选择设备类型" size="mini"  @change="(val) => _selectChange(val, 1)">
        <el-option v-for="opt in opt3" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
      </el-select>
      <el-select v-model="bindData['tcEwmdlbm']" placeholder="请选择场所或车辆" size="mini"  @change="(val) => _selectChange(val, 2)">
        <el-option v-for="opt in opt1" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
      </el-select>
      <el-select v-model="bindData['tcEwmxlbm']" placeholder="请选择安全生产设备类型或车辆类型" size="mini">
        <el-option v-for="opt in opt2" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
      </el-select>
      <el-input v-model="bindData['tcAzqy']" size="mini" placeholder="请输入安装区域"></el-input>
      <el-select v-model="bindData['tcPbztbm']" placeholder="请选择是否必配" size="mini">
        <el-option v-for="opt in opt4" :key="opt.tcSjubm" :label="opt.tcSjnr" :value="opt.tcSjubm"></el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Model from './../model.js'
import CommonModel from '@commons/model.js'

export default {
  mixins: [Mixin.Filter, Mixin.init],
  data(){
    return{
      dict: ['0001', '1103'],
      bindData:{
        tcSbmc: '',
        tcAzqy: '',
        tcXxxlxbm: '',
        tcEwmdlbm: '',
        tcEwmxlbm: '',
        tcPbztbm: '',
      },
      opt3: [],
      opt1: [],
      opt2: [],
      opt4: [],
    }
  },
  methods:{
    $init(options) {
      if(options){
        this.opt3 = [{tcSjnr: '请选择设备类型', tcSjubm: ''},...options['1103']]
        this.opt4 = [{tcSjnr: '请选择是否必配', tcSjubm: ''},...options['0001']]
      }
    },
    _ButtonClick () {
      this.$emit('query', this.bindData)
    },
    _selectChange (val, type){
      this.getOptions(val, type)
    },
    async getOptions(val, type){
      const result = await CommonModel.getDictData([val])
      if(type === 1){
        this.bindData['tcEwmdlbm'] = ''
        this.bindData['tcEwmxlbm'] = ''
        this.opt1 = [{tcSjnr: '请选择场所或车辆', tcSjubm: ''}, ...result.data[val]]
        this.opt2 = []
      }
      if(type === 2){
        this.bindData['tcEwmxlbm'] = ''
        this.opt2 = [{tcSjnr: '请选择安全生产设备类型或车辆类型', tcSjubm: ''}, ...result.data[val]]
      }
    }
  }
}
</script>