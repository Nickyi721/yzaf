<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000405" module="normal" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" />
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          {{currentOrg.name}}
        </span>
        <CustomButton v-if="show" icon="delete" text="删除" @click="_ButtonDeleteClick"/>
        <CustomButton v-if="show" icon="add" text="新增" @click="_ButtonAddClick"/>
        <CustomButton v-if="list.length" icon="export" text="导出" @click="_ExportClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" v-if="show" @button-click="_ButtonClick" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
    <DataGridCopy :list="list" v-else @button-click="_ButtonClick" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGridCopy>

  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'
import Moment from 'moment'
import request from '@commons/request.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import DataGridCopy from './components/DataGridCopy.vue'

export default {
  name: 'FinanceDailyTrain',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
    DataGridCopy
  },
  data () {
    return {
      // 数据列表
      list: [
        
      ],
      // 已选列表
      selection: [],
      currentOrg: {},
      query: {},
      rootNode: {},
      show: true,
      isFirstEnter: true
    }
  },
  methods: {
    $init(){
      
    },
    // 事件-点击树结点
    _OrgTreeClick(node) { 
      if(node.id !== this.rootNode.id && node.parentId !== this.rootNode.id)  {
        // this.$nextTick(() => {
          this.show = false
        // })
      }
      if(node.id === this.rootNode.id || node.parentId === this.rootNode.id) {
        // this.$nextTick(() => {
          this.show = true
        // })
      }
      this.currentOrg = node
      this.getList()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.rootNode = node
      this.currentOrg = node
      this.getList()
    },
    // 事件 - 表格双击
    _DataGridDblClick(row) {
      this.$router.push({
        path: '/finance/daily/train/detail',
        query: {
          row: JSON.stringify(row),
          show: this.show
        }
      })
    },
    // 事件 - 多选
    _DataGridSelectionChange(selection) {
      this.selection = selection
    },
    // 事件 - 新增
    _ButtonAddClick() {
      this.$router.push({
        path: '/finance/daily/train/detail',
        query: {
          type: 'add',
          tcFqdw: this.currentOrg,
          show: this.show
        }
      })
    },
    // 事件 - 删除
    _ButtonDeleteClick() {
      if (this.selection.length) {
        this.$confirm('是否删除所选数据？').then(() => {
          this.delete()
        }).catch(err => {})
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getList()
    },
    // 事件 - 查询
    _DataFilterQuery(query) {
      this.query = query
      this.getList()
    },
    // 加载列表
    async getList() {
      const result = await Model.getList({
        isQuery: 1,
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcPxnr: this.query.tcPxnr || '',
          tdPxsj: this.query.tdPxsj || '',
          tcFqdwbm: this.currentOrg.id,
        }
      })
      if(result.state === '1' && result.data) {
        this.list = result.data
        this.list.forEach(item => {
          item.tdPxkssj = Moment(item.tdPxkssj).format('YYYY-MM-DD')
          item.tdPxjssj = Moment(item.tdPxjssj).format('YYYY-MM-DD')
        })
        this.pageTotal = result.total
      }
    },
    async delete() {
      let deleteArr = []
      this.selection.forEach(item => {
        deleteArr.push(item.tnPxylid)
      })
      const result = await Model.delete({
        isQuery: 0,
        requestData: {
          tnPxylid: deleteArr
        }
      })
      if(result.state === '1') {
        this.$message({
          message: '删除成功！',
          type: 'success',
          customClass: "middle",
        })
        this.getList()
      }
    },
    _ButtonClick(row) {
      const curTime = new Date()
      const endTime = new Date(Date.parse(row.tdPxjssj))
      const tap = curTime > endTime

      if(tap) {
        this.$confirm('是否完成当前培训/演练？').then(() => {
          this.setBzw(row.tnPxylid)
        }).catch(err => {})
      } else {
        this.$message({
          message: '当前日期小于培训/演练结束日期，不能提前完成！',
          type: 'warning',
          customClass: "middle",
          showClose: true
        })
      }
    },
    async setBzw(tnPxylid) {
      const result = await Model.setBzw({
        isQuery: 0,
        requestData: {
          tnPxylid: tnPxylid
        }
      })
      if(result.state === '1') {
        this.$message({
          message: '修改成功！',
          type: 'success',
          customClass: "middle"
        })
        this.getList()
      }
    },
    _ExportClick() {
      // 后端导出
      request({
        url: '/trainingRecord/exportList',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          isQuery: 0,
          rows: this.pageRows,
          pageNum: this.pageNum,
          requestData: {
            tcPxnr: this.query.tcPxnr || '',
            tdPxsj: this.query.tdPxsj || '',
            tcFqdwbm: this.currentOrg.id,
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
          const fileName = '教育培训及演练列表-' + myDate
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
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>

