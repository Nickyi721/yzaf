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
      <el-table-column type="index"></el-table-column>
      <el-table-column label="单位" prop="tcDwdm"></el-table-column>
      <el-table-column label="任务截止时间" prop="tcXjzsj"></el-table-column>
      <el-table-column label="设置" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="open(scope.row)">修改时间</el-button>
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
    open (row) {
      this.$emit('open', row)
    }
  }
}
</script>

<style lang="css">
  .el-button--success{
    border-color: #006a45 !important;
    background-color: #006a45 !important;
  }
</style>
