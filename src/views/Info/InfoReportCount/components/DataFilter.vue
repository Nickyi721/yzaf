<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <!-- <el-select v-model="bindData['tnBbmc']" placeholder="请选择报表名称" size="mini">
        <el-option v-for="form in formList" :key="form.tcZdybbid" :label="form.tcZdybbmc" :value="form.tcZdybbid"></el-option>
      </el-select> -->
      <el-select v-model="bindData['tnRwmc']" placeholder="请选择任务名称" size="mini">
        <el-option v-for="task in taskList" :key="task.tnRwid" :label="task.tcRwmc" :value="task.tnRwid"></el-option>
      </el-select>
      
    <!-- </div>
    <div class="filter-btn"> -->
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Model from '../model.js'
import { log } from 'util';

export default {
  mixins: [
    Mixin.Filter,
    Mixin.init,
  ],
  data(){
    return{
      tcFbsj:'',
      bindData:{
        tnBbmc: '',
        tnRwmc: '',
        tnRwlx: '',
        tcMbid: ''
      },
      formList: [],
      taskList: []
    }
  },
  methods:{
    $init () {
      this.getTemplateList()
      this.getTaskList()
    },
    _ButtonClick () {
      this.bindData.tnRwlx=this.taskList.filter(item=>item.tnRwid==this.bindData.tnRwmc)[0].tnRwlx
      this.bindData.tnRwpc = this.taskList.filter(item=> item.tnRwid == this.bindData.tnRwmc)[0].tnRwpc
      this.bindData.tcMbid = this.taskList.filter(item => item.tnRwid == this.bindData.tnRwmc)[0].tcMbid
      this.$emit('query', this.bindData)
    },
    async getTemplateList() {
      const result = await Model.getTemplateList({
        isQuery: 1,
        cdId: '0004030305',
        requestData: {}
      })
      if(result.data) {
        this.formList = result.data
        this.bindData.tnBbmc = this.formList[0].tcZdybbid
      }
    },
    async getTaskList() {
      const result = await Model.getTaskList({
        isQuery: 1,
        cdId: '0004030305',
        requestData: {
          tnLx: 1
        }
      })
      if(result.data) {
        this.taskList = result.data
        this.bindData.tnRwmc = this.taskList[0].tnRwid
      }
    }
  }
}
</script>