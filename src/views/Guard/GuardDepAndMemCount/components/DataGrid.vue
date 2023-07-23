<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe border size="mini" height="100%" :data="list" :row-class-name="$listeners.dblClick ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="安保机构名称" prop="tcAbjgmc" ></el-table-column>
      <el-table-column label="管理人员数量" prop="tcAbjgxz" ></el-table-column>
      <el-table-column label="工作人员数量" prop="tcAbjgdz" ></el-table-column>
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
      default: [() => []]
     
    }
  }
}
</script>