<template lang="html">
  <div class="common-grid common-grid-content" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <!-- <el-form style="height: 100%" :model="list" :rules="rules" ref="form"> -->
      <el-table
        stripe
        :border="border" highlight-current-row
        :data="list"
        size="mini"
        class="grid-table"
        header-cell-class-name="table-hd" 
        :row-class-name="_RowStyle" 
        @selection-change="_TableSelectionChange" 
        @row-dblclick="_TableDblClick"
        >
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column label="考评项目" align="center" prop="tcKpxm1"></el-table-column>
        <el-table-column width="100px" label="考评ID" prop="tnKpid"></el-table-column>
        <el-table-column label="具体内容" align="center" prop="tcKpjtnr"></el-table-column>
        <el-table-column label="评分说明" align="center" prop="tcPfsm"></el-table-column>
        <el-table-column label="考评依据" align="center" prop="tcKpyj"></el-table-column>
        <el-table-column label="标准分" align="center" prop="tnBjf"></el-table-column>
        <el-table-column label="自评分" align="center" prop="tnZpf"></el-table-column>
        <el-table-column label="考评分" align="center" prop="tnKpf">
          <template slot-scope="scope">
            <!-- <el-form-item prop="num" :rules="[{required: true, message: '请输入', trigger: 'blur'}]"> -->
            <el-input type="number" class="table-input" :disabled="editAble === 1" size="mini" v-model="scope.row['tnKpf']" @change="e => valid(e, scope.row)" @blur="e => valid(e, scope.row)" :class="{'common-editable-alert': scope.row.alert}"></el-input>
            <!-- </el-form-item> -->
          </template>
        </el-table-column>
        <el-table-column label="考评部门" align="center" prop="tcKpbm"></el-table-column>
      </el-table>
      <div class="grid-page" ref="page" v-if="$slots.default">
        <slot></slot>
      </div>
    <!-- </el-form> -->
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
      selection: [],
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
      if(parseFloat(row.tnKpf) > row.tnBjf) {
        row.tnKpf = row.tnBjf
      }
      if(parseFloat(row.tnKpf) < 0) {
        row.tnKpf = 0
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
  .common-grid /deep/{
    .row_error{
      >td{
        background: #FF5549 !important;
        color: #FFF;
      }
    }
  }
</style>
