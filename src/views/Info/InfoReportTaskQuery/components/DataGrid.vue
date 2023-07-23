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
      <el-table-column label="任务状态" prop="tnRwztmc">
        <template slot-scope="scope">
          <div>
          <p v-if="scope.row.tnRwztmc=='进行中'">
              <span class="g_blue"></span>进行中
          </p>
           <p v-if="scope.row.tnRwztmc=='完结'">
              <span class="g_green"></span>完结
          </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="任务截止时间" prop="tcRwjzsj"></el-table-column>
      <el-table-column label="填报状态" prop="tnTbzt">
        <template slot-scope="scope">
          {{scope.row.tnTbzt | tnTbzt}}
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
    }
  },
  filters: {
    tnTbzt (value) {
      if (value === 0) {
        return '未上报'
      } else if (value === 1) {
        return '已上报'
      } else if (value === 2) {
        return '申请重报'
      }
    }
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