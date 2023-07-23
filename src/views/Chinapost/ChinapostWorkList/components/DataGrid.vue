<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      stripe
      :border="border" highlight-current-row
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
      <el-table-column label="单位" prop="tcDwmc"></el-table-column>
      <el-table-column label="年度" prop="tcNd"></el-table-column>
      <el-table-column label="状态" prop="tnZtmc">
        <template slot-scope="scope">
          <p v-if="scope.row.tnZtmc === '进行中'">
          <span class="g_blue"></span>进行中
          </p>
          <p v-if="scope.row.tnZtmc === '已完结'">
          <span class="g_green"></span>已完结
          </p>
          
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
