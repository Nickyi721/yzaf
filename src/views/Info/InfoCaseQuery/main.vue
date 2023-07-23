<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" :curRegion="curRegion" @choose="_DataFilterChoose" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="continue" text="同意重新填报" @click="_ButtonClick('unlock')"/>
        <CustomButton icon="continue" text="继续上报" @click="_ButtonClick('continue')"/>
        <CustomButton icon="export" text="导出" @click="_ButtonClick('export')"/>
      </CustomToolbar>
    </div>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblclick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

    <!-- 选择区域弹框 -->
    <CustomDialog title=" 选择区域" :visible="dlgVisble" @close="_DlgCloseHandle">
      <CommonOrgTree ref="orgTree" check-strictly content fnCode="000403" style="height: 400px" @click="_OrgTreeRegionClick" />
      <div class="filter-btn" style="text-align:right;padding: 10px;">
        <el-button type="primary" size="mini" @click="_DlgButtonClick">确定</el-button>
      </div>
    </CustomDialog>
  </CustomView>
</template>

<script>
import Moment from 'moment'
import FileSaver from 'file-saver'

// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import request from '@commons/request.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
export default {
  name: 'InfoCaseQuery',
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
      dlgVisble: false,
      curRegion: {},
      exportList: [],
      isFirstEnter: true
    }
  },
  methods: {
    $init () {
      let bindData = {}
      this._DataFilterQuery(bindData)
    },
    _DlgCloseHandle() {
      this.dlgVisble = false
      this.$forceUpdate()
    },
    _DlgButtonClick() {
      this.dlgVisble = false
    },
    _DataFilterChoose() {
      this.dlgVisble = true
    },
    // 事件-选择区域-点击树节点
    _OrgTreeRegionClick(node) {
      this.curRegion = node
    },
    // 查询
    _DataFilterQuery(query) {
      this.query = query
      this.getInfoList();
    },
    // 顶部按钮
    async _ButtonClick (type) {
      switch (type) {
        case 'unlock': 
          if(this.selection.length === 1) {
            let tip = 0;
            for(let i in this.selection) {
              if(this.selection[i].tnSjzt === '04020404') {
                tip = 1
              }
            }
            if(tip === 0) {
              this.$alert('只能操作事件状态为申请重新填报的记录！')
            } else {
              const result = await Model.tyjs({
                isQuery: 0,
                cdId: '0004030202',
                requestData: {
                  tnXxcbid: this.selection[0].tnXxcbid,
                }
              })
              if(result.state === '1') {
                this.$message({
                  message:"申请成功!",
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
        case 'continue': 
          if(this.selection.length < 1) {
            this.$alert('请选择要操作的数据！')
          } else if(this.selection.length > 1) {
            this.$alert('只能操作单条记录！')
          } else {
            this.$router.push({
              path: '/info/case/query/detail', 
              query: {
                type: 'continue', 
                tnXxcbid: this.selection[0].tnXxcbid}
            })
          }
          break;
        case 'export': 
          this.exportExcel()
          break;
      }
    },
    // 事件-导出
    async exportExcel () {
      // 后端导出
      request({
        url: '/xxglXxcb/exportXxcb',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          rows: this.pageRows,
          pageNum: this.pageNum,
          isQuery: 1,
          cdId: '0004030202',
          requestData:{
            tcDwdm: this.query.tcDwdm || '',
            tcXxbt : (this.query.tcXxbt !== undefined)?this.query.tcXxbt:'',
            tcXxlx: (this.query.tcXxlx !== undefined)?this.query.tcXxlx:'',
            tcAfbw: (this.query.tcAfbw !== undefined)?this.query.tcAfbw:'',
            tcAfbwss: (this.query.tcAfbwss !== undefined)?this.query.tcAfbwss:'',
            afbeginDate: (this.query.tcAfsj)?(this.query.tcAfsj[0]):(''),
            afendDate: (this.query.tcAfsj)?(this.query.tcAfsj[1]):(''),
            sbbeginDate: (this.query.tcSbsj)?(this.query.tcSbsj[0]):(''),
            sbendDate: (this.query.tcSbsj)?(this.query.tcSbsj[1]):('')
          }
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
          const fileName = '上报信息查询-' + myDate
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
    },
    //字符串转字符流
    s2ab (s) {
      if (typeof ArrayBuffer !== 'undefined') {  
          let buf = new ArrayBuffer(s.length);  
          let view = new Uint8Array(buf);  
          for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;  
          return buf;  
      } else {  
          let buf = new Array(s.length);  
          for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;  
          return buf;  
      }
    },
    // 事件-双击
    _DataGridDblclick(row) {
      this.$router.push({
        path: '/info/case/query/detail', 
        query: {
          type: 'detail', 
          tnXxcbid: row.tnXxcbid
        }
      })
    },
    // 事件-行选
    _DataGridSelectionChange(selection) {
      this.selection = selection
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
    // 加载列表
    async getInfoList () {
      const result = await Model.getInfoList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,
        cdId: '0004030202',
        requestData: {
          cxdwdm: this.query.tcDwdm || '',
          tcXxbt : (this.query.tcXxbt !== undefined)?this.query.tcXxbt:'',
          tcXxlx: (this.query.tcXxlx !== undefined)?this.query.tcXxlx:'',
          tcAfbw: (this.query.tcAfbw !== undefined)?this.query.tcAfbw:'',
          tcAfbwss: (this.query.tcAfbwss !== undefined)?this.query.tcAfbwss:'',
          tnSjzt: this.query.tnSjzt || '',
          afbeginDate: (this.query.tcAfsj)?(this.query.tcAfsj[0]):(''),
          afendDate: (this.query.tcAfsj)?(this.query.tcAfsj[1]):(''),
          sbbeginDate: (this.query.tcSbsj)?(this.query.tcSbsj[0]):(''),
          sbendDate: (this.query.tcSbsj)?(this.query.tcSbsj[1]):('')
        }
      })
      if (result && result.data) {
        this.list = result.data
        this.pageTotal = result.total
        let len = this.list.length
        for(let i =0; i < len; i++) {
          if(this.list[i].tnSjzt=='04020401'){
            this.list[i].tnSjztmc="初报"
          }else if(this.list[i].tnSjzt=='04020402'){
            this.list[i].tnSjztmc="续报"
          }else if(this.list[i].tnSjzt=='04020403'){
            this.list[i].tnSjztmc="完结"
          }else {
            this.list[i].tnSjztmc="申请重新填报"
          }
          this.list[i].tdAfrq = Moment(this.list[i].tdAfrq).format('YYYY-MM-DD')
          this.list[i].tdSbsj = Moment(this.list[i].tdSbsj).format('YYYY-MM-DD')
          if(this.list[i].tnGwsj === 0) {
            this.list[i].tnGwsjmc = '否'
          } else {
            this.list[i].tnGwsjmc = '是'
          }
        }
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
