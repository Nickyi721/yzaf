<template>
  <CustomView>
    <CustomToolbar slot="top">
      <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
      <CustomButton icon="add" text="新增" @click="_ButtonClick" />
    </CustomToolbar>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="selectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange" />
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'InfoReportCustomize',
  mixins: [
    Mixin.init,
    Mixin.page
  ],
  components: {
    DataGrid
  },
  data () {
    return {
      list: [],
      selection: [],
      isFirstEnter: true
    }
  },
  methods: {
    $init (options) {
      this.getTemplateList()
    },
    selectionChange (selection, i) {
      this.selection = selection
    },
    // 事件 - 点击删除按钮
    _ButtonDeleteClick () {
      if (this.selection.length !== 0) {
        this.deleteData()
      } else {
        this.$alert('请选择要删除的数据！')
      }
    },
    // 删除数据
    async deleteData () {
      this.$confirm('是否删除所选数据？').then(async () => {
        const delIds = this.selection.map(item => item.tcZdybbid)
        const result = await Model.deleteData({ delIds })
        if (result.state === '1') {
          this.$message({
            message: '删除成功',
            duration: 1000,
            onClose: () => {
              this.$init()
            }
          })
        }
      }).catch(() => { })
    },
    _DataGridDblClick (row) {
      this.$router.push({
        path: '/info/report/customize/detail',
        query: {
          type: 'update',
          templateId: row.tcZdybbid
        }
      })
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getTemplateList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getTemplateList()
    },
    // 顶部按钮
    _ButtonClick () {
      this.$router.push({
        path: '/info/report/customize/detail',
        query: {
          type: 'add'
        }
      })
    },
    async getTemplateList () {
      const result = await Model.getTemplateList({
        rows: this.pageRows,
        pageNum: this.pageNum,
      })
      if (result.data) {
        this.list = result.data
        this.pageTotal = result.total
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getTemplateList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
