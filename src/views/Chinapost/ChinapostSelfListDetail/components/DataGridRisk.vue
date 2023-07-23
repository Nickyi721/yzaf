<template lang="html">
  <div class="common-grid common-grid-content" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" @row-dblclick="_TableDblClick" :data="list" >
      <el-table-column label="序号" type="index"></el-table-column>
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
<style lang="scss" scoped>
  .grid-table {
    cursor: pointer;
  }
</style>

