<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="培训/演练类型" prop="tcXxxlxmc" width="160px"></el-table-column>
      <el-table-column label="培训/演练内容" prop="tcPxnr" min-width="200px"></el-table-column>
      <el-table-column label="发起单位" prop="tcFqdwmc" width="150px"></el-table-column>
      <el-table-column label="参与人数" prop="tnCyrysl" width="100px"></el-table-column>
      <el-table-column label="培训/演练开始时间" prop="tdPxkssj" width="150px"></el-table-column>
      <el-table-column label="培训/演练结束时间" prop="tdPxjssj" width="150px"></el-table-column>
      <el-table-column label="培训状态" align="center" prop="tcPxzt" fixed="right" width="150px">
        <template slot-scope="scope">
          <span v-if="!scope.row.tnBzw">未完成</span>
          <span v-if="scope.row.tnBzw">已完成</span>
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
      default: [() => []]
    },
  },
  data (){
    return{
      rowClickStyle:true,
      test: false,
    }
  },
  methods: {
    _ButtonClick(tnPxylid) {
      this.$emit('button-click', tnPxylid)
    }
  },
  watch: {
    
  }
}
</script>

<style lang="scss" scoped>
  
</style>
