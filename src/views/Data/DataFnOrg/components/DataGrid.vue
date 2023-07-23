<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe border size="mini" height="100%" :data="list" :row-class-name="$listeners.dblClick ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="组织机构代码" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="单位简称" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="单位类型" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="上级单位" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="网点类别" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="省" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="市" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="县" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="邮政编码" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="负责人" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="证上地址" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="实际地址" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="网点联系方式" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="负责人联系方式" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="金融许可证" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="网点状态" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="联机标志" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="经度" prop="c_sjubm" width="150px"></el-table-column>
      <el-table-column label="纬度" prop="c_sjubm" width="150px"></el-table-column>
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
  }
}
</script>
