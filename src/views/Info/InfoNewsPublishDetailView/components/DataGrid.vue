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
        @row-dblclick="_TableDblClick"
        >
        <el-table-column type='index'></el-table-column>
        <el-table-column prop='tcDwmc' label="接收单位名称"></el-table-column>
        <el-table-column prop='yhfNum' label="是否回复">
          <template slot-scope="scope">
            <p v-if='!scope.row.yhfNum'>未回复</p>
            <p v-if='scope.row.yhfNum'>已回复</p>
          </template>
        </el-table-column>
        <el-table-column prop='tnBlbz' v-if="tcLx==='04010101'" label="办理状态" width="240px">
          <template slot-scope="scope">
            <p v-if='scope.row.tnBlbz=="0"'>待办</p>
            <p v-if='scope.row.tnBlbz=="1"'>已办</p>
          </template>
        </el-table-column>
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
    },
    tcLx: ''
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
