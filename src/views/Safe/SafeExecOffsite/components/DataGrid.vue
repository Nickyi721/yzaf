<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="检查内容" prop="tcJcnrmc" width="250px"></el-table-column>
      <el-table-column label="检查单位" prop="tcDwmc" width="250px"></el-table-column>
      <el-table-column label="被检查单位" prop="tcBdwmc" width="250px"></el-table-column>
      <el-table-column label="检查时间" prop="tcJcsj" width="150px"></el-table-column>
      <el-table-column label="结果说明" prop="tcJcdwzg" show-overflow-tooltip></el-table-column>
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
  data (){
    return{
      rowClickStyle:true
    }
  }
}
</script>