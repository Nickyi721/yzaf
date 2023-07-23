<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="add" text="新增" @click="_ButtonClick('add')"/>
        <CustomButton icon="delete" text="删除" @click="_ButtonClick('delete')"/>
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
  name: 'InfoReportTaskPublish',
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
      list: [],
      selection: [],
      query: {},
      isFirstEnter: true
    }
  },
  methods: {
    $init(options) {
      this.getTaskList();
    },
    // 查询
    _DataFilterQuery(query) {
      this.query = query
      this.getTaskList();
    },
    // 顶部按钮点击
    _ButtonClick(type) {
      if(type === 'delete') {
        if(this.selection.length < 1) {
          this.$alert('请选择要删除的数据！').catch(err => {})
        } else {
          this.$confirm('是否删除所选数据？').then(() => {
            this.deleteData(this.selection)
          }).catch(err => {})
        }
      } else {
        this.$router.push({
          path: '/info/report/task-publish/detail',
          query: {
            type: 'add'
          }
        })
      }
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({
        path: '/info/report/task-publish/detail', 
        query: {
          type: 'update',
          tnRwid: row.tnRwid
        }
      })
    },
    // 事件-行选
    _DataGridSelectionChange(selection) {
      this.selection = selection;
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
    async getTaskList() {
      const result = await Model.getTaskList({
        isQuery: 1,
        cdId: '0004030302',
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcRwmc: this.query.tcRwmc || '',
          tcMbmc: this.query.tcMbmc || '',
          tnRwzt: this.query.tnRwzt!=undefined?this.query.tnRwzt:'',
          beginTime: this.query.tcRwsj?this.query.tcRwsj[0]:'',
          endTime: this.query.tcRwsj?this.query.tcRwsj[1]:''
        }
      })
      if (result && result.data) {
        this.list = result.data
        this.list.forEach(item => {
          item.tnRwsj = Moment(item.tdCjsj).format('YYYY-MM-DD')
          if(item.tnRwzt === 0) {
            item.tnRwztmc = '进行中'
          } else if(item.tnRwzt === 1) {
            item.tnRwztmc = '完结'
          } else {
            item.tnRwztmc = '无效'
          }
        })
        this.pageTotal = result.total
      }
    },
    async deleteData(selection) {
      let tnRwidList = []
      selection.forEach((element) => {
        tnRwidList.push(element.tnRwid)
      });
      const result = await Model.deleteTaskList({
        isQuery: 0,
        cdId: '0004030302',
        requestData: {
          tnRwid: tnRwidList,
        }
      })
      if (result.state === '1') {
        this.$message({
          message:'删除成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle',
          showClose: true,
        })
        this.getTaskList()
      }
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
