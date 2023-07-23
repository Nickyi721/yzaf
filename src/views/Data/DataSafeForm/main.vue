<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import Moment from 'moment'

import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'DataSafeForm',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
  },
  data () {
    return {
      query: {},
      list: [],
      selection: [],
      isFirstEnter: true
    }
  },
  methods: { 
    $init (options) {
      this.getListData()
    },
    // 事件-条件查询
    _DataFilterQuery (data) {
      this.query = data
      this.getListData()
    },
    // 事件-新增按钮点击
    _ButtonAddClick () {
      this.$router.push({ path: '/data/safe/form/detail', query: { type: 'add' } })
    },
    // 事件-删除按钮点击
    _ButtonDeleteClick () {
      if (this.selection.length > 0) {
        this.$confirm('是否删除所选检查表？').then(() => {
          this.deleteData(this.selection.map(item => item.tnAqjcbid.toString()))
        }).catch(err => {})
      } else {
        this.$alert('请选择需要删除的检查表！').catch(err => {})
      }
    },
    // 事件-双击表格行列
    _DataGridDblClick (row) {
      this.$router.push({ path: '/data/safe/form/detail', query: { type: 'update', id: row.tnAqjcbid } })
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getListData()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getListData()
    },
    // 获取列表
    async getListData () {
      const result = await Model.getSafeFormList({
        requestData: this.query
      })
      if (result.data) {
        result.data.forEach(item => {
          item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD')
        })
        this.list = result.data
        this.pageTotal = result.total
      }
    },
    async deleteData (ids) {
      const result = await Model.deleteSafeForm(
        {
        requestData: {
          isQuery:0,  //是否是查询类 0-否 1-是
          cdMc:'安全检查表', //菜单ID
          cdId:'0004010502',
          tnAqjcbidArr: ids
        }
      })
      if (result) {
        if(result.state == '1'){
          this.$message({
            message: '删除成功!',
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true,
          })
          this.getListData()
        }
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getListData()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
