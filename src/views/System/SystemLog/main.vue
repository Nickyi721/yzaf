<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter v-if="active == 'first'" ref="dataFilter" @query="_DataFilterQuery"/>
      <SjscFilter v-if="active == 'second'" @query="_SjscFilterQuery"/>
      <FwqyxFilter v-if="active == 'third'" @query="_FwqyxFilterQuery"/>
      <el-tabs v-model="active" >
        <el-tab-pane label="操作日志" name="first"></el-tab-pane>
        <el-tab-pane label="数据审查" name="second"></el-tab-pane>
        <el-tab-pane label="服务器运行" name="third"></el-tab-pane>
      </el-tabs>      
      <CustomToolbar>
        <CustomButton icon="export" text="导出" @click="_ButtonExportClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid v-if="active == 'first'" :list="list" @dblclick="_DataGridDblClick">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

    <SjscData v-if="active == 'second'" :list="sjscList" @dblclick="_SjscGridDblClick">
      <CustomPage :total="sjscpageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </SjscData>

    <FwqyxData v-if="active == 'third'" :list='fwqyxList' @dblclick="_FwqyxGridDblClick">
      <CustomPage :total="fwqyxpageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </FwqyxData>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Moment from 'moment'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import SjscFilter from './components/SjscFilter.vue'
import FwqyxFilter from './components/FwqyxFilter.vue'
import DataGrid from './components/DataGrid.vue'
import SjscData from './components/SjscData.vue'
import FwqyxData from './components/FwqyxData.vue'

export default {
  name: 'SystemLog',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
    SjscData,
    SjscFilter,
    FwqyxData,
    FwqyxFilter
  },
  data () {
    return {
      query: {
        range: [Moment().subtract(1, 'days').format('YYYY-MM-DD'), Moment().format('YYYY-MM-DD')]
      },
      sjscquery: {
        range: [Moment().subtract(1, 'days').format('YYYY-MM-DD'), Moment().format('YYYY-MM-DD')]
      },
      fwqyxquery: {
        range: [Moment().subtract(1, 'days').format('YYYY-MM-DD'), Moment().format('YYYY-MM-DD')],
      },
      // 数据列表
      list: [],
      sjscList: [],
      fwqyxList: [],
      active: 'first',
      isFirstEnter: true
    }
  },
  methods: {
    $init () {
      this.getLogList()
      this.getSjscList()
      this.getfwqyxList()
      console.log(this.fwqyxquery)
    },
    // 事件-查询
    _DataFilterQuery(query) {
      this.query = query
      this.getLogList()
    },
    _SjscFilterQuery(query) {
      this.sjscquery = query
      this.getSjscList()
    },
    _FwqyxFilterQuery(query) {
      this.fwqyxquery = query
      console.log(this.fwqyxquery)      
      this.getfwqyxList()
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({ path: '/system/log/detail', query: { id: row.tnId } }) 
    },
    _SjscGridDblClick(row) {
      this.$router.push({ path: '/system/log/sjscdetail', query: { id: row.tnSjscid } }) 
    },
    _FwqyxGridDblClick(row) {
      this.$router.push({ path: '/system/log/fwqyxdetail', query: { id: row.tnFwqyxqkid } }) 
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      if(this.active == 'first'){
        this.getLogList()      
      }else if(this.active == 'second'){
        this.getSjscList()
      }else{
        this.getfwqyxList()
      }    
      // this.getLogList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      // this.getLogList()
      if(this.active == 'first'){
        this.getLogList()      
      }else if(this.active == 'second'){
        this.getSjscList()
      }else{
        this.getfwqyxList()
      }      
    },
    _ButtonExportClick() {
      if(this.active == 'first'){
        this.exportTable()      
      }else if(this.active == 'second'){
        this.exportSjscTable()
      }else{
        this.exportFwqyxTable()
      }
    },
    // handleClick() {
    //   this.query = {}
    //   this.sjscquery = {}
    //   this.fwqyxquery = {}
    // },
    async exportTable() {
      const result = await Model.exportTable({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcCzrzh: this.query.tcCzrzh,
          tcFfmc: this.query.tcFfmc,
          begintime: this.query.range[0],
          endtime: this.query.range[1],
        }
      })
      if(result){
        this.$message({
          message: '导出成功',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        const content = result
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `操作日志.xls`
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
    },
    async exportSjscTable() {
      const result = await Model.exportSjscTable({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData:{
          tcYwgnbm: this.sjscquery.tcYwgnbm,
          tcYcyybm: this.sjscquery.tcYcyybm,
          tnSfjj: this.sjscquery.tnSfjj,
          tdKssj: this.sjscquery.range&&this.sjscquery.range[0],
          tdJssj: this.sjscquery.range&&this.sjscquery.range[1]
        }
      })
      if(result){
        this.$message({
          message: '导出成功',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        const content = result
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `数据审查日志.xls`
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
    },
    async exportFwqyxTable() {
      console.log(this.fwqyxquery)
      const result = await Model.exportFwqyxTable({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData:{
          tcIp: this.fwqyxquery.tcIp,
          tcPort: this.fwqyxquery.tcPort,
          tnLx: this.fwqyxquery.tnLx,
          tnSflt: this.fwqyxquery.tnSflt,
          tdKssj: this.fwqyxquery.range&&this.fwqyxquery.range[0],
          tdJssj: this.fwqyxquery.range&&this.fwqyxquery.range[1]
        }
      })
      if(result){
        this.$message({
          message: '导出成功',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        const content = result
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `服务器运行日志.xls`
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
    },
    // 获取日志列表
    async getLogList () {
      const result = await Model.getLogList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcCzrzh: this.query.tcCzrzh,
          tcFfmc: this.query.tcFfmc,
          begintime: this.query.range&&this.query.range[0],
          endtime: this.query.range&&this.query.range[1],
        }
      })
      if (result.data) {
        this.list = result.data.map(item => {
          item.tdCzsj = Moment(item.tdCzsj).format('YYYY-MM-DD HH:mm:ss')
          return item
        })
        this.pageTotal = result.total
      }
    },
    async getSjscList() {
      const result = await Model.getSjscList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData:{
          tcYwgnbm: this.sjscquery.tcYwgnbm,
          tcYcyybm: this.sjscquery.tcYcyybm,
          tnSfjj: this.sjscquery.tnSfjj,
          tdKssj: this.sjscquery.range&&this.sjscquery.range[0],
          tdJssj: this.sjscquery.range&&this.sjscquery.range[1]
        }
      })
      if(result.data){
        this.sjscList = result.data.map(item => {
          item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD HH:mm:ss')
          return item
        })
        this.sjscpageTotal = result.total
      }      
    },
    async getfwqyxList() {
      const result = await Model.getfwqyxList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData:{
          tcIp: this.fwqyxquery.tcIp,
          tcPort: this.fwqyxquery.tcPort,
          tnSflt: this.fwqyxquery.tnSflt,
          tnLx: this.fwqyxquery.tnLx,
          tdKssj: this.fwqyxquery.range&&this.fwqyxquery.range[0],
          tdJssj: this.fwqyxquery.range&&this.fwqyxquery.range[1]
        }          
      })
      if(result.data){
        this.fwqyxList = result.data.map(item => {
          item.tdCssj = Moment(item.tdCssj).format('YYYY-MM-DD HH:mm:ss')
          return item
        })
        this.fwqyxpageTotal = result.total        
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getLogList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
