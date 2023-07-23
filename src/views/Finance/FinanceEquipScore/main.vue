<template>
  <CustomView>
    <iframe :src="reportUrl" frameborder="0" class="common-frame"></iframe>
  </CustomView> 
</template>

<script>
import Mixin from '@mixins'
  export default {
    name: 'FinanceEquipScore',
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
        this.reportUrl = this.createReportUrl(`reportlet=jraqsheshi.cpt&op=view&dwdm=${JSON.parse(window.sessionStorage.user).tcDwdm}`)
      }
    }
  }
</script>

<style lang="scss" scoped>


</style>
