<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000407" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from "@commons/model.js";

export default {
  name: 'SafeCount',
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
      console.log(this.sfjm, this.dwdm)
      this.reportUrl = this.createReportUrl(`reportlet=aqsc_sbss.cpt&dwdm=${this.dwdm}&sfjm=${this.sfjm}`)
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
