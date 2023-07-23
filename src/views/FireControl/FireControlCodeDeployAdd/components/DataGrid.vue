<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table ref="table" class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="$listeners.dblClick ? 'click-row' : ''"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column v-if='col.tnXfaqjbxxszid' v-for="(col, index) in config" :key="index" :label="col.tcXxxmc" :prop="col.tnXfaqjbxxszid.toString()" :min-width="260 + 'px'">
        <template slot-scope="scope">
          <span title='请双击进行选择'>{{scope.row[col.tnXfaqjbxxszid.toString()]}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if='col.tnAfabszid' v-for="(col, index) in config" :key="index" :label="col.tcXxxmc" :prop="col.tnAfabszid.toString()" :min-width="300 + 'px'">
        <template slot-scope="scope">
          <span title='请双击进行选择'>{{scope.row[col.tnAfabszid.toString()]}}</span>
        </template>
      </el-table-column>
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
  watch: {
    config (val) {

    }
  },
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
  methods:{
    clearSelection(){
      if(this.$refs.table)
        this.$refs.table.clearSelection()
    }
  }
}
</script>