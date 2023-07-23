<template>
    <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
      <el-table ref='table' class="grid-table" header-cell-class-name="table-hd"  highlight-current-row size="mini" height="100%" :data="list" @selection-change="_TableSelectionChange" >
        <el-table-column type="selection" align="center" width="80px" fixed></el-table-column>
        <el-table-column label="人员姓名" align="center" prop="tcXm"></el-table-column>
        <el-table-column label="单位名称" align="center" prop="dwmc"></el-table-column>
      </el-table>  
      <div class="grid-page" ref="page" v-if="$slots.default">
        <slot></slot>
      </div>      
    </div>      
</template>

<script>
// 共用模块
import Mixin from "@mixins";
import Model from "../model.js";

export default {
  mixins: [Mixin.init,Mixin.Grid],
  data() {
    return {
      bindData:{}
    };
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },  
  methods: {
    clearSelect() {
      this.$refs.table.clearSelection()
    }
  }
};
</script>

<style>
.grid-page:after {
  content: '';
  display: table;
  clear: both;
}
.el-pagination {
  float:right;
}
</style>

