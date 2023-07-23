<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" :border="border" highlight-current-row header-cell-class-name="table-hd" stripe size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="tcJczmc" label="工作组名称"></el-table-column>
      <el-table-column prop="tcSjnr" label="工作组类型"></el-table-column>
      <el-table-column prop="tcYxkssj" label="有效开始时间"></el-table-column>
      <el-table-column prop="tcYxjssj" label="有效结束时间"></el-table-column>
      <el-table-column prop="tcZzmc" label="组长"></el-table-column>
      <el-table-column prop="tcJfymc" label="计分员"></el-table-column>
      <el-table-column prop="members" label="成员"></el-table-column>
      <el-table-column prop="tdCjsj" label="创建时间"></el-table-column>
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