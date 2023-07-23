<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table
      stripe 
      :border="border" highlight-current-row 
      :data="list" 
      size="mini" 
      height="100%" 
      class="grid-table" 
      header-cell-class-name="table-hd" 
      :row-class-name="$listeners.dblClick ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="单位编号" prop="tcDwdm" width="150px" ></el-table-column>
      <el-table-column label="单位名称" prop="tcDwmc" width="150px" ></el-table-column>
      <el-table-column label="营业场所安全评估计分表" prop="tcYycsdf" width="200px"></el-table-column>
      <el-table-column label="业务库安全评估计分表" prop="tcYwkdf" width="200px"></el-table-column>
      <el-table-column label="自助机具、自助银行安全评估计分表" prop="tcZzsbdf" width="200px"></el-table-column>
      <el-table-column label="运钞安全评估计分表" prop="tcYcdf" width="150px"></el-table-column>
      <el-table-column label="消防安全评估计分表" prop="tcXfdf" width="150px"></el-table-column>
      <el-table-column label="计算机安全评估计分表" prop="tcShjzxdf" width="150px"></el-table-column>
      <el-table-column label="枪支弹药安全评估计分表" prop="tcQzdydf" width="150px"></el-table-column>
      <el-table-column label="案件防范评估计分表" prop="tcAjffdf" width="150px"></el-table-column>
      <el-table-column label="安全保卫基础工作评估计分表" prop="tcAqbwdf" width="200px"></el-table-column>
      <el-table-column label="总得分" prop="tnPgdf" width="100px"></el-table-column>
      <el-table-column label="评估等级" prop="tcPgdj"></el-table-column>
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
    },
  },
}
</script>

<style lang="css">
</style>
