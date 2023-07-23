<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="年度" prop="tcNd"></el-table-column>
      <el-table-column label="评分" prop="tnZpzdf"></el-table-column>
      <el-table-column label="审核状态" prop="tnShztmc">
         <template slot-scope="scope">
          <p v-if="scope.row.tnShztmc==='未审核'">
              <span class="g_orange"></span>未审核
          </p>
          <p v-else-if="scope.row.tnShztmc==='已审核'">
              <span class="g_green"></span>已审核
          </p>
             
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="tcBz"></el-table-column>
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
    }
  },
  data (){
    return{
      rowClickStyle:true
    }
  }
}
</script>