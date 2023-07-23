<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcXxbt']" size="mini" placeholder="请输入信息标题"></el-input>
      <el-date-picker v-model='tcFbsj' :unlink-panels="true" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日"
       value-format="yyyy-MM-dd"></el-date-picker>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Model from './../model.js'

export default {
  mixins: [Mixin.Filter],
  props:["infoTypes","infoStates"],
  data(){
    return{
      tcFbsj:'',
      bindData:{
        tcXxbt: '',
        tcLx: '',
        tcSpzt: '',
        startDate: '',
        endDate: '',
        tcXxzt:''
      }
    }
  },
  methods:{
    // $init(options) {
    //   this.getInfoTypes()
    // },
    _ButtonClick () {
      // if(this.tcFbsj===null){
      //   this.tcFbsj=[null, null]
      // }
      this.bindData.startDate = this.tcFbsj ? this.tcFbsj[0] : null
      this.bindData.endDate = this.tcFbsj ? this.tcFbsj[1] : null
      this.$emit('query', this.bindData)
    }
  }
}
</script>