<template lang="html">
  <div class="common-editable">
    <el-table stripe border height="100%" :data="list" size="mini" class="grid-table" header-cell-class-name="grid-table-hd" @selection-change="_TableSelectionChange">
      <el-table-column type="selection" fixed></el-table-column>

      <el-table-column prop="tcXxxmc" label="名称" min-width="200px">
        <input type="text" slot-scope="scope" v-model="scope.row['tcXxxmc']" @change="e => valid(e, scope.row, 'tcXxxmc')" @blur="e => valid(e, scope.row, 'tcXxxmc')" :class="getAlertClass(scope.row, 'tcXxxmc')"></input>
      </el-table-column>
      <el-table-column prop="tnXxxsjlx" label="数据类型" width="100px">
        <select slot-scope="scope" v-model="scope.row['tnXxxsjlx']" :disabled="scope.row['tnXxxlrfs'] !== 1" @change="e => _SelectTypeChange(e, scope.row)">
          <option v-for="option in options['tnXxxsjlx']" :value="option.tcSjubm">{{option.tcSjnr}}</option>
        </select>
      </el-table-column>
      <el-table-column prop="tnXxxsjcd" label="数据长度" width="75px">
        <input type="text" slot-scope="scope" v-model="scope.row['tnXxxsjcd']" @change="e => _DatalengthChange(e, scope.row)" @blur="e => _DatalengthChange(e, scope.row)" :class="getAlertClass(scope.row, 'tnXxxsjcd')" :disabled="scope.row['tnXxxlrfs'] !== 1"></input>
      </el-table-column>
      <el-table-column prop="tnXxxlrfs" label="录入方式" width="100px">
        <select slot-scope="scope" v-model="scope.row['tnXxxlrfs']" @change="e => _SelectMethodChange(e, scope.row)">
          <option v-for="option in options['tnXxxlrfs']" :value="option.tcSjubm">{{option.tcSjnr}}</option>
        </select>
      </el-table-column>
      <el-table-column prop="tnXxxsfbt" label="必填" align="center" width="75px">
        <input slot-scope="scope" type="checkbox" name="" v-model="scope.row['tnXxxsfbt']" @change="_CheckChange(scope.row)">
      </el-table-column>
      <el-table-column prop="tcXxxxxxnr" label="选择项内容" width="120px">
        <input type="text" slot-scope="scope" v-model="scope.row['tcXxxxxxnr']" :disabled="scope.row['tnXxxlrfs'] === 1 || scope.row['tnXxxlrfs'] === 5 || scope.row['tnXxxldfs'] === 0"></input>
      </el-table-column>
      <el-table-column prop="tnXxxldxid" label="联动项" width="150px">
        <select slot-scope="scope" v-model="scope.row['tnXxxldxid']" @change="_SelectLinkChange(scope.row)">
          <option v-for="option in notSelect.concat(list.filter(item => item.tnXh !== scope.row.tnXh).filter(item => item.tnXxxlrfs === 2 || item.tnXxxlrfs === 4))" :value="option.tnXh">{{option.tcXxxmc}}</option>
        </select>
      </el-table-column>
      <el-table-column prop="tnXxxldfs" label="联动方式" width="150px">
        <select slot-scope="scope" v-model="scope.row['tnXxxldfs']" @change="_SelectLinkTypeChange(scope.row)" :disabled="scope.row['tnXxxldxid'] === -1">
          <option v-for="option in options['tnXxxldfs'].filter(option => (scope.row.tnXxxlrfs !== 1 && scope.row.tnXxxlrfs !== 5) || option.tcSjubm !== 0)" :value="option.tcSjubm">{{option.tcSjnr}}</option>
        </select>
      </el-table-column>
      <el-table-column prop="tnXxxsjcd" label="联动项关联值" width="150px">
        <input type="text" slot-scope="scope" v-model="scope.row['tcXxxldglz']" :disabled="scope.row['tnXxxldxid'] === -1 || scope.row['tnXxxldfs'] === 0" @change="e => valid(e, scope.row, 'tcXxxldglz')" @blur="e => valid(e, scope.row, 'tcXxxldglz')" :class="getAlertClass(scope.row, 'tcXxxldglz')"></input>
      </el-table-column>
      <el-table-column prop="tnSfzwcxtj" label="查询条件" align="center" width="75px">
        <input slot-scope="scope" type="checkbox" name="" v-model="scope.row['tnSfzwcxtj']" @change="_CheckChange(scope.row)">
      </el-table-column>

      <el-table-column label="操作" width="140px" fixed="right">
        <template slot-scope="scope">
          <button class="grid-row-control" @click="_ButtonRowDeleteClick(scope.$index, scope)">
            <CustomIcon name="delete"/>
          </button>
          <button class="grid-row-control" @click="_ButtonRowOrderClick(scope.$index, 'down')" :disabled="scope.$index === 0">
            <CustomIcon name="arrow-down"/>
          </button>
          <button class="grid-row-control" @click="_ButtonRowOrderClick(scope.$index, 'up')" :disabled="scope.$index === list.length -1">
            <CustomIcon name="arrow-up"/>
          </button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      options: {
        tnXxxsjlx: [
          { tcSjubm: 0, tcSjnr: '数字' },
          { tcSjubm: 1, tcSjnr: '字符' },
          { tcSjubm: 2, tcSjnr: '浮点' },
        ],
        tnXxxlrfs: [
          { tcSjubm: 1, tcSjnr: '填写' },
          { tcSjubm: 2, tcSjnr: '单选' },
          { tcSjubm: 3, tcSjnr: '多选' },
          { tcSjubm: 4, tcSjnr: '下拉' },
          { tcSjubm: 5, tcSjnr: '日期' },
        ],
        tnXxxldfs: [
          { tcSjubm: 0, tcSjnr: '自动过滤' },
          { tcSjubm: 1, tcSjnr: '显示' },
        ]
      },
      notSelect: [
        {
          tnXh: -1,
          tcXxxmc: '请选择'
        }
      ]
    }
  },
  watch: {
    list: {
      handler () {
        this.linkDeleteAction()
      },
      deep: true
    }
  },
  methods: {
    _SelectLinkChange(row) {
      row.tnXxxldfs = row.tnXxxldxid >= 0 ? 1 : ''
      row.tnXxxldxid < 0 && (row.tcXxxldglz = '')
    },
    _SelectLinkTypeChange (row) {
      if (row.tnXxxldfs === 0) {
        row.tcXxxxxxnr = ''
        row.tcXxxldglz = ''
      }
      this.$forceUpdate()
    },
    // 事件 - 勾选数据转换
    _CheckChange (row) {
      row.tnXxxsfbt = row.tnXxxsfbt ? 1 : 0
      row.tnSfzwcxtj = row.tnSfzwcxtj ? 1 : 0
    },
    // 事件 - 选中行变动
    _TableSelectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    // 事件 - 删除行
    _ButtonRowDeleteClick (index) {
      this.$confirm('是否删除本行?').then(() => {
        this.list.splice(index, 1)
      }).catch(() => {})
    },
    // 事件 - 调整顺序
    _ButtonRowOrderClick (index, type) {
      const row = this.list[index]
      this.list.splice(index, 1)
      this.list.splice(type === 'down' ? index -1 : index + 1, 0, row)
    },
    _SelectMethodChange (e, row) {
      const value = parseInt(e.target.value, 10)
      if (value === 1 || value === 5) {
        row.tcXxxxxxnr = ''
      }

      if (value !== 1) {
        row.tnXxxsjlx = 1
        row.tnXxxsjcd = 200
      } else {
        row.tnXxxsjcd = 50
      }
    },
    // 数据类型变化时联动数据长度
    _SelectTypeChange (e, row) {
      row.tnXxxsjcd = row.tnXxxsjlx === 1 ? 200 : 11
    },
    // 数据长度改变后判断
    _DatalengthChange (e, row) {
      const limit = row.tnXxxsjlx === 1 ? 200 : 11
      row.tnXxxsjcd = row.tnXxxsjcd > 0 ? row.tnXxxsjcd : 1
      row.tnXxxsjcd = row.tnXxxsjcd > limit ? limit : row.tnXxxsjcd
    },
    valid (e, row, type) {
      // const value = e.target.value
      // row.alert = !value
      // row.alertField = type
      // this.$forceUpdate()
    },
    getAlertClass (row, type) {
      return {'common-editable-alert': row.alert && row.alertField === type}
    },
    linkDeleteAction () {
      this.list.forEach(item => {
        if (this.list.findIndex(row => row.tnXh === item.tnXxxldxid) < 0) {
          item.tnXxxldxid = -1
          item.tnXxxldfs = '',
          item.tcXxxldglz = ''
        }
      })
    }
  },
 
}
</script>
