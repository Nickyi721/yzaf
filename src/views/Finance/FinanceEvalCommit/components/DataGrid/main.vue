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
      <el-table-column label="单位名称" prop="tcDwmc" min-width="200px"></el-table-column>
      <el-table-column label="评估得分" prop="tnPgdf" width=""></el-table-column>
      <el-table-column label="评估等级" prop="tcPgdj" width=""></el-table-column>
      <el-table-column label="评估时间" prop="tdKspgsj" width="100px"></el-table-column>
      <el-table-column label="评估状态" prop="tcPgztmc" width="150px">
        <template slot-scope="scope">
          <div>
            <p v-if="scope.row.tcPgztmc=='正在评估'">
              <span class="g_blue"></span>正在评估
            </p>
            <p v-if="scope.row.tcPgztmc=='评估完成'">
              <span class="g_green_b"></span>评估完成
            </p>
            <p v-if="scope.row.tcPgztmc=='待审核'">
              <span class="g_orange"></span>待审核
            </p>
            <p v-if="scope.row.tcPgztmc=='审核通过'">
              <span class="g_green"></span>审核通过
            </p>
            <p v-if="scope.row.tcPgztmc=='审核未通过'">
              <span class="g_red"></span>审核未通过
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评分人单位" prop="tcPgdwmc" min-width="200px"></el-table-column>
      <el-table-column label="评分人" prop="tcPgrmc" width=""></el-table-column>
      <el-table-column label="评估组" prop="tcGzzmc" min-width="100px"></el-table-column>
      <el-table-column label="审核人" prop="tcShrmc" width=""></el-table-column>
      <el-table-column label="审核意见" prop="tcShyj" min-width="200px"></el-table-column>
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

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";  
  
</style>
