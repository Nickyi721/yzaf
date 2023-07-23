<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      ref="table"
      stripe
      :border="border" highlight-current-row
      :data="list"
      size="mini"
      height="100%"
      class="grid-table"
      header-cell-class-name="table-hd" 
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @select="_RowSelect"
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      @select-all="_DataGridSelectAll"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="文件名" prop="tcYwjm"></el-table-column>
      <el-table-column label="文件分类" prop="tcLxid" width="150px">
        <template slot-scope="scope">
          <p v-if="scope.row.tcLxid==='11010101'">
              红头文件
          </p>
          <p v-else-if="scope.row.tcLxid==='11010102'">
              政策性文件
          </p>      
        </template>
      </el-table-column>
      <el-table-column label="上传人" prop="tcScrmc" width="150px"></el-table-column>
      <el-table-column label="上传时间" prop="tdScsj" width="150px" :formatter="dateFormat"></el-table-column>
      <el-table-column label="审核状态" prop="tnShzt" width="150px">
        <template slot-scope="scope">
          <p v-if="scope.row.tnShzt===0">
              <span class="g_orange"></span>未审核
          </p>
          <p v-else-if="scope.row.tnShzt===1">
              <span class="g_green"></span>审核通过
          </p>
          <p v-else-if="scope.row.tnShzt===2">
             <span class="g_red"></span> 审核不通过
          </p>         
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.tnShzt==1" @click="_downloadClick(scope.row.tcWjm, scope.row.tcYwjm)">下载</el-button>
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
      rowClickStyle: true,
      selection: [],
    }
  },
  methods:{
    _downloadClick(id, wjmc){
      this.$emit("download",id, wjmc)
    },
    dateFormat: function(row, column) {
      let t = new Date(row.tdScsj);
      let year = t.getFullYear(),
        month = t.getMonth() + 1,
        date = t.getDate(),
        hours = t.getHours(),
        min = t.getMinutes(),
        second = t.getSeconds();
      let newTime =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (date < 10 ? "0" + date : date) +
        " " +
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (min < 10 ? "0" + min : min) +
        ":" +
        (second < 10 ? "0" + second : second);
      return newTime;
    },
    toggleRowSelection(row, select){
      this.$refs.table.toggleRowSelection(row, select)
    }
  }
}
</script>

<style lang="css">
</style>
