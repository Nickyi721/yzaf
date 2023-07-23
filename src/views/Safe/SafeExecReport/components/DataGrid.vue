<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      id="dataTable"
      ref="table"
      stripe
      :border="border" highlight-current-row
      :data="list"
      height="100%"
      size="mini"
      class="grid-table"
      @select="_RowSelect"
      header-cell-class-name="table-hd" 
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @select-all="_DataGridSelectAll"
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="计划名称" prop="tcJhmc"></el-table-column>
      <el-table-column label="检查截止时间" prop="tcJhjzsj"></el-table-column>
      <el-table-column v-if="tnJhlx==1" label="检查单位" prop="tcJcdw" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="tnJhlx==0" label="检查人员" prop="tcCjrzh" width="100px" show-overflow-tooltip></el-table-column>
      <el-table-column label="计划状态" width="150px" prop="tnJhztmc">
        <template slot-scope="scope">
          <p v-if="scope.row.tnJhztmc === '进行中'">
            <span class="g_blue"></span>进行中
          </p>
          <p v-if="scope.row.tnJhztmc === '完结'">
            <span class="g_green"></span>完结
          </p>
          <p v-if="scope.row.tnJhztmc === '无效'">
            <span class="g_red"></span>无效
          </p>
        </template>
      </el-table-column>
      <el-table-column label="被检查单位名称" prop="tcDwmc"></el-table-column>
      <el-table-column label="信息状态" width="150px" prop="tnXxztmc"></el-table-column>
    </el-table>
    <div class="grid-page" ref="page" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Mixin from "@mixins";

export default {
  mixins: [Mixin.Grid],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      rowClickStyle: true,
      selection: [],
      tnJhlx: ""
    };
  },
  methods: {
    toggleRowSelection(row, select) {
      this.$refs.table.toggleRowSelection(row, select);
    },
    clearSelection() {
      this.$refs.table.clearSelection();
    }
  },
  watch: {
    list: {
      handler(val) {
        if (val.length > 0) {
          this.tnJhlx = val[0].tnJhlx;
        }
      }
    }
  }
};
</script>

<style lang="scss">
</style>
