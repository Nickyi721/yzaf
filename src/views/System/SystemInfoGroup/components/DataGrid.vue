<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      stripe
      :border="border" 
      highlight-current-row
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
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="群组名称" prop="tcQzmc" width="200px"></el-table-column>
      <el-table-column label="群组说明" prop="tcQzsm" width="600px"></el-table-column>
      <!-- <el-table-column label="所属单位" prop="TC_dwdm" style="display:none"></el-table-column> -->
      <el-table-column label="单位名称" prop="tcDwmc">
        <template slot-scope="scope">
          <p>{{scope.row.dwpzListXS.join(',')}}</p>
        </template>
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
