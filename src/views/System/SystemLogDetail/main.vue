<template>
  <CustomView :location="[{ text: '日志详情' }]">
    <div class="g-content">
      {{content}}
    </div>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Moment from 'moment'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      content: ''
    }
  },
  methods: {
    $init () {
      this.logId = this.$route.query.id
      this.getLogDetail()
    },
    async getLogDetail () {
      const result = await Model.getLogDetail(this.logId)
      if (result.data) {
        this.content = result.data.tbYsbw 
      }
    }
  }
}
</script>
