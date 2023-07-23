<template>
  <CustomView>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView>
</template>

<style lang="scss">
</style>


<script>
import queryConfig from './config'
import Mixin from '@mixins'

export default {
  name: 'ChinapostGroupCount',
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
    $init(){
      this.getReportUrl()
    },
    getReportUrl () {
      this.reportUrl = this.createReportUrl(`reportlet=payz.cpt&op=view`)
    }
  }
}
</script>
