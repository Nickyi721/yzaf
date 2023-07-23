<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table 
      stripe 
      :border="border" highlight-current-row 
      size="mini" 
      height="100%" 
      class="grid-table" 
      header-cell-class-name="table-hd" 
      :data="list" 
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="单位名称" prop="tcDwmc" min-width="150px"></el-table-column>
      <el-table-column label="评估得分" prop="tnPgdf" width="100px"></el-table-column>
      <el-table-column label="评估等级" prop="tcPgdj" width="100px"></el-table-column>
      <el-table-column label="评估时间" prop="tdKspgsj" width="120px"></el-table-column>
      <el-table-column label="评估状态" prop="tcPgztmc" width="100px"></el-table-column>
      <el-table-column label="评分人单位" prop="tcPgdwmc" width="150px"></el-table-column>
      <el-table-column label="评分人" prop="tcPgrmc" width="100px"></el-table-column>
      <el-table-column label="评估组" prop="tcGzzmc" width="100px"></el-table-column>
      <el-table-column label="审核人" prop="tcShrmc" width="100px"></el-table-column>
      <el-table-column label="审核意见" prop="tcShyj" width="100px"></el-table-column>
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
    page: Object,
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
