<template>
  <CustomView>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'

export default {
  name: 'GuardDepAndMemCount',
  mixins: [
    Mixin.report,
    Mixin.init
  ],
  data () {
    return {
      reportUrl: ''
    }
  },
  methods: {
    $init () {
      this.getReportUrl()
    },
    getReportUrl () {
      this.reportUrl = this.createReportUrl(`reportlet=afab_afabjgjry.cpt&dwdm=${JSON.parse(window.sessionStorage.user).tcDwdm}`)
    }
  }
}
</script>
