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
      <el-table-column label="计划名称" prop="tcJhmc"></el-table-column>
      <el-table-column label="检查内容" prop="tcAqjcbmc" width="300px"></el-table-column>
      <el-table-column label="计划截止时间" prop="tcJhjzsj" width="150px"></el-table-column>
      <el-table-column label="计划状态" prop="tnJhztmc" width="150px">
        <template slot-scope="scope">
          <div>
          <p v-if="scope.row.tnJhztmc=='进行中'">
              <span class="g_blue"></span>进行中
          </p>
           <p v-if="scope.row.tnJhztmc=='完结'">
              <span class="g_green"></span>完结
          </p>
          <p v-if="scope.row.tnJhztmc=='无效'">
              <span class="g_red"></span>无效
          </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="计划类型" prop="tnJhlx" width="150px">
        <template slot-scope="scope">
          <p v-if="scope.row.tnJhlx==0">专项</p>
          <p v-if="scope.row.tnJhlx==1">例项</p>
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

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";

</style>

