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
      <el-table-column type="selection" width="80px" fixed></el-table-column>
      <el-table-column label="单位" prop="tcSsdwmc" width></el-table-column>
      <el-table-column label="营业状态" prop="tcLxmc"></el-table-column>
      <el-table-column label="检查时间">
        <template slot-scope="scope">
          {{scope.row.tdKssj}} - {{scope.row.tdJssj}}
        </template>
      </el-table-column>
    </el-table>
    <!-- <div class="grid-page" ref="page" v-if="$slots.default">
      <slot></slot>
    </div> -->
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
    data() {
        return{
          rowClickStyle: true,
        }
    },
    methods: {

    }
}
</script>

