<template lang="html">
  <div class="g-spacer" slot="info">
      <el-card class="compose-filter">
        <div slot="header" class="clearfix">
          <span>北京市 - 信息统计</span>
        </div>
        <div class="p-content">
          <span>安保机构数量:</span><span class="value">10</span>
          <span>安保管理人员数量:</span><span class="value">30</span>
          <span>安保工作人员数量:</span><span class="value">5</span>
        </div>
      </el-card>
    </div>
</template>
<style lang="scss" scoped>
.p-content{
  span{
    font-size: 16px;
    margin-right: 16px;
    &.value{
      color: #f60;
      margin-right: 32px;
    }
  }
}
</style>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Filter],
   data() {
      return {
        
       
      }
    },
    methods: {
    _ButtonClick () {
      this.$emit('query', this.bindData)
    }
  }
}
</script>