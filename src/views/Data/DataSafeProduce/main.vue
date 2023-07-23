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
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'DataSafeDanger',
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
      selection:[],
      isFirstEnter: true
    }
  },
  methods: {
    $init(){
      this.getDataList()
    },
    _DataFilterQuery(params){
      this.query = params
      this.getDataList()
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getDataList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getDataList()
    },
    // 事件-点击删除按钮
    _ButtonDeleteClick() {
      if (this.selection.length) {
         this.$confirm('是否删除所选数据？').then(() => {
            this.deleteData(this.selection)
          }).catch(err => {})
      }else{
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    async deleteData(){
      const result = await Model.deleteData({
        isQuery:0,  //是否是查询类 0-否 1-是
        cdId:'0004010501', //菜单ID
        requestData: {
          "tnSbssnrpzidArr":this.selection.map(item => item.tnSbssnrpzid)
        }
      })
      if (result) {
        this.$message({
          message: result.msg,
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.getDataList()
      }
    },
    //新增按钮
    _ButtonAddClick(){
      this.$router.push({ path: '/data/safe-prod/detail', query: {type: 'add'} }) 
    },
    //双击查看详细
    _DataGridDblClick(row){
      this.$router.push({ path: '/data/safe-prod/detail', query: {type: 'detail', tnSbssnrpzid: row.tnSbssnrpzid}}) 
    },
    //数据选择
    _DataGridSelectionChange(selection){
      this.selection = selection
    },
    //获取列表
    async getDataList () {
      const result = await Model.getDataList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
        requestData: this.query
      })
      if (result.data) {
        this.list = result.data.list
        this.pageTotal = result.total
      }
    },
  },
  activated () {
    if(!this.isFirstEnter) {
      this.$init()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
