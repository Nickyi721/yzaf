<template>
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table stripe :border="border" highlight-current-row :data="list" size="mini" height="100%" class="grid-table" header-cell-class-name="table-hd" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange" @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="任务名称" prop="tcRwmc"></el-table-column>
      <el-table-column label="报表名称" prop="tcMbmc"></el-table-column>
      <el-table-column label="任务创建时间" prop="tdCjsj"></el-table-column>
      <el-table-column label="任务状态">
        
        <template slot-scope="scope">
          <div>
          <p v-if="scope.row.tnRwzt=='0'">
              <span class="g_blue"></span>进行中
          </p>
           <p v-if="scope.row.tnRwzt=='1'">
              <span class="g_green"></span>完结
          </p>
          <p v-if="scope.row.tnRwzt=='2'">
              <span class="g_red"></span>无效
          </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="填报状态" prop="tnTbzt">
        <!-- <template slot-scope="scope">
           {{scope.row.tnTbzt | tnTbzt}}
        </template> !-->

        <template slot-scope="scope">
          <div>
          <p v-if="scope.row.tnTbzt=='0'">
              <span class="g_orange"></span>未上报
          </p>
           <p v-if="scope.row.tnTbzt=='1'">
              <span class="g_green"></span>已上报
          </p>
          <p v-if="scope.row.tnTbzt=='2'">
              <span class="g_red"></span>重新上报
          </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="任务截止时间" prop="tcRwjzsj"></el-table-column>
      <el-table-column label="单位名称" prop="tcDwmc"></el-table-column>
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
  filters: {
    tnTbzt (value) {
      if (value === 0) {
        return '未上报'
      } else if (value === 1) {
        return '已上报'
      } else if (value === 2) {
        return '申请重报'
      }
    },
    statusFilter (value) {
      switch (value) {
        case 0:
          return "进行中";
          break;
        case 1:
          return "完结";
          break;
        case 2:
          return "无效";
          break;
      }
    }
  },
  data () {
    return {
      rowClickStyle: true,
      selection: []
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";


</style>
