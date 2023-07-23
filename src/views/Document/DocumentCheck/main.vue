<template>
    <CustomView>    
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" :zlkwjTypes='zlkwjTypes' :zlkshztTypes='zlkshztTypes' @query="_DataFilterQuery"/>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @selection-change="_DataGridSelectionChange" @download="_DownloadFile" @check="_CheckFile">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
    <CustomDialog :config="{ title: '文件审核' }" :visible="dialogVisible" @close="closeHandle">
      <el-form ref="form" :model="formData" label-position="top" class="common-form common-form-dlg">
        <el-form-item label="审核意见" prop="tcShyj">
          <el-input v-model="formData['tcShyj']"  size="mini" type="textarea" :rows="3" placeholder="请输入审核意见"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="_ButtonApproveClick">审核通过</el-button>
          <el-button type="primary" size="mini" @click="_ButtonDisapproveClick">审核不通过</el-button>
        </el-form-item>
      </el-form>
    </CustomDialog>
    <!-- <CustomDialog :config="{ title: '图片内容' }" :visible="picVisible" @close="closeHandle">
      <img :src="src">
    </CustomDialog> -->
  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import request from '@commons/request.js'

export default {
  name: 'DocumentCheck',
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
      query: {
        tcYwjm: '',
        tnWjfl:'',
        tnShzt:'',
        startDate: '',
        endDate: ''
      },
      formData:{
        tnShzt:'',
        tcShyj:'',
        tnZlkid:''
      },
      // 列表
      list: [],
      dialogVisible: false,
      zlkwjTypes:[],
      zlkshztTypes:[
        {"tcSjubm":"","tcSjnr":"全部"},
        {"tcSjubm":0,"tcSjnr":"未审核"},
        {"tcSjubm":1,"tcSjnr":"审核通过"},
        {"tcSjubm":2,"tcSjnr":"审核不通过"}
      ],
      src: '',
      picVisible: false,
      isFirstEnter: true
    }
  },
  methods: {
    $init(){
      this.getListData()
      this.getSjzdZlkLx()
    },
    // 事件-条件查询
    _DataFilterQuery (params) {
      this.query = params
      this.getListData()
    },
    //数据选择
    _DataGridSelectionChange(selection){
    },
    
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getListData()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getListData()
    },
    closeHandle(){
      this.dialogVisible = false
      this.picVisible = false
    },
    _DownloadFile(tcWjmc, tcYwjm){
      request({
        url: '/zlk/zlkDownload',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        // headers: {
        //   'content-type': 'application/octet-stream'
        // },
        data: {
          requestData:{
            tcWjm:tcWjmc
          }
        }
      })
      .then((res) => { // 处理返回的文件流
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
        const fileName = tcYwjm
        const fileTag = fileName.split(".")[1]
        // if(fileTag==="png"||fileTag==="jpg"||fileTag==="jpeg"){
        //   let src = URL.createObjectURL(blob)
        //   this.src = src
        //   this.picVisible = true
        // }else{
          // const fileName = 'xxx.png'
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
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
    _CheckFile(tnZlkid,show){
      this.formData.tnZlkid = tnZlkid
      this.dialogVisible = show
    },
    _ButtonApproveClick(){
      this.dialogVisible = false
      this.formData.tnShzt = '1'
      this.approveData()
    },
    _ButtonDisapproveClick(){
      this.dialogVisible = false
      this.formData.tnShzt = '2'
      this.approveData()
    },
    // 获取列表数据
    async getListData () {
      const result = await Model.getListData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'00042002', //菜单ID
        requestData: this.query
      })
      if (result) {
        this.list = result.data.list
        this.pageTotal = result.data.total
      }
    },
    async getSjzdZlkLx() {
      const result = await Model.getSjzdZlkLx({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'00042002', //菜单ID
        requestData: ''
      })
      if (result.state==="1") {        
        let all = [{"tcSjubm":"","tcSjnr":"全部"}]
        this.zlkwjTypes = all.concat(result.data)
      }
    },
    // 审核通过
    async approveData () {
      const result = await Model.approveData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 0,  //是否是查询类 0-否 1-是
	      cdId:'00042002', //菜单ID
        requestData: this.formData
      })
      if (result.state==="1") {
        this.$message({
          message: '操作成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.getListData()
      }
      // else{
      //   let _this = this
      //   this.$message({
      //     message:'操作失败!',
      //     type:"fail",
      //     duration:2000,
      //     customClass: "middle",
      //   })
      // }
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.$init()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
