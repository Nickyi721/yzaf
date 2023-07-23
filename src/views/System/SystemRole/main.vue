<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar slot="top">
        <CustomButton icon="delete" text="删除" @click="_ButtonClick('delete')"/>
        <CustomButton icon="add" text="新增" @click="_ButtonClick('add')"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

    </CustomView>
</template>


<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Moment from 'moment'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'SystemRole',
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
      // 查询条件
      query: {},
      // 数据列表
      list: [],
      // 已选列表
      selection: [],
      isFirstEnter: true
    }
  },
  methods: {
    // 页面初始化
    $init(options) {
      this.getListData()
    },
    _DataFilterQuery(query) {
      this.query = query
      this.getListData()
    },
    // 事件-点击新增用户按钮
    _ButtonAddClick() {
      this.$router.push({ path: '/system/role/add' }) 
    },
    // 事件-表格按钮点击
    _ButtonClick (type) {
      switch (type) {
        case 'delete':
          if (this.selection.length > 0) {
            this.$confirm('是否删除所选数据？').then(() => {
              this.deleteData(this.selection)
            }).catch(err => {})
          } else {
            this.$alert('请选择需要删除的数据！').catch(err => {})
          }
          break
        case 'add':
          this.$router.push({ path: '/system/role/add' }) 
          break
      }
    },
     // 删除数据
    async deleteData (selection) {
      const deletes = selection.map(item => item.tnJsid)
      const result = await Model.deleteRoleItem({
        requestData: {
          delete: deletes
        }
      })
      if (result.state === '1') {
        this.refresh()
      }
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({ path: '/system/role/detail', query: { roleId: row.tnJsid } }) 
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows=num
      this.pageNum = 1
      this.getListData()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getListData()
    },
    // 获取列表数据
    async getListData () {
      const result = await Model.getDataRoleList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcJsmc: this.query.tcJsmc,
        }
      })
      if (result.data) {
        this.list = result.data.map(item => {
          item.tcCjsj = Moment(item.tcCjsj).format('YYYY-MM-DD')
          return item
        })
        this.pageTotal = result.total
      }
    },
    refresh () {
      this.getListData()
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
