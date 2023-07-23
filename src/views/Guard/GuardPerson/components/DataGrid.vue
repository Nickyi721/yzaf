<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="安保机构名称" prop="tcAbjgmc" min-width="150px"></el-table-column>
      <el-table-column label="所属单位名称" prop="tcDwmc" width="150px"></el-table-column>
      <el-table-column label="安保机构性质" prop="tcAbjgxz" width="150px">
        <template slot-scope="scope">
          <p v-if="scope.row.tcAbjgxz==='05010101'">
              专设
          </p>
          <p v-else-if="scope.row.tcAbjgxz==='05010102'">
              合设
          </p>        
        </template>
      </el-table-column>
      <el-table-column label="安保机构地址" prop="tcDz" width="150px"></el-table-column>
      <el-table-column label="专、兼职安保人员数量" prop="tnRysl" width="150px"></el-table-column>
      <el-table-column label="外包安保人员数量" prop="tnWbrysl" width="150px"></el-table-column>
      <el-table-column label="邮政编码" prop="tcYzbm" width="150px"></el-table-column>
      <el-table-column label="机构电话" prop="tcCzdh" width="150px"></el-table-column>
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
      default: [() => []]
     
    }
  },
  data (){
    return{
      rowClickStyle:true
    }
  }
}
</script>