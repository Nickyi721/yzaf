<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" :border="border" highlight-current-row header-cell-class-name="table-hd" stripe size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="操作服务名称" prop="tcFfmc" width="200px"></el-table-column>
      <el-table-column label="报文内容" prop="tbYsbw" min-width="300px"></el-table-column>
      <el-table-column label="操作人帐号" prop="tcCzrzh" width="100px"></el-table-column>
      <el-table-column label="ip" prop="tcIp" width="120px"></el-table-column>
      <el-table-column label="时间" prop="tdCzsj" width="150px"></el-table-column>
      <el-table-column label="单位" prop="tcCzdwmc" width="200px"></el-table-column>
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