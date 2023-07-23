<template lang="html">
  <div class="common-grid common-grid-content" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table stripe :border="border" 
        highlight-current-row
        class="grid-table" 
        header-cell-class-name="table-hd" 
        size="mini" 
        :data="list" 
        :row-class-name="_RowStyle" 
        :span-method="_TableMerageMethod"
        >
      <el-table-column label="序号" align="center" type="index"></el-table-column>
      <el-table-column label="考评项目" align="center" prop="tcKpxm1"></el-table-column>
      <el-table-column width="100px" label="考评ID" prop="tnKpid"></el-table-column>
      <el-table-column label="具体内容" align="center" prop="tcKpjtnr"></el-table-column>
      <el-table-column label="评分说明" align="center" prop="tcPfsm"></el-table-column>
      <el-table-column label="考评依据" align="center" prop="tcKpyj"></el-table-column>
      <el-table-column label="标准分" align="center" prop="tnBjf" width="120px"></el-table-column>
      <el-table-column label="自评分" align="center" prop="tnZpf" width="120px">
        <template slot-scope="scope">
          <input class="table-input" size="mini" type="number" maxlength="3" oninput="if(value.length>3)value=value.slice(0,3)" @change="e => _InputChangeValid(e, scope.row)" placeholder="请输入数字" :disabled="editAble === 1" v-model="scope.row.tnZpf"></input>
        </template>
      </el-table-column>
      <el-table-column label="考评部门" align="center" prop="tcKpbm"></el-table-column>
    </el-table>
    <div class="grid-page" ref="page" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Mixin from '@mixins'
import Validator from '@commons/validator.js'

export default {
  mixins: [Mixin.Grid],
  props: {
    list: {
      type: Array,
      default: () => []
    },
    editAble: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      
    }
  },
  watch: {
    editAble(newVal, oldVal) {
      if(newVal) {
        this.editAble = newVal;
      }
    }
  },
  methods: {
    valid (e, row) {
      const value = e.target.value
      row.alert = !value
      this.$forceUpdate()
    },
    _InputChangeValid(e, row) {
      if(parseFloat(row.tnZpf) > row.tnBjf) {
        row.tnZpf = row.tnBjf
      }
      if(parseFloat(row.tnZpf) < 0) {
        row.tnZpf = 0
      }
    },
    _RowStyle({row, rowIndex}) {
      if(row.kf !== 0) {
        return 'row_error'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .common-grid .grid-table input {
      width: 100%;
      height: 28px;
      line-height: 28px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 0 3px;
      outline: none;
     
  }
  .common-grid /deep/{
    .row_error{
      >td{
        background: #FF5549 !important;
        color: #FFF;
      }
    }
  }
  
</style>
