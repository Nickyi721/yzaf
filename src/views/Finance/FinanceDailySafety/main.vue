<template>
    <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000405" module="normal" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <el-tabs v-model="activeTab" @tab-click="_TabClick">
        <el-tab-pane :label="tab.tcSjnr" v-for="(tab, $index) in equipType" :key="$index"></el-tab-pane>
      </el-tabs>      
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          {{currentOrg.name}}
        </span>
        <CustomButton v-if="list.length" icon="export" text="导出" @click="_ExportClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>
//共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Moment from "moment"
import request from '@commons/request.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'


export default {
  name: 'FinanceDailySafety',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
  },    
  data() {
    return{
      dict: ['031102'],
      list:[],
      currentOrg:{},
      query:{},
      selection:[],
      activeTab:'',
      equipType:[],
      tcBjdwbm:'',
      isFirstEnter: true
    }
  },
  methods: {
    $init(options) {
      this.equipType = options['031102']
      this.getGridData()
    },
    _DataGridSelectionChange(selection) {
      this.selection = selection
    },
    // 选项卡切换
    _TabClick(row) {
      console.log(this.activeTab)
    },
    // 查询
    _DataFilterQuery(query) {
      this.query = query
      this.query.tcBjdwbm = this.tcBjdwbm
      this.getFilterData()
    },
    // 双击进入详情页面
    _DataGridDblClick(row) {
      this.$router.push({
          path:'/finance/daily/safety/detail',
          query: {
              tcJcrmc: row.tcJcrmc,
              tnRcaqjctoid: row.tnRcaqjctoid,
              tcBz: row.tcBz,
              tcZbfzr: row.tcZbfzr,
              tnJczt: row.tnJczt
          }
      })      
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getGridData()
    },
    //事件-翻页 
    _PageChange (num) {
      this.pageNum = num
      this.getGridData()
    },    
    //事件-加载树
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      this.tcBjdwbm = node.id
      this.getGridData()
    },    
    //事件-点击树
    _OrgTreeClick(node) {
      this.currentOrg = node
      this.tcBjdwbm = node.id
      this.getGridData()
    },

    //获取表格数据
    async getGridData() {
      const result = await Model.getGridData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,
        cdId:'0004050301',
        requestData:{
          tcBjdwbm: this.tcBjdwbm
        }
      })
      if(result.data){
        this.list = result.data
        this.list.forEach(item => item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD HH:mm:ss'))
        this.pageTotal = result.total
      }
    },
    // 条件查询表格数据
    async getFilterData() {
      const result = await Model.getGridData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,
        cdId:'0004050301',
        requestData: this.query
      })
      if(result.data){
        this.list = result.data
        this.list.forEach(item => item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD HH:mm:ss'))
        this.query.beginDate = ''
        this.query.endDate = ''
      }
    },
    _ExportClick() {
      // 后端导出
      request({
        url: '/rcaqjc/exportlist',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          rows: this.pageRows,
          pageNum: this.pageNum,
          isQuery: 0,
          cdId:'0004050301',
          requestData: this.query
        }
      }).then((res) => { // 处理返回的文件流
        if(res == undefined){
          this.$message({
            message:'下载失败,请联系管理员!',
            type:"fail",
            duration:1000,
            customClass: "middle"
          })
        }else{
          const content = res
          const blob = new Blob([content])
          let year = new Date().getFullYear()
          let month = new Date().getMonth() + 1
          let strDate = new Date().getDate()
          if (month >= 1 && month <= 9) {
            month = '0' + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
          }
          const myDate = year + month + strDate
          const fileName = '日常安全管理列表-' + myDate
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName + '.xls'
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        }
      })
    }
  }
}
</script>

