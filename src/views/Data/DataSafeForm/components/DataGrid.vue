<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table stripe :border="border" highlight-current-row :data="list" size="mini" height="100%" class="grid-table" header-cell-class-name="table-hd" :row-class-name="rowClickStyle ? 'click-row' : ''"  @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick" >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="检查表名称" prop="tcAqjcbmc"></el-table-column>
      <el-table-column label="创建人" prop="tcCjrzh" width="150px"></el-table-column>
      <el-table-column label="创建时间" prop="tdCjsj" width="150px"></el-table-column>
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
