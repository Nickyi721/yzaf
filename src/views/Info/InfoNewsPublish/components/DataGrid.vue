<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table ref="table" class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick" @select="_RowSelect" @select-all="_DataGridSelectAll"
 :row-style="rowStyle">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="信息标题" prop="tcXxbt" min-width="200px"></el-table-column>
      <el-table-column label="信息类型" prop="tcLxmc" width="100px"></el-table-column>
      <el-table-column label="发布时间" prop="tdFbsj" width="150px"></el-table-column>
      <el-table-column label="创建人" prop="tcCjrmc" width="100px"></el-table-column>
      <el-table-column label="审批人" prop="tcSprmc" width="100px"></el-table-column>
      <el-table-column label="状态" prop="tcSpztmc" width="100px">
        <template slot-scope="scope">
          <div>
            <p v-if="scope.row.tcSpzt=='000602'">
              <span class="g_green"></span>已发送
            </p>
            <p v-if="scope.row.tcSpzt=='000603'">
              <span class="g_red"></span>拒批
            </p>
            <p v-if="scope.row.tcSpzt=='000604'">
              <span class="g_blue"></span>草稿
            </p>
            <p v-if="scope.row.tcSpzt=='000601'">
              <span class="g_orange"></span>未审批
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" prop="tcXxztmc" width="100px">
        <template slot-scope="scope">
          <div>
          <p v-if="scope.row.tcXxztmc=='待阅'">
              <span class="g_orange"></span>待阅
          </p>
           <p v-if="scope.row.tcXxztmc=='已阅'">
              <span class="g_green"></span>已阅
          </p>
           <p v-if="scope.row.tcXxztmc=='待办'">
              <span class="g_green_b"></span>待办
          </p>
          <p v-if="scope.row.tcXxztmc=='已办'">
               <span class="g_orange_b"></span>已办
          </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="已回复单位数" prop="dwyhfNum" width="100px"></el-table-column>
      <el-table-column label="未回复单位数" prop="dwwhfNum" width="100px"></el-table-column>
      <el-table-column label="短消息" prop="sfdxx" width="100px">
        <template slot-scope="scope">
          <p v-if="scope.row.sfdxx">
              是
          </p>
          <p v-else-if="!scope.row.sfdxx">
              否
          </p>
        </template>
      </el-table-column>
      <el-table-column label="是否需要回复" prop="tnSfhf" width="100px">
        <template slot-scope="scope">
          <p v-if="scope.row.tnSfhf">
              是
          </p>
          <p v-else-if="!scope.row.tnSfhf">
              否
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
    }
  },
  data () {
    return {
      rowStyle: {
        height: '45px'
      },
      rowClickStyle: true,
    }
  },
  methods:{
    toggleRowSelection(row, select){
      this.$refs.table.toggleRowSelection(row, select)
    }
  }
}
</script>

