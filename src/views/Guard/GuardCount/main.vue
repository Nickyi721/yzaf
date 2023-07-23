<template>
  <CustomView>
    <CommonOrgTree slot="side" fnCode="000404" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

export default {
  name: 'GuardCount',
  mixins: [
    Mixin.report,
    Mixin.init
  ],
  data () {
    return {
      reportUrl: '',
      sfjm: 0,
      dwdm: ''
    }
  },
  methods: {
    async $init () {
      const result = await Model.getSfjm({})
      if(result.state === '1') {
        this.sfjm = result.data
      }
    },
    // 事件-点击树结点
    _OrgTreeClick(node) {
      if(node.jgtype === '1') {
        this.dwdm = node.id
      } else {
        this.dwdm = node.parentId
      }
      this.getReportUrl()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.dwdm = node.id
      this.getReportUrl()
    },
    getReportUrl () {
      this.reportUrl = this.createReportUrl(`reportlet=abjgtj1.cpt&op=view&dwdm=${this.dwdm}&sfjm=${this.sfjm}`)
    }
  }
}
</script>
