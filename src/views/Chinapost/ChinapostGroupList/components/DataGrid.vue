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
      :row-class-name="rowClickStyle ? 'click-row' : ''" 
      @selection-change="_TableSelectionChange" 
      @row-dblclick="_TableDblClick"
      >
      <el-table-column type="index"></el-table-column>
      <el-table-column label="年度" prop="tcNd"></el-table-column>
      <el-table-column label="单位" prop="tcDwmc"></el-table-column>
      <el-table-column label="自评分" prop="tnZpzdf"></el-table-column>
      <el-table-column label="考评分" prop="tnKpzdf"></el-table-column>
      <el-table-column label="综合得分" prop="tnZhdf"></el-table-column>
      <el-table-column label="考评状态" prop="tnZtmc">
        <template slot-scope="scope">
          <p v-if="scope.row.tnZtmc === '未考评'">
          <span class="g_orange"></span>未考评
          </p>
          <p v-if="scope.row.tnZtmc === '已考评'">
          <span class="g_green"></span>已考评
          </p>
           <p v-if="scope.row.tnZtmc === '一票否决'">
          <span class="g_red"></span>一票否决
          </p>
          
        </template>
      </el-table-column>
      <el-table-column label="考评等级" prop="tcKpdjmc">
        <template slot-scope="scope">
          <p v-if="scope.row.tcKpdjmc === '不合格'">
          <span class="iconfont" style="color:red ;font-size:10px">&#xe63c;    </span>不合格
          </p>
          <p v-if="scope.row.tcKpdjmc === '合格'">
          <span class="iconfont" style="color:green ;font-size:10px">&#xe671;   </span>合格
          </p>
           <p v-if="scope.row.tcKpdjmc === '优秀'">
          <span class="iconfont" style="color:#FF4081 ;font-size:10px">&#xe67a;    </span>优秀
          </p>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="tcBz"></el-table-column>
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
  data () {
    return {
      rowClickStyle: true,
      selection: [],
    }
  },
}
</script>

<style lang="css">
</style>
