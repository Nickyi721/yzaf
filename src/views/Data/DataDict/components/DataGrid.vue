<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table stripe :data="list" style="width: 100%" size="mini" height="100%" class="grid-table" header-cell-class-name="table-hd" :border="border" highlight-current-row :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange" @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="数据编码" prop="tcSjubm" width="150px"></el-table-column>
      <el-table-column label="数据内容" prop="tcSjnr"></el-table-column>
      <el-table-column label="上级编码" prop="tcSjibm" width="150px"></el-table-column>
      <el-table-column label="是否末级" prop="isEnd" width="100px"></el-table-column>
      <el-table-column label="排列顺序" prop="tnPlxx" width="100px"></el-table-column>
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
