<template>
    <CustomView>    
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" :zlkwjTypes='zlkwjTypes' :shztTypes='shztTypes' @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/>
        <CustomButton icon="upload" text="上传" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid ref="dataGrid" :list="list" @selection-change="_DataGridSelectionChange" @download="_DownloadFile" @select="_RowSelect" @select-all="_DataGridSelectAll">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

    <CustomDialog top="10%" :config="{ title: '上传文件' }" :visible="dialogVisible" @close="closeHandle">
      <UploadFile ref="uploadFile" :zlkwjTypes='zlkwjTypes2' @upload="_requestFile"></UploadFile>
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
import UploadFile from './components/UploadFile.vue'
import request from '@commons/request.js'

export default {
  name: 'DocumentUpload',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
    UploadFile
  },
  data () {
    return {
      // 查询条件
      query: {
        tcYwjm: '',
        tcLxid: '',
        startDate: '',
        endDate: ''
      },
      // 列表
      list: [],
      dialogVisible: false,
      selection:[],
      zlkwjTypes:[],
      zlkwjTypes2:[],
      shztTypes: [
        {"tcSjubm":"","tcSjnr":"全部"},
        {"tcSjubm":"0","tcSjnr":"未审核"},
        {"tcSjubm":"1","tcSjnr":"审核通过"},
        {"tcSjubm":"2","tcSjnr":"审核不通过"}
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
      this.selection = selection
    },
    _DataGridSelectAll(selection){
      let selectAll = [].concat(selection)
      for(let i=0; i<selectAll.length; i++){
        if (selectAll[i].tnShzt !== 0) {
          this.$refs.dataGrid.toggleRowSelection(selectAll[i], false);
          this.$msgbox({
            message: "无法删除审核通过数据",
            type: "warning"
          });
        }
      }
    },
    _RowSelect(selection, row){
      if (row.tnShzt === 1) {
        this.$refs.dataGrid.toggleRowSelection(row, false)
        this.$msgbox({
          message: '无法删除审核通过数据',
          type: 'warning'
        })
      }
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
    _ButtonDeleteClick(){
      if (this.selection.length) {
        this.$confirm('确认删除当前选择数据吗？').then(() => {
          this.deleteData(this.selection)
        }).catch(err => {})
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    _ButtonAddClick(){
      this.dialogVisible = true
      if(this.$refs.uploadFile!=undefined){
        this.$refs.uploadFile.formData.file = []
      }
    },
    closeHandle(){
      this.dialogVisible = false
      this.picVisible = false
    },
    _requestFile(data){
      if(data.file.length > 0){
        let form = new FormData()    // FormData 对象
        form.append('file', data.file[0].raw) // 文件对象
        form.append('sessionId',window.sessionStorage.sessionId)
        form.append('lylx',0),
        form.append('cdId','00042001')
        form.append('isQuery', 0)
        form.append('isVideo', 0)
        form.append('tcLxid',data.tcLxid)
        form.append('tcLxmc',data.tcLxmc)
        this.uploadFile(form)
      }
    },
    async uploadFile(data) {
      const result = await Model.uploadFile(data);
      this.dialogVisible = false
      if (result.state === "1") {
        this.$message({
          message: '上传成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.getListData()
      }
      // else{
      //   this.$message({
      //     message:'上传失败!',
      //     type:"success",
      //     duration:2000,
      //     customClass: "middle"
      //   })
      // }
    },
    _DownloadFile(tcWjmc,tcYwjm){
      request({
        url: '/zlk/zlkDownload',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          requestData:{
            tcWjm:tcWjmc
            // tcWjm:'9284c519d61149b890b874ef90dadc28.zip'
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
          // const fileName = 'a.js'
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
    // 获取列表数据
    async getListData () {
      const result = await Model.getListData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'00042001', //菜单ID
        requestData: this.query
      })
      if (result) {
        this.list = result.data.list
        this.pageTotal = result.data.total
      }
    },
    // 删除数据
    async deleteData () {
      const result = await Model.deleteData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 0,  //是否是查询类 0-否 1-是
	      cdId:'00042001', //菜单ID
        requestData: {
          "zlkIdArr":this.selection.map(item => item.tnZlkid)
        }
      })
      if (result.state==="1") {
        this.$message({
          message: '删除成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.dialogVisible = false
        this.getListData()
      }
      else{
        this.dialogVisible = false
        // let _this = this
        // this.$message({
        //   message:'删除失败!',
        //   type:"fail",
        //   duration:2000,
        //   customClass: "middle",
        //   onClose:function(){
        //   }
        // })
      }
    },
    async getSjzdZlkLx() {
      const result = await Model.getSjzdZlkLx({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
	      cdId:'00042001', //菜单ID
        requestData: ''
      })
      if (result.state==="1") {   
        let all = [{"tcSjubm":"","tcSjnr":"全部"}]
        this.zlkwjTypes = all.concat(result.data)
        this.zlkwjTypes2 = result.data
      }
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
