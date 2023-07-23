<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" :border="border" highlight-current-row header-cell-class-name="table-hd" stripe size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="起始时间" prop="tcKssj" width="200px"></el-table-column>
      <el-table-column label="结束时间" prop="tcJssj"></el-table-column>
      <el-table-column label="操作时间" prop="tdCjsj"></el-table-column>
      <el-table-column label="操作人" prop="tcCjr"></el-table-column>
      <el-table-column label="状态" prop="tcZt">
        <span slot-scope="scope">{{options[scope.row.tcZt]}}</span>
      </el-table-column>
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
    return {
      rowClickStyle:true,
      options: {
        1: '停用',
        0: '启用',
      }
    }
  }
}
</script>
