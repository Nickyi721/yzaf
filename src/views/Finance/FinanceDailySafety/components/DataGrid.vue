<template>
  <div
    class="common-grid"
    ref="container"
    :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}"
  >
    <el-table
      class="grid-table"
      header-cell-class-name="table-hd"
      stripe
      :border="border"
      highlight-current-row
      size="mini"
      height="100%"
      :data="list"
      :row-class-name="rowClickStyle ? 'click-row' : ''"
      @row-dblclick="_TableDblClick"
      @selection-change="_TableSelectionChange" 
    >
      <el-table-column type="index" width="80px" fixed></el-table-column>
      <el-table-column label="检查状态" prop="tnJczt" width>
        <template slot-scope="scope">
          {{scope.row.tnJczt | tnJcztFilter}}
        </template>
      </el-table-column>
      <el-table-column label="营业状态" prop="tcYyztmc"></el-table-column>
      <el-table-column label="检查人" prop="tcJcrmc"></el-table-column>
      <el-table-column label="值班负责人" prop="tcZbfzr"></el-table-column>
      <el-table-column label="检查日期" prop="tdCjsj"></el-table-column>
      <el-table-column label="单位" prop="tcCjdwmc"></el-table-column>
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
    mixins: [
      Mixin.Grid,
      Mixin.page
    ],   
    props: {
      list: {
        type: Array,
        default: () => []
      }      
    },
    filters: {
      tnJcztFilter(val){
        if(val === 0){
          return '未检查'
        }
        if(val === 1){
          return '已检查'
        }
      }
    },
    data() {
        return{
          rowClickStyle: true,
        }
    },
    methods: {

    }
}
</script>

