<template>
  <CustomView :location="[{ text: '安全检查详情' }]">
    <div slot="top" v-if='!!formData'>
      <div class="common-info">
        <div class="common-info-unit">
          <span class="common-info-label">备注：</span>
          <span class="common-info-content">{{formData}}</span>
        </div>
      </div>
    </div>
    <!-- 数据表格 -->
    <DataGrid :list="list"></DataGrid>

  </CustomView>
</template>
<style lang="scss" scoped>
.common-grid {
  border: 1px solid #ebeef5;
}
</style>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

import DataGrid from './components/DataGrid.vue'
export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      list: [],
      formData: ''
    }
  },
  methods: {
    // 加载列表
    async getDetailList () {
      const result = await Model.getDetailList({
        isQuery: 1,
        cdId: '0004060201',
        requestData: {
          tnAqjcjhid: this.$route.query.curPlan,
          tcDwdm: this.$route.query.curOrg
        }
      })
      if (result.data) {
        this.list = result.data
        // this.list = result.data[0].aqjcAqjctiDto
        this.formData = result.data[0].tcWtsm
        // for(let i in this.list) {
        //   if(this.list[i].tnJcjg === 0) {
        //     this.list[i].tnJcjgmc = '不通过'
        //   } else {
        //     this.list[i].tnJcjgmc = '通过'
        //   } 
        // }
      }
    }
  },
  created() {
    this.getDetailList()
  }
}
</script>


