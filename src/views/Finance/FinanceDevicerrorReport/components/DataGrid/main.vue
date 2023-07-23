<template>
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table stripe :border="border" highlight-current-row :data="list" size="mini" height="100%" class="grid-table" header-cell-class-name="table-hd" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange" @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="故障设施种类" prop="tcGzsszlmc" min-width="200px"></el-table-column>
      <el-table-column label="故障时间" prop="tdGzsj" width="200px">
        <template slot-scope="scope">
          {{scope.row.tdGzsj | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="故障数量" prop="tnGzsl" width=""></el-table-column>
      <el-table-column label="上报人" prop="tcCjrmc" width="100px"></el-table-column>
      <el-table-column label="故障设备" prop="tcPgztmc" width="150px">
        <template slot-scope="scope">
          <el-button @click="showDetail(scope.row)" type="primary" size="mini">查看明细</el-button>
        </template>
      </el-table-column>
      <el-table-column label="故障状态" prop="tnSfgz" min-width="200px">
         <template slot-scope="scope">
         {{scope.row.tnSfgz==0?'无故障':'有故障'}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="tdCjsj" min-width="200px">
        <template slot-scope="scope">
          {{scope.row.tdCjsj | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="tcPgrmc" width=""></el-table-column>
    </el-table>
    <div class="grid-page" ref="page" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
export default {
  mixins: [Mixin.Grid, Mixin.Filter],
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rowClickStyle: true
    }
  },
  methods: {
    showDetail (row) {
      this.$emit('detail-click', row)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";
</style>
