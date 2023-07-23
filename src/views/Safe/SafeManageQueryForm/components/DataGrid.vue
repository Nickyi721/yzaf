<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      id="dataTable"
      stripe
      border
      :data="list"
      style="width:
      100%"
      size="mini"
      height="100%"
      class="grid-table"
      header-cell-class-name="table-hd" 
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="计划名称" prop="tcJhmc"></el-table-column>
      <el-table-column label="检查截止时间" prop="tcJcjzsj"></el-table-column>
      <el-table-column label="计划状态" prop="tcJhzt"></el-table-column>
      <el-table-column label="被检查单位名称" prop="tcBjcdwmc"></el-table-column>
      <el-table-column label="状态" prop="tnZt"></el-table-column>
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
    },
  },
  data () {
    return {
      rowClickStyle: true,
      selection: [],
    }
  },
}
</script>

<style lang="css">
</style>
