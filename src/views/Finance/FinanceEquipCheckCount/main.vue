<template>
  <CustomView>
    <!-- <el-tabs v-model="activeName2" @tab-click="handleClick"> -->
    <el-tabs v-model="activeName2">
      <el-tab-pane label="枪支" name="first"></el-tab-pane>
      <!-- <el-tab-pane label="弹药" name="second"></el-tab-pane> -->
    </el-tabs>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
import queryConfig from './config'
import Mixin from '@mixins'

export default {
  name: 'FinanceEquipCheckCount',
  mixins: [
    Mixin.report,
    Mixin.init
  ],  
  data () {
    return {
      queryConfig: queryConfig,
      list: [],
      isFirstEnter: true,
      activeName2: 'first'
    }
  },
  methods: {
    $init(){
      const report=`reportlet=afab_qzaqjctjb.cpt&dwdm=${JSON.parse(window.sessionStorage.user).tcDwdm}`;
      this.getReportUrl(report)
    },
    getReportUrl (report) {
      this.reportUrl = this.createReportUrl(report)
    },
    // handleClick(tab, event) {
    //   if(this.activeName2==='first'){
    //     const report=`reportlet=afab_qzaqjctjb.cpt&dwdm=${JSON.parse(window.sessionStorage.user).tcDwdm}`;
    //     this.getReportUrl(report)
    //   }else if(this.activeName2==='second'){
    //     const report=``;
    //     this.getReportUrl(report)
    //   }
    // }
  },
  activated () {
    if (!this.isFirstEnter) {
      const report=`reportlet=afab_qzaqjctjb.cpt&dwdm=${JSON.parse(window.sessionStorage.user).tcDwdm}`;
      this.getReportUrl(report)
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
