<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree slot="side" fnCode="000406" @check-change="_TreeCheckChange" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

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
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Moment from 'moment'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'SafeExecOffsite',
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
      begintime:'',
      endtime:'',
      currentOrg:{},
      id:[],
      isFirstEnter: true
    }
  },
  methods: {
    //新增按钮
    _ButtonAddClick(){
      this.$router.push({ path: '/safe/exec/off-site/detail', query: { type: 'add', tcBdwdm: this.currentOrg.id, tcBdwmc: this.currentOrg.name } }) 
    },
    // 事件-点击树结点
    _OrgTreeClick(node) {
      this.currentOrg = node
      this.currentOrg.id=node.id
      this.pageNum = 1
      this.getOffSiteCheList()
    },
    _TreeCheckChange(node,checked){
      this.currentOrg = node
      if(checked==true){
        this.id.push(node.id)
      }else{
        this.id.pop()
      }
      this.pageNum = 1
      this.getOffSiteCheList()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      if (node) {
        this.getOffSiteCheList()
      }
    },
    // 事件-机构树加载完成
    _DataFilterQuery(query) {
      this.query = query
      console.log(query)
      this.begintime = !!query.time ? query.time[0] : ''
      this.endtime = !!query.time ? query.time[1] : ''
      this.getOffSiteCheList()
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({ path: '/safe/exec/off-site/detail', query: { type: 'update', tnFxcjcxxid: row.tnFxcjcxxid } }) 
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getOffSiteCheList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getOffSiteCheList()
    },
    // 获取列表
    async getOffSiteCheList () {
      const result = await Model.getOffSiteCheList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          endtime: this.endtime,
          begintime: this.begintime,
          tcDwdm: this.currentOrg.id
        }
      })
      if (result.data) {
        this.list = result.data.map(item => {
          item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD')
          return item
        })
        this.pageTotal = result.total
      }
    },
  },
  created () {
    this.getOffSiteCheList()
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getOffSiteCheList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
