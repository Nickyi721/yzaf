<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table align="center" class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="培训时间" prop="tcPxzt"></el-table-column>
      <el-table-column label="培训地点" prop="tcPxsj"></el-table-column>
      <el-table-column label="参训人员" prop="tcBz" min-width="200px"></el-table-column>
      <el-table-column label="培训目的" prop="tcBz"></el-table-column>
      <el-table-column label="培训内容" prop="tcBz" width="150px"></el-table-column>
      <el-table-column label="培训教师" prop="tcBz"></el-table-column>
      <el-table-column label="备注" prop="tcBz" width="150px"></el-table-column>
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
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  
</style>
