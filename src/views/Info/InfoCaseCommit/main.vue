<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="add" text="新增" @click="_ButtonClick('add')"/>
        <CustomButton icon="continue" text="续报" @click="_ButtonClick('continue')"/>
        <CustomButton icon="continue" text="完结" @click="_ButtonClick('end')"/>
        <CustomButton icon="continue" text="重新填报" @click="_ButtonClick('unlock')"/>
        <CustomButton icon="export" text="生成报告书模板" @click="_ButtonClick('export')"/>
        <CustomButton icon="export" text="导出" @click="_ButtonExportClick"/>
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

import request from '@commons/request.js'
export default {
  name: 'InfoCaseCommit',
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
      dict: ['040204'],
      list: [],
      selection: [],
      query:{},
      isFirstEnter: true
    }
  },
  methods: {
    $init (options) {
      this.getInfoList()
    },
    _DataFilterQuery(query) {
      this.query = query
      this.getInfoList();
    },
    async _ButtonClick (type) {
      switch (type) {
        case 'add': 
          this.$router.push({path: '/info/case/commit/detail', query: {type: 'add'}})
          break;
        case 'continue':
          if (this.selection.length > 1) {
            this.$alert("只能选择一条记录！").catch(err => {})
          } else if(this.selection.length < 1) {
            this.$alert("请选择要操作的数据！").catch(err => {})
          } else {
            if(this.selection[0].tnGwsj === 1) {
              this.$alert("当前所选为过往事件，不可续报！").catch(err => {})
            } else if(this.selection[0].tnSjztmc === '完结'){
              this.$alert("当前所选为已经完结，不可续报！").catch(err => {})  
            } else if(this.selection[0].tnSjztmc === '申请重新填报'){
              this.$alert("当前所选为申请重新填报，不可续报！").catch(err => {})
            } else {
              this.$router.push({path: '/info/case/commit/detail_update', query: {type: 'continue', id: this.selection[0].tnXxcbid }})
            }
          }
          break;
        case 'end':
          if (this.selection.length > 1) {
            this.$alert("只能选择一条记录！").catch(err => {})
          } else if(this.selection.length < 1) {
            this.$alert("请选择要操作的数据！").catch(err => {})
          } else {
             if(this.selection[0].tnSjztmc === '完结'){
              this.$alert("当前所选为已经完结，不可再完结！").catch(err => {})  
            } else if(this.selection[0].tnSjztmc === '申请重新填报'){
              this.$alert("当前所选为申请重新填报，不可完结！").catch(err => {})
            } else {
              this.$router.push({path: '/info/case/commit/end', query: {type: 'end', id:this.selection[0].tnXxcbid}})
            }
          }
          break;
        case 'unlock': 
          if(this.selection.length === 1) {
            if (this.selection[0].tnSjztmc !== '完结') {
              this.$alert("只能对事件状态为完结的记录申请").catch(err => {})
            } else {
              const result = await Model.sqcxsb({
                isQuery: 0,
                cdId: '0004030201',
                requestData: {
                  tnXxcbid: this.selection[0].tnXxcbid,
                }
              })
              if(result.state === '1') {
                this.$message({
                  message: "请求重新填报成功!",
                  type: 'success',
                  showClose: true,
                  duration: 1000,
                  customClass: "middle",
                })
                this.getInfoList();
              }
            }
            
          } else  if(this.selection.length < 1) {
            this.$alert('请选择要操作的数据！')
          } else {
            this.$alert('只能选择一条记录！')
          }
          break;
        case 'export':
          if(this.selection.length === 1) {
            request({
              url: '/xxglXxcb/scbgsmb',
              responseType: 'blob', // 表明返回服务器返回的数据类型
              data: {
                requestData:{
                  tnXxcbid: this.selection[0].tnXxcbid,
                }
              }
            }).then((res) => { // 处理返回的文件流
              if(res == undefined ){
                this.$message({
                  message:'下载失败,请联系管理员!',
                  type:"fail",
                  duration:1000,
                  customClass: "middle"
                })
              }else{
                const content = res
                const blob = new Blob([content])
                const fileName = '报告书模板'
                if ('download' in document.createElement('a')) { // 非IE下载
                  const elink = document.createElement('a')
                  elink.download = fileName + '.docx'
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
          } else if(this.selection.length < 1) {
            this.$alert('请选择要操作的数据！')
          } else {
            this.$alert('只能选择一条记录！')
          }
          break;
      }
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      if(row.tnSjzt === '04020403' || row.tnSjzt === '04020404') {
        this.$router.push({ path: '/info/case/commit/detail_update', query: { type: 'wj_readonly', id: row.tnXxcbid } }) 
      } else {
        if(row.tnSjzt === '04020401') {
          this.$router.push({ path: '/info/case/commit/detail', query: { type: 'cb_update', id: row.tnXxcbid } }) 
        } else {
          this.$router.push({path: '/info/case/commit/detail_update', query: {type: 'detail', id: row.tnXxcbid }})
        }
      }
    },
    // 事件-行选
    _DataGridSelectionChange(selection) {
      this.selection = selection;
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
       this.getInfoList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
       this.getInfoList()
    },
    _ButtonExportClick() {
      this.exportTable()
    },
    async exportTable() {
      const result = await Model.exportTable({
        cdId: '0004030201',
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcXxbt: this.query.tcXxbt || '',
          tcXxlx: this.query.tcXxlx || '',
          tcAfbw: this.query.tcAfbw || '',
          tcAfbwss: this.query.tcAfbwss || '',
          tnSjzt: this.query.tcXxzt!==undefined?this.query.tcXxzt:'',
          afbeginDate: this.query.tcAfsj?this.query.tcAfsj[0]:'',
          afendDate: this.query.tcAfsj?this.query.tcAfsj[1]:'',
          sbbeginDate: this.query.tcSbsj?this.query.tcSbsj[0]:'',
          sbendDate: this.query.tcSbsj?this.query.tcSbsj[1]:''
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
          elink.download = `上报信息.xls`
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
    // 加载列表
    async getInfoList () {
      const result = await Model.getInfoList({
        isQuery: 1,
        cdId: '0004030201',
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcXxbt: this.query.tcXxbt || '',
          tcXxlx: this.query.tcXxlx || '',
          tcAfbw: this.query.tcAfbw || '',
          tcAfbwss: this.query.tcAfbwss || '',
          tnSjzt: this.query.tcXxzt!==undefined?this.query.tcXxzt:'',
          afbeginDate: this.query.tcAfsj?this.query.tcAfsj[0]:'',
          afendDate: this.query.tcAfsj?this.query.tcAfsj[1]:'',
          sbbeginDate: this.query.tcSbsj?this.query.tcSbsj[0]:'',
          sbendDate: this.query.tcSbsj?this.query.tcSbsj[1]:''
        }
      })
      if (result && result.data) {
        this.list = result.data
        this.list.forEach((item) => {
          item.tdAfrq = Moment(item.tdAfrq).format('YYYY-MM-DD')
          item.tdSbsj = Moment(item.tdSbsj).format('YYYY-MM-DD')
          if(item.tnSjzt=='04020401'){
            item.tnSjztmc="初报"
          } else if(item.tnSjzt=='04020402'){
            item.tnSjztmc="续报"
          } else if(item.tnSjzt=='04020403'){
            item.tnSjztmc="完结"
          } else {
            item.tnSjztmc="申请重新填报"
          }
          if(item.tnGwsj === 0) {
            item.tnGwsjmc = '否'
          } else {
            item.tnGwsjmc = '是'
          }
        })
        this.pageTotal = result.total
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getInfoList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
