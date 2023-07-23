<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" :border="border" highlight-current-row header-cell-class-name="table-hd" stripe size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="词条编号ID" prop="tnYhctid" width="150px"></el-table-column>
      <el-table-column label="业务条线" prop="tcYwtx" width="150px"></el-table-column>
      <el-table-column label="所属环节" prop="tcSshjmc" width="200px"></el-table-column>
      <el-table-column label="所属类别" prop="tcSslbmc" width="150px"></el-table-column>
      <el-table-column label="检查方式" prop="tcJcfsmc" width="100px"></el-table-column>
      <el-table-column label="词条内容" prop="tcCtnr"></el-table-column>
      <el-table-column label="词条状态" prop="tcCtztmc" width="100px"></el-table-column>
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