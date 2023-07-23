<template lang="html">
  <div class="common-grid common-grid-content" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" 
        highlight-current-row 
        size="mini" 
        :data="list" 
        
        :row-class-name="_RowStyle" 
        @selection-change="_TableSelectionChange" 
        @row-dblclick="_TableDblClick">
      <el-table-column label="序号" align="center" type="index"></el-table-column>
      <el-table-column label="考评项目" align="center" prop="tcKpxm1"></el-table-column>
      <el-table-column width="100px" label="考评ID" prop="tnKpid"></el-table-column>
      <el-table-column label="具体内容" align="center" prop="tcKpjtnr"></el-table-column>
      <el-table-column label="评分说明" align="center" prop="tcPfsm"></el-table-column>
      <el-table-column label="考评依据" align="center" prop="tcKpyj"></el-table-column>
      <el-table-column label="标准分" align="center" prop="tnBjf"></el-table-column>
      <el-table-column label="自评分" align="center" prop="tnZpf"></el-table-column>
      <el-table-column label="考评部门" align="center" prop="tcKpbm"></el-table-column>
    </el-table>
    <div class="grid-page" ref="page" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'

export default {
  mixins: [Mixin.Grid],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return{
      rowClickStyle: false
    }
  },
  methods: {
    _RowStyle({row, rowIndex}) {
      if(row.kf !== 0) {
        return 'row_error'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .common-grid /deep/{
    .row_error{
      >td{
        background: #FF5549 !important;
        color: #FFF;
      }
    }
  }
  
</style>