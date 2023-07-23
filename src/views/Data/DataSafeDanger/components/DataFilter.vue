<template lang="html">
  <div class="common-filter">
    <div class="filter-items">
      <el-input v-model="bindData['tcCtnr']" size="mini" placeholder="请输入词条内容"></el-input>
      <el-select v-model="bindData['tcYwtxid']" placeholder="请选择业务条线" size="mini">
        <el-option v-for="YwtxType in YwtxTypes" :key="YwtxType.tcSjubm" :label="YwtxType.tcSjnr" :value="YwtxType.tcSjubm"></el-option>
      </el-select>
      <el-select v-model="bindData['tcSshjid']" placeholder="请选择所属环节" size="mini">
        <el-option v-for="SshjType in SshjTypes" :key="SshjType.tcSjubm" :label="SshjType.tcSjnr" :value="SshjType.tcSjubm"></el-option>
      </el-select>
      <el-select v-model="bindData['tcSslbid']" placeholder="请选择所属类别" size="mini">
        <el-option v-for="SslbType in SslbTypes" :key="SslbType.tcSjubm" :label="SslbType.tcSjnr" :value="SslbType.tcSjubm"></el-option>
      </el-select>
      <el-select v-model="bindData['tcJcfsid']" placeholder="请选择检查方式" size="mini">
        <el-option v-for="JcfsType in JcfsTypes" :key="JcfsType.tcSjubm" :label="JcfsType.tcSjnr" :value="JcfsType.tcSjubm"></el-option>
      </el-select>
      <el-select v-model="bindData['tnCtzt']" placeholder="请选择词条状态" size="mini">
        <el-option v-for="CtztType in CtztTypes" :key="CtztType.tcSjubm" :label="CtztType.tcSjnr" :value="CtztType.tcSjubm"></el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="_ButtonClick">查询</el-button>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Model from './../model.js'

export default {
  mixins: [Mixin.Filter],
  props:["JcfsTypes","SslbTypes","SshjTypes","YwtxTypes","CtztTypes"],
  data(){
    return{
      tcFbsj:'',
      bindData:{
        tcCtnr: '',
        // tcYwtxid: '',
        // tcSshjid: '',
        // tcSslbid: '',
        // tcJcfsid: '',
        // tnCtzt: ''
      }
    }
  },
  methods:{
    // $init(options) {
    //   this.getInfoTypes()
    // },
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  }
}
</script>