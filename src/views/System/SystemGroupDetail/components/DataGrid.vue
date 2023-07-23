<template lang="html">
  <div class="common-grid" ref="container" :style="{ 'paddingBottom': $slots.default ? '40px' : '0px'}">
    <el-table ref="table" v-show="multi" class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" @select-all="_TableSelectAll" @select="_TableSelect">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="用户账户" prop="tcYhzh" width="150px">
        <template slot-scope="scope">
          <span title='请勾选用户'>{{scope.row.tcYhzh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="tcYhmc" width="150px">
        <template slot-scope="scope">
          <span title='请勾选用户'>{{scope.row.tcYhmc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" prop="c_sjibm" width="150px">
        <template slot-scope="scope">
          <span title='请勾选用户'>{{scope.row.c_sjibm}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="tcCjr" width="150px">
        <template slot-scope="scope">
          <span title='请勾选用户'>{{scope.row.tcCjr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="tdCjsj" width="150px">
        <template slot-scope="scope">
          <span title='请勾选用户'>{{scope.row.tdCjsj}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="tcDwmc" min-width="300px">
        <template slot-scope="scope">
          <span title='请勾选用户'>{{scope.row.tcDwmc}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-show="!multi" class="grid-table" header-cell-class-name="table-hd" stripe :border="border" highlight-current-row size="mini" height="100%" :data="list" :row-class-name="$listeners.dblClick ? 'click-row' : ''" @row-dblclick="_TableDblClick">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="用户账户" prop="tcYhzh" width="150px">
        <template slot-scope="scope">
          <span title='请双击选择用户'>{{scope.row.tcYhzh}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" prop="tcYhmc" width="150px">
        <template slot-scope="scope">
          <span title='请双击选择用户'>{{scope.row.tcYhmc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" prop="c_sjibm" width="150px">
        <template slot-scope="scope">
          <span title='请双击选择用户'>{{scope.row.c_sjibm}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="tcCjr" width="150px">
        <template slot-scope="scope">
          <span title='请双击选择用户'>{{scope.row.tcCjr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="tdCjsj" width="150px">
        <template slot-scope="scope">
          <span title='请双击选择用户'>{{scope.row.tdCjsj}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" prop="tcDwmc" min-width="300px">
        <template slot-scope="scope">
          <span title='请双击选择用户'>{{scope.row.tcDwmc}}</span>
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
    checked: {
      type: Array,
      default: () => []
    },
    multi: Boolean
  },
  data () {
    return {
      selected: this.checked.map(item => ({
        tnYhid: parseInt(item.tcBm, 10),
        tcYhmc: item.tcMc
      }))
    }
  },
  watch: {
    list: {
      handler () {
        this.checkSelected()
      },
      deep: true
    },
    checked: {
      handler () {
        this.selected = this.checked.map(item => ({
          tnYhid: parseInt(item.tcBm, 10),
          tcYhmc: item.tcMc
        }))
        this.checkSelected()
      },
      deep: true
    },
  },
  methods: {
    checkSelected () {
      this.list.forEach(item => {
        const idx = this.checked.findIndex(selected => parseInt(selected.tcBm, 10) === item.tnYhid)
        if (idx >= 0) {
          this.$nextTick(() => {
            this.$refs.table.toggleRowSelection(item, true)
          })
        }
      })
    },
    _TableSelectAll(selection) {
      if (selection.length) {
        this.selected = this.selected || []
        selection.forEach(item => {
          const idx = this.selected.findIndex(el => el.tnYhid === parseInt(item.tnYhid, 10))
          if(idx < 0){
            this.selected.push(item)
          }
          // (idx < 0) && this.selected.push(item)
        })
      } else {
        this.list.forEach(item => {
          const idx = this.selected.findIndex(el => el.tnYhid === parseInt(item.tnYhid, 10))
          if(idx >= 0){
            this.selected.splice(idx, 1)
          }
          // (idx >= 0) && this.selected.splice(idx, 1)
        })
      }
      this.$emit('select', this.selected)
    },
    _TableSelect (selection, row) {
      const checked = selection.findIndex(item => parseInt(item.tnYhid, 10) === parseInt(row.tnYhid, 10)) >= 0
      const idx = this.selected.findIndex(item => parseInt(row.tnYhid, 10) === parseInt(item.tnYhid, 10))
      if (checked) {
        (idx < 0) && this.selected.push(row)
      } else {
        (idx >= 0) && this.selected.splice(idx, 1)
      }
      this.$emit('select', this.selected)
    }
  }
}
</script>