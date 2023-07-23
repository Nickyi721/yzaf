<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" :border="border" highlight-current-row header-cell-class-name="table-hd" stripe size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="单位编码" prop="tcDwbm" width="150px"></el-table-column>
      <el-table-column label="单位全称" prop="tcDwjc" width="180px"></el-table-column>
      <el-table-column label="单位类型" prop="tcDwlxmc" width="200px"></el-table-column>
      <el-table-column label="上级单位" prop="sjdwmc" width="300px"></el-table-column>
      <el-table-column label="网点类别" prop="tcWdlbmc" width="200px"></el-table-column>
      <el-table-column label="省" prop="tcSheng" width="150px"></el-table-column>
      <el-table-column label="市" prop="tcShi" width="150px"></el-table-column>
      <el-table-column label="县" prop="tcXian" width="150px"></el-table-column>
      <el-table-column label="邮政编码" prop="tcYzbm"></el-table-column>
      <el-table-column label="负责人" prop="tcFzr" width="100px"></el-table-column>
      <el-table-column label="证上地址" prop="tcZsdz" width="300px"></el-table-column>
      <el-table-column label="实际地址" prop="tcSjdz" width="300px"></el-table-column>
      <el-table-column label="网点联系方式" prop="tcWdlxfs" width="150px"></el-table-column>
      <el-table-column label="负责人联系方式" prop="tcFzrlxfs" width="200px"></el-table-column>
      <el-table-column label="金融许可证" prop="tcJrxkz" width="200px"></el-table-column>
      <el-table-column label="网点状态" prop="tnWdztmc"></el-table-column>
      <el-table-column label="经度" prop="tcJd"></el-table-column>
      <el-table-column label="纬度" prop="tcWd"></el-table-column>
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
