<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" />
      <CustomToolbar>
        <CustomButton icon="continue" text="申请重报" @click="_ButtonClick" />
      </CustomToolbar>
    </div>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange" />
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'InfoReportTaskQuery',
  mixins: [
    Mixin.init,
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid
  },
  data () {
    return {
      list: [],
      selection: [],
      query: {},
      isFirstEnter: true
    }
  },
  methods: {
    $init (options) {
      this.getTaskList()
    },
    // 查询
    _DataFilterQuery (query) {
      this.query = query
      this.getTaskList()
    },
    // 顶部按钮点击
    _ButtonClick () {
      if (!this.selection.length) {
        this.$alert('请选择要操作的记录！')
        return
      }
      this.$confirm('是否重填所选数据？').then(async () => {
        const delIds = this.selection.map(item => item.tnRwid)
        const result = await Model.applyData({
          rwidArr: delIds
        })
        if (result.state === '1') {
          this.$message({
            message: '操作成功',
            duration: 1000,
            onClose: () => {
              this.$init()
            }
          })
        }
      }).catch(() => { })
    },
    // 事件-双击表格行
    _DataGridDblClick (row) {
      if(row.tnLx === 0) {
        this.queryRwzt(row)
      } else {
        this.$router.push({ path: '/info/report/task-query/detail', query: row })
      }
    },
    // 判断是否填报
    async queryRwzt(row) {
      const result = await Model.queryRwzt({
        isQuery: 1,
        cdId: '0004030303',
        requestData: {
          tnRwid: row.tnRwid,
          tnLx: row.tnLx,
        }
      })
      if(result.data && result.data.length !== 0) {
        result.data[0].tcMbid = row.tcMbid
        // 已填报-判断是保存还是已提交
        if(row.tnTbzt === 0) {
          // 已保存--修改、提交
          this.$router.push({ 
            path: '/info/report/task-query/base-form', 
            query: {
              row: JSON.stringify(result.data[0])
            } 
          })
        } else {
          // 已提交--预览
          this.$router.push({ 
            path: '/info/report/task-query/base-form/detail', 
            query: {
              row: JSON.stringify(result.data[0])
            } 
          })
        }
      } else {
        // 未填报
        this.$router.push({ 
          path: '/info/report/task-query/base-form', 
          query: {
            row: JSON.stringify(row)
          } 
        })
      }
    },
    // 事件-行选
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getTaskList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getTaskList()
    },
    async getTaskList () {
      const result = await Model.getTaskList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,
        cdId: '0004030303',
        requestData: {
          tcRwmc: this.query.tcRwmc || '',
          tcMbmc: this.query.tcMbmc || '',
          startTime: this.query.tcRwsj ? this.query.tcRwsj[0] : '',
          endTime: this.query.tcRwsj ? this.query.tcRwsj[1] : '',
          tnRwzt: (this.query.tcRwzt !== undefined) ? this.query.tcRwzt : '',
        }
      })
      if (result && result.data) {
        this.list = result.data.list || []
        this.list.forEach(item => {
          if (item.tnRwzt === 0) {
            item.tnRwztmc = '进行中'
          } else if (item.tnRwzt === 1) {
            item.tnRwztmc = '完结'
          } else {
            item.tnRwztmc = '无效'
          }
        })
        this.pageTotal = result.total
      }
    },
    async deleteData () {

    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getTaskList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
