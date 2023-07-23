<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      stripe
      :border="border" highlight-current-row
      :data="list"
      size="mini"
      height="100%"
      class="grid-table"
      header-cell-class-name="table-hd" 
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="计划名称" prop="tcJhmc" width="300px"></el-table-column>
      <el-table-column label="计划截止时间" prop="tcJhjzsj"></el-table-column>
      <el-table-column label="计划状态" prop="tnJhzt" width="150px">
        <template slot-scope='scope'>
          <p v-if='scope.row.tnJhzt==0'>进行中</p>
          <p v-if='scope.row.tnJhzt==1'>已完结</p>
          <p v-if='scope.row.tnJhzt==2'>无效</p>
        </template>
      </el-table-column>
      <el-table-column label="已完成单位（个）" prop="ytNum" width="300px"></el-table-column>
      <el-table-column label="未完成单位（个）" prop="wtNum" width="150px"></el-table-column>
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
