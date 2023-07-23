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
      <el-table-column label="计划名称" prop="tcJhmc" width="300px" show-overflow-tooltip></el-table-column>
      <el-table-column label="被检查单位" prop="sxmc" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="tnJhlx===1" label="检查单位" prop="tcJcdw" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="tnJhlx===0" label="检查人员" prop="tcCjrzh" width="100px" show-overflow-tooltip></el-table-column>
      <el-table-column label="计划开始时间" prop="tdCjsj" show-overflow-tooltip></el-table-column>
      <el-table-column label="计划截止时间" prop="tcJhjzsj" show-overflow-tooltip></el-table-column>
      <el-table-column label="计划状态" prop="tnJhzt" width="100px">
        <template slot-scope="scope">
          <p v-if="scope.row.tnJhzt==0">
              进行中
          </p>
          <p v-else-if="scope.row.tnJhzt==1">
              完结
          </p>  
          <p v-else-if="scope.row.tnJhzt==2">
              无效
          </p>       
        </template>
      </el-table-column>
      <el-table-column label="填报状态" prop="tbzt" width="100px">
        <template slot-scope="scope">
          <p v-if="scope.row.tbzt == '99' || scope.row.tbzt == '0'">
              未填
          </p>
          <p v-else-if="scope.row.tbzt == '1'">
              已填
          </p>
        </template>
      </el-table-column>
      <el-table-column label="已认同人员数量" prop="tcYjcrymc" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :title="scope.row.tcYjcrymc">
            {{scope.row.count}}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="计划类型" prop="tnJhlx" width="100px">
        <template slot-scope="scope">
          <p v-if="scope.row.tnJhlx==0">专项</p>
          <p v-if="scope.row.tnJhlx==1">例项</p>
        </template>
      </el-table-column> -->
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
      tnJhlx: ''
    }
  },
  watch: {
    list: {
      handler(val) {
        if(val.length > 0){
          this.tnJhlx = val[0].tnJhlx
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
