<template lang="html">
  <div class="common-grid common-grid-content" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column label="序号" type="index"></el-table-column>
      <!-- <el-table-column label="案发时间" prop="tdAfrq"></el-table-column>
      <el-table-column label="信息标题" prop="tcXxbt"></el-table-column>
      <el-table-column label="案发部位" prop="tcAfbwmc"></el-table-column>
      <el-table-column label="案发部位所属" prop="tcAfbwssmc"></el-table-column> -->
      <el-table-column width="260px" label="信息标题" prop="tcXxbt"></el-table-column>
      <el-table-column width="100px" label="扣分" prop="tnKf"></el-table-column>
      <el-table-column width="100px" label="考评ID" prop="tnKpid"></el-table-column>
      <el-table-column label="考评具体内容" prop="tcKpjtnr"></el-table-column>
      <el-table-column width="200px" label="备注" prop="tnBz"></el-table-column>
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
  data (){
    return{
      rowClickStyle:true
    }
  }
}
</script>