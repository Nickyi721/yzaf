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
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="任务名称" prop="tcRwmc"></el-table-column>
      <el-table-column label="报表名称" prop="tcMbmc"></el-table-column>
      <el-table-column label="任务说明" prop="tcRwsm"></el-table-column>
      <el-table-column label="任务时间" prop="tnRwsj"></el-table-column>
      <el-table-column label="任务状态" prop="tnRwztmc"></el-table-column>
      <el-table-column label="设置" width="150px" align="center">
        <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="preview(scope.row)">设置时间</el-button>
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
  methods: {
    preview (row) {
      this.$router.push({
        path: '/info/report/task-publish/preview', 
        query:{
          id: row.tnRwid,
          rwJzsj: row.tcRwjzsj
        } 
      })
    }
  }
}
</script>

<style lang="css">
</style>