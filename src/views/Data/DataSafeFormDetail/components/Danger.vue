<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" :JcfsTypes="JcfsTypes" :SslbTypes="SslbTypes" :SshjTypes="SshjTypes" :YwtxTypes="YwtxTypes" :CtztTypes="CtztTypes" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="add" text="确定选择" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    <!-- 数据表格 -->
    <DataGrid ref='dangerList' :list="list" :checked="checked" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from '../model.js'

// 页面组件
import DataFilter from './DataFilter.vue'
import DataGrid from './DataGrid.vue'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
  },
  props: {
    checked: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      query: {
        tcCtnr: '',
        tcYwtxid: '',
        tcSshjid: '',
        tcSslbid: '',
        tcJcfsid: '',
        tnCtzt: ''
      },
      list: [],
      selection: [],
      selected: [],
      JcfsTypes: [],
      SslbTypes: [],
      SshjTypes: [],
      YwtxTypes: [],
      CtztTypes: [
        {"tcSjubm":"","tcSjnr":"全部"},
        {"tcSjubm":"0","tcSjnr":"启用"},
        {"tcSjubm":"1","tcSjnr":"停用"}
      ]
    }
  },
  methods: {
    $init(){
      this.getJcfsTypes()
      this.getSslbTypes()
      this.getSshjTypes()
      this.getYwtxTypes()
      this.getDataList()
    },
    _DataFilterQuery(params){
      this.pageNum = 1
      this.query = params
      this.selection = []
      this.selected = []
      this.getDataList()
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.selection = []
      this.selected = []
      this.getDataList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.selection = []
      this.selected = []      
      this.getDataList()
    },
    //新增按钮
    _ButtonAddClick(){
      if (this.selected.length) {
        this.$confirm('是否选择所选数据？').then(() => {
            this.$emit('select', this.selected)
        }).catch(err => {})
      } else{
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },

    //数据选择
    _DataGridSelectionChange(selection){
      this.selection = selection
      const uncheck = this.list.filter(item => this.selection.findIndex(row => row.tnYhctid === item.tnYhctid) < 0)
      const addList = this.selection.filter(row => this.selected.filter(item => row.tnYhctid === item.tnYhctid).length <= 0 && row)
      this.selected = this.selected.concat(addList)
      this.selected = this.selected.filter(item => uncheck.findIndex(row => row.tnYhctid === item.tnYhctid) < 0)
    },
    clearSelection(){
      this.$refs.dangerList.clearSelection()
    },
    //获取列表
    async getDataList () {
      const result = await Model.getDataList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010502', //菜单ID
        requestData: this.query
      })
      if (result.data) {
        this.list = result.data.list
        this.pageTotal = result.total
      }
    },
    async getJcfsTypes(){
      const result = await Model.getJcfsTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010502', //菜单ID
        requestData: ''
      })
      let all = [{"tcSjubm":"","tcSjnr":"全部"}]
      this.JcfsTypes = all.concat(result.data)
    },
    async getSslbTypes(){
      const result = await Model.getSslbTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010502', //菜单ID
        requestData: ''
      })
      let all = [{"tcSjubm":"","tcSjnr":"全部"}]
      this.SslbTypes = all.concat(result.data)
    },
    async getSshjTypes(){
      const result = await Model.getSshjTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010502', //菜单ID
        requestData: ''
      })
      let all = [{"tcSjubm":"","tcSjnr":"全部"}]
      this.SshjTypes = all.concat(result.data)
    },
    async getYwtxTypes(){
      const result = await Model.getYwtxTypes({
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'0004010502', //菜单ID
        requestData: ''
      })
      let all = [{"tcSjubm":"","tcSjnr":"全部"}]
      this.YwtxTypes = all.concat(result.data)
    }
  }
}
</script>
