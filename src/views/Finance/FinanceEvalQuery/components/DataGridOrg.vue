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
      :row-class-name="$listeners.dblClick ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="单位名称" prop="tcDwmc"></el-table-column>
      <el-table-column label="综合得分" prop="tnPgdf"></el-table-column>
      <el-table-column label="评估等级" prop="tcPgdj"></el-table-column>
      
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
  mounted() {
    
  }
}
</script>

<style lang="css">
</style>
