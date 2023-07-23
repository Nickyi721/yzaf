<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" :border="border" highlight-current-row header-cell-class-name="table-hd" stripe size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="异常原因" prop="tcYcyy" min-width="300px"></el-table-column>
      <el-table-column label="异常原因编码" prop="tcYcyybm" width="100px"></el-table-column>
      <el-table-column label="业务表名称" prop="tcYwbmc" width="200px"></el-table-column>
      <el-table-column label="业务功能编码" prop="tcYwgnbm" width="150px"></el-table-column>
      <el-table-column label="业务功能名称" prop="tcYwgnmc" width="150px"></el-table-column>
      <el-table-column label="创建时间" prop="tdCjsj" width="150px"></el-table-column>
      <el-table-column label="是否解决" prop="tnSfjj" width="100px">
        <template slot-scope="scope">
          {{scope.row.tnSfjj==1?'已解决':'未解决'}}
        </template>       
      </el-table-column>
      <el-table-column label="业务id" prop="tnYwid" width="80px"></el-table-column>
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
    return{
      rowClickStyle:true
    }
  }
}
</script>