<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <!-- <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/> -->
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

import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'SafeManagePublish',
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
      // 列表
      list: [],
      // 已选列表
      selection: [],
      dlgAddVisble: false,
      dlgUpdateVisble: false,
      isFirstEnter: true
    }
  },
  methods: {
    $init () {
      let bindData = {}
      this._DataFilterQuery(bindData)
    },
    // 事件-条件查询
    _DataFilterQuery (query) {
      this.query = query
      this.getPublishedCheckPlanList()
    },
    // 事件-删除按钮点击
    _ButtonDeleteClick () {
      if(this.selection.length !== 0) {
        this.deleteData()
      } else {
        this.$alert('请选择要删除的数据！')
      }
    },
    // 事件-新增按钮点击
    _ButtonAddClick () {
      this.$router.push({ 
        path: '/safe/manage/publish/detail',
        query: {
          type: 'add'
        }
      })
    },
    // 事件-双击表格行列
    _DataGridDblClick (row) {
      this.currentRow = row
      this.$router.push({ 
        path: '/safe/manage/publish/detail',
        query: {
          type: 'detail',
          curPlan: row.tnAqjcjhid,
          planType: row.tnJhlx,
          tnAqjcjhid: row.tnAqjcjhid
        }
      })
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getPublishedCheckPlanList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getPublishedCheckPlanList()
    },
    // 删除数据
    deleteData () {
      this.$confirm('是否删除所选数据？').then(async () => {
        const deletes = this.selection.map(item => item.tnAqjcjhid).join(',')
        const result = await Model.deleteCheckPlan({
          isQuery: 0,
          cdId: '0004060101',
          requestData: {
            tnAqjcjhid: deletes,
          }
        })
        if (result) {
          this.$message({
            message: "删除成功！",
            type: 'success',
            showClose: true,
            duration: 1000,
            customClass: "middle",
          })
          this.getPublishedCheckPlanList()
        }
      }).catch(err => {})
    },
    // 获取列表数据
    async getPublishedCheckPlanList () {
      const result = await Model.getPublishedCheckPlanList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,
        cdId: '0004060101',
        requestData: {
          tcJhmc: this.query.tcJhmc || '',
          tnJhzt: (this.query.tnJhzt !== undefined)?(this.query.tnJhzt):'',
          begintime: (this.query.tcJhsj)?(this.query.tcJhsj[0]):'',
          endtime: (this.query.tcJhsj)?(this.query.tcJhsj[1]):'',
        }
      })
      if (result.data) {
        this.list = result.data
        for(let i in this.list) {
          if(this.list[i].tnJhzt === 0) {
            this.list[i].tnJhztmc = '进行中'
          } else if(this.list[i].tnJhzt === 1) {
            this.list[i].tnJhztmc = '完结'
          } else {
            this.list[i].tnJhztmc = '无效'
          }
        }
        this.pageTotal = result.total
      }
    },
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getPublishedCheckPlanList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
