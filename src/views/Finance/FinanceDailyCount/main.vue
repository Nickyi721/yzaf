<template>
  <CustomView>
    <CommonOrgTree slot="side" fnCode="000405" module="normal" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from "@commons/model.js";

export default {
  name: 'FinanceDailyCount',
  mixins: [
    Mixin.report,
    Mixin.init
  ],  
  data () {
    return {
      isFirstEnter: true,
      reportUrl: '',
      sfjm: 0,
      dwdm: ''
    }
  },
  methods: {
    async $init(){
      const result = await Model.getSfjm({})
      if(result.state === '1') {
        this.sfjm = result.data
      }
    },
    // 事件-点击树结点
    _OrgTreeClick(node) {
      this.dwdm = node.id
      this.getReportUrl()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.dwdm = node.id
      this.getReportUrl()
    },
    getReportUrl () {
      this.reportUrl = this.createReportUrl(`reportlet=jraq_rcjc.cpt&dwdm=${this.dwdm}&sfjm=${this.sfjm}`)
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getReportUrl()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
