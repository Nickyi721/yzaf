<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" :border="border" highlight-current-row header-cell-class-name="table-hd" stripe size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="设备类型" prop="tcXxxlxmc" width="200px"></el-table-column>
      <el-table-column label="场所或车辆" prop="tcEwmdlmc" width="150px"></el-table-column>
      <el-table-column label="安全生产设备类型或车辆类型" prop="tcEwmxlmc" width="200px"></el-table-column>
      <el-table-column label="设备名称" prop="tcSbmc" width="250px"></el-table-column>
      <el-table-column label="安装区域" prop="tcAzqy" width="150px"></el-table-column>
      <el-table-column label="是否必配" prop="tcPbztmc"></el-table-column>
      <el-table-column label="是否关联消防安全设备" prop="tnSfgjxfxxszb">
        <template slot-scope='scope'>
          <p v-if="scope.row.tnSfgjxfxxszb">已关联</p>
          <p v-else>未关联</p>
        </template>
      </el-table-column>
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