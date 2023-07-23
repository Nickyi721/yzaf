<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="rowClickStyle ? 'click-row' : ''" @selection-change="_TableSelectionChange"  @row-dblclick="_TableDblClick">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="二维码名称" prop="tcEwmmc" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column label="二维码大类" prop="tcEwmDlmc" ></el-table-column>
      <el-table-column label="二维码小类" prop="tcEwmXlmc" show-overflow-tooltip></el-table-column>
      <el-table-column label="二维码生成时间" prop="tdCjsj" width="120px"></el-table-column>
      <el-table-column label="二维码场地" prop="tnCdid" width="150px"></el-table-column>
      <!-- <el-table-column label="状态" prop="tnSfyx" width="200px">
        <template slot-scope="scope">
          <p v-if="scope.row.tnSfyx === 10030401">待启用</p> 
          <el-switch 
            v-else-if="scope.row.tnSfyx !== 10030401"
            v-model="scope.row.tnSfyx"
            active-text="启用"
            :active-value=10030402
            inactive-text="停用"
            :inactive-value=10030403
            @change=" (val) => _SwitchChange(val, scope.row.tnEwmid)"
          >
          </el-switch>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
         <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="_generateQrcode(scope.row)">查看</el-button>
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
    },
  },
  data (){
    return{
      rowClickStyle:true,
    }
  },
  methods: {
    _generateQrcode(row) {
      this.$emit("generateQrcode", row)
    },
  }
}
</script>