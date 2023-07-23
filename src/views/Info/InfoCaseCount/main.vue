<template>
  <CustomView>
    <div slot="top">
      <el-tabs v-model="activeName" @tab-click="getPlaceReportUrl">
        <el-tab-pane label="案件类型统计" name="first"></el-tab-pane>
        <el-tab-pane label="案发部位统计"></el-tab-pane>
      </el-tabs>  
    </div>
    <div class="g-scroll" style="height: 100%;">
      <iframe :src="typeReportUrl" frameborder="0" class="common-frame"></iframe>
    </div>
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
export default {
  name: 'InfoCaseCount',
  mixins: [
    Mixin.report,
    Mixin.init
  ],  
  data () {
    return {
      activeName: 'first',
      typeReportUrl: ''
    }
  },
  methods: {
    $init () {
      this.getReportUrl ()
    },
    getReportUrl () {
       this.typeReportUrl = this.createReportUrl(`reportlet=xxsbtjfx.cpt&op=view&dwdm=${JSON.parse(window.sessionStorage.user).tcDwdm}`)
    },
    getPlaceReportUrl (tab,event) {
      if(tab.label == "案发部位统计"){
        this.typeReportUrl = this.createReportUrl(`reportlet=xxsbtjfx2.cpt&op=view&dwdm=${JSON.parse(window.sessionStorage.user).tcDwdm}`)
      }else{
        this.typeReportUrl = this.createReportUrl(`reportlet=xxsbtjfx.cpt&op=view&dwdm=${JSON.parse(window.sessionStorage.user).tcDwdm}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

