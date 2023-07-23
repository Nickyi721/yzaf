<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" highlight-current-row header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
       <el-table-column label="是否故障" prop="tnSfgz">
        <template slot-scope="scope">
          {{scope.row.tnSfgz==1?'有故障':'无故障'}}
        </template>
      </el-table-column>
      <el-table-column v-for="(col, index) in config" :key="index" :label="col.tcXxxmc" :prop="col.tnAfabszid.toString()" :min-width="col.tcXxxmc.length * 20 + 'px'"></el-table-column>
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
    config: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rowClickStyle: true
    }
  },
  watch: {
    config: {
      handler () {

      },
      deep: true
    }
  }
}
</script>
