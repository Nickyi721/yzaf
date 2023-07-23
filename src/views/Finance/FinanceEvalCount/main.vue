<template>
  <CustomView>
    <!-- 侧栏 -->
    <CommonOrgTree slot="side" fnCode="000405" module="eval" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
export default {
  name: 'FinanceEvalCount',
  mixins: [
    Mixin.report
  ],
  data () {
    return {
      // 机构信息
      currentOrg: {},
      orgInfo: {},
      reportUrl: '',
      isFirstEnter: true
    }
  },
  methods: {
    // 事件-点击树结点
    _OrgTreeClick (node) {
      this.orgInfo = node
      this.currentOrg = node
      this.pageNum = 1
      this.getReportUrl()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded (node) {
      this.orgInfo = node
      this.currentOrg = node
      this.getReportUrl()
    },
    getReportUrl () { 
      if(this.currentOrg.parentId == '999999'){
        // 集团
        this.reportUrl = this.createReportUrl('formlet=jraq.frm')
      }else if (this.currentOrg.parentId == '300000000001') {
        // 省
        this.reportUrl = this.createReportUrl(`formlet=jraq_dwdm.frm&dwdm=${this.currentOrg.id}`)
      }else{
         // 市
        this.reportUrl = this.createReportUrl(`reportlet=jraq_shi.cpt&__bypagesize__=false&dwdm=${this.currentOrg.id}`)
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.currentOrg && this.orgInfo && this.getReportUrl()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
