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
      <el-table-column label="隐患整改通知书编号" prop="tcZgtzbh" width="150px"></el-table-column>
      <el-table-column label="计划名称" prop="tcJhmc"></el-table-column>
      <el-table-column label="检查报告书编号" prop="tcBgsbh" width="150px"></el-table-column>
      <el-table-column label="检查日期" prop="tcJcrq" width="100px"></el-table-column>
      <el-table-column label="信息状态" prop="tnXxztmc" width="150px"></el-table-column>
      <el-table-column label="检查单位名称" prop="tcJcdwmc" width="150px"></el-table-column>
      <el-table-column label="隐患整改回复状态" prop="tcZt" width="150px">
        <template slot-scope="scope">
          <div>
          <p v-if="scope.row.tcZt=='未回复'">
              <span style="color:#FF5549">未回复</span>
          </p>
           <p v-if="scope.row.tcZt=='已回复'">
              <span style="color:#17AF49">已回复</span>
          </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" prop="tnShzt" width="150px">
        <template slot-scope="scope">
          <p v-if="scope.row.tnShzt === 0">
            <span class="g_orange"></span>未审核
          </p>
          <p v-if="scope.row.tnShzt === 1">
            <span class="g_green"></span>已审核
          </p>
          <p v-if="scope.row.tnShzt === 2">
            <span class="g_red"></span>已驳回
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
