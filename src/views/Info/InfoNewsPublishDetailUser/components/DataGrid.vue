<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table stripe
        border
        :data="list"
        size="mini"
        height="100%"
        class="grid-table"
        header-cell-class-name="table-hd" 
        :row-class-name="rowClickStyle ? 'click-row' : ''" 
        >
        <el-table-column type='index'></el-table-column>
        <el-table-column prop='tcDwmc' label="单位名称"></el-table-column>
        <el-table-column prop='tcJsrmc' label="用户"></el-table-column>
        <el-table-column prop='tcHfnr' label="回复内容"></el-table-column>
        <el-table-column prop='tdHfsj' label="回复时间" width="240px"></el-table-column>
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
    return {
      rowStyle: {
        height: '45px'
      },
      rowClickStyle: true,
    }
  }
}
</script>
