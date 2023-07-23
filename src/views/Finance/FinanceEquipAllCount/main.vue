<template>
  <CustomView>

    <el-tabs  v-model="activeName2" @tab-click="handleClick">
        
        <el-tab-pane label="邮政企业金融安防设施统计" name="first"></el-tab-pane>
        <el-tab-pane label="业务库情况统计" name="second"></el-tab-pane>
        <el-tab-pane label="自助设备情况统计" name="third"></el-tab-pane>
      </el-tabs>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<style lang="scss" scoped>

</style>

<script>
import { query } from './config'
import Mixin from '@mixins'
export default {
  name: 'FinanceEquipAllCount',
  mixins: [
    Mixin.report,
    Mixin.init
  ],  
  data () {
    return {
      reportUrl: '',
      activeName2: 'first'
    }
  },
  methods: {
    $init () {
     const report=`reportlet=afssqk.cpt`;
      this.getReportUrl(report)
    },
   getReportUrl (report) {
      //this.reportUrl = this.createReportUrl(`reportlet=afab_qzaqjctjb.cpt`)
      this.reportUrl = this.createReportUrl(report)
    },
    handleClick(tab, event) {
        console.log(this.activeName2);
        if(this.activeName2==='first'){
           const report=`reportlet=afssqk.cpt`;
           this.getReportUrl(report)
        }else if(this.activeName2==='second'){
            const report=`reportlet=ywk.cpt`;
            this.getReportUrl(report)
        }else if(this.activeName2==='third'){
            const report=`reportlet=zzsb.cpt`;
            this.getReportUrl(report)
        }
       
      }
  }
}
</script>
