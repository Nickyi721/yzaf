<template>
  <CustomView :location="[{ text: type==='add' ? '新增设备信息' : '设备信息详情' }]">
    <CustomTitle>{{orgName + ' - ' + equipTypeText}}</CustomTitle>
    <div>
      <CustomToolbar>
        <CustomButton icon="export" text="导出" @click="_ExportClick"/>
      </CustomToolbar>
    </div>
    <DynamicForm ref="dynamicForm" :config="config" :content="content"  :isSaveVisible='isSaveVisible'/>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

import DynamicForm from './components/DynamicForm.vue'
// 文件上传 导出 下载
import request from '@commons/request.js'

export default {
  mixins: [
    Mixin.init,
  ],
  components: {
    DynamicForm,
  },
  data () {
    return {
      config: [],
      content: {},
      equipData: [],
      

      //detailList: [],
      //detailConfig: [],

      selection: [],
      isSaveVisible: true
    }
  },
  methods: {
    $init (options) {
      this.type = this.$route.query.type
      this.equipType = this.$route.query.equipType
      this.equipTypeText = this.$route.query.equipTypeText
      this.orgName = this.$route.query.orgName

      this.getEquipConfig()
      this.type === 'update' && this.getEquipData()
    },
    // _FormCommit (data) {
    //   this.saveEquipData(data)
    // },
    // 获取配置
    async getEquipConfig () {
      const result = await Model.getEquipConfig({
        tnDllx: 0,
        tcXxxlx: this.$route.query.equipType
      })
      if (result.data) {
        this.config = result.data
      }
    },
    // 获取设备信息
    async getEquipData () {
      const result = await Model.getEquipData({
        tnDllx: 0,
        tcXxxlx: this.$route.query.equipType,
        tcSsdwdm: this.$route.query.orgId,
        tnYwpc: parseInt(this.$route.query.equipOrder, 10)
      })
      if (result.data) {
        const content = {}
        this.isSaveVisible = result.data.tnSfjm
        result.data.forEach(item => {
          if (typeof item.tcZfclxsj !== 'undefined') {
            content[item.tnRcxjjbxxszid.toString()] = item.tcZfclxsj
            
          }
          if (typeof item.tnSzzxsj !== 'undefined') {
            content[item.tnRcxjjbxxszid.toString()] = item.tnSzzxsj
          }
          if (typeof item.tnFdxsj !== 'undefined') {
            content[item.tnRcxjjbxxszid.toString()] = item.tnFdxsj
          }
        })
        this.content = content
        this.equipData = result.data
      }
    },
    _ExportClick() {
      if(this.$route.query.curType === 'dbClick' && this.$route.query.sfFuncTest === '是') {
        // 导出火灾报警控制器运行情况
        request({
          url: '/xjjbxx/exportXjjbxxList',
          responseType: 'blob', // 表明返回服务器返回的数据类型
          data: {
            isQuery: 0,
            requestData: {
              "tnDllx":0,
              "tcXxxlx": this.$route.query.equipType,
              "tcSsdwdm": this.$route.query.orgId,
              "tnYwpc": this.$route.query.tnYwpc
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
            const fileName = '火灾报警控制器运行情况-' + myDate
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
        // 如果是否当场解决为 “否”  导出消防控制室设施故障维修记录表
        if(this.$route.query.sfDcjj === '否') {
          this.publicExport()
        }
      }
      if(this.$route.query.curType === 'dbClick' && this.$route.query.sfFuncTest === '否') {
        // 导出控制室内其他消防系统运行情况（没有功能检查按钮双击）
        request({
          url: '/xjjbxx/exportXjjbxxList3',
          responseType: 'blob', // 表明返回服务器返回的数据类型
          data: {
            isQuery: 0,
            requestData: {
              "tnDllx":0,
              "tcXxxlx": this.$route.query.equipType,
              "tcSsdwdm": this.$route.query.orgId,
              "tnYwpc": this.$route.query.tnYwpc
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
            const fileName = '控制室内其他消防系统运行情况-' + myDate
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
        // 如果是否当场解决为 “否”  导出消防控制室设施故障维修记录表
        if(this.$route.query.sfDcjj === '否') {
          this.publicExport()
        }
      }
      if(this.$route.query.curType === 'funcTest') {
        // 导出火灾报警控制器功能检查情况记录表(点击功能检查）
        request({
          url: '/xjjbxx/exportXjjbxxList4',
          responseType: 'blob', // 表明返回服务器返回的数据类型
          data: {
            isQuery: 0,
            requestData: {
              "tnDllx":0,
              "tcXxxlx": this.$route.query.equipType,
              "tcSsdwdm": this.$route.query.orgId,
              "tnYwpc": this.$route.query.tnYwpc
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
            const fileName = '火灾报警控制器功能检查情况记录表-' + myDate
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
        // 如果是否当场解决为 “否”  导出消防控制室设施故障维修记录表
        if(this.$route.query.sfDcjj === '否') {
          this.publicExport()
        }
      }
    },
    publicExport() {
      request({
        url: '/xjjbxx/exportXjjbxxList2',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          isQuery: 0,
          requestData: {
            "tnDllx":0,
            "tcXxxlx": this.$route.query.equipType,
            "tcSsdwdm": this.$route.query.orgId,
            "tnYwpc": this.$route.query.tnYwpc
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
          const fileName = '消防控制室设施故障维修记录表-' + myDate
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
