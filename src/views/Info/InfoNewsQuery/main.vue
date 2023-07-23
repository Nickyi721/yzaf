<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" :infoTypes="infoTypes" :infoStates="infoStates" :handleStates="handleStates" @query="_DataFilterQuery"/>
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
      query: {
        tcXxbt: '',
        tcLx: '',
        tnBlbz: '',
        tnDqbz: '',
        startDate: '',
        endDate: ''
      },
      list: [],
      selection:[],
      currentRow:'',
      infoTypes:[],
      infoStates:[
        {"tcSjubm":"","tcSjnr":"全部"},
        {"tcSjubm":"0","tcSjnr":"待阅"},
        {"tcSjubm":"1","tcSjnr":"已阅"}
      ],
      handleStates:[
        {"tcSjubm":"","tcSjnr":"全部"},
        {"tcSjubm":"0","tcSjnr":"待办"},
        {"tcSjubm":"1","tcSjnr":"已办"}
      ],
      isFirstEnter: true
    }
  },
  methods: {
    $init(){
      this.getInfoTypes()
      // this.getInfoStates()
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
    //双击查看详细
    _DataGridDblClick(row){
      this.currentRow = row
      this.$router.push({ name: 'infoNewsQueryDetail', params: {tnXxid: row.tnXxid, tnBlbz: row.tnBlbz||-10, sffsdw: row.sffsdw?1:0} }) 
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
	      cdId:'0004030102', //菜单ID
        requestData: this.query
      })
      if (result.data) {
        this.list = result.data.list
        this.pageTotal = result.total
      }
    },
    async getInfoTypes(){
      const result = await Model.getInfoTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004030102', //菜单ID
        requestData: ''
      })
      let all = [{"tcSjubm":"","tcSjnr":"全部"}]
      this.infoTypes = all.concat(result.data)
    },
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getDataList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
