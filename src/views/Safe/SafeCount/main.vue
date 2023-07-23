<template>
  <CustomView>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<script>
import queryConfig from './config'
import Mixin from '@mixins'

export default {
  name: 'SafeCount',
  mixins: [
    Mixin.report,
    Mixin.init
  ],  
  data () {
    return {
      queryConfig: queryConfig,
      list: [],
      isFirstEnter: true
    }
  },
  methods: {
    $init(){
      this.getReportUrl()
    },
    queryHandle (bindData) {

    },
    controlHandle (type, payload) {

    },
    getReportUrl () {
      this.reportUrl = this.createReportUrl(`reportlet=aqjc.cpt&op=view`)
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
