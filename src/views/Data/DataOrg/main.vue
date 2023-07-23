<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree slot="side" fnCode="000401" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>
    <!-- 查询条件 -->
   
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <CustomButton icon="export" text="导出" @click="_ButtonExportClick"/>
      </CustomToolbar>
    </div>
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import request from '@commons/request.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import { setTimeout } from 'timers';

export default {
  name: 'DataOrg',
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
      dict: ['000501', '000502'],
      query: {},
      // 数据列表
      list: [],
      // 当前树上选中节点
      curOrg: {},
      options: {
        '000501': [],
        '000502': []
      },
      isFirstEnter: true
    }
  },
  methods: {
    $init (options) {
      this.options = options

      this.list.forEach(item => {
        const orgTypeIdx = this.options['000501'].findIndex(dict => dict.tcSjubm === item.tcDwlx)
        if (orgTypeIdx >= 0) {
          item.tcDwlxmc = this.options['000501'][orgTypeIdx].tcSjnr
        }

        const netTypeIdx = this.options['000502'].findIndex(dict => dict.tcSjubm === item.tcWdlb)
        if (netTypeIdx >= 0) {
          item.tcWdlbmc = this.options['000502'][netTypeIdx].tcSjnr
        }
      })
    },
    // 事件-点击树结点
    _OrgTreeClick(node) {
      this.curOrg = node;
      this.getOrgList();
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.curOrg = node
      this.curOrg && this.getOrgList();
    },
    // 事件-查询按钮点击
    _DataFilterQuery(query) {
      this.query = query
      this.getOrgList();
    },
    // 导出Excel
    async _ButtonExportClick() {
      // 后端导出
      request({
        url: '/dwxx/orgListExport',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          rows: this.pageRows,
          pageNum: this.pageNum,
          isQuery: 1,
          cdId: '00040102',
          requestData:{
            tcDwbm: this.curOrg.id,
            tcDwmc: this.query.tcDwmc || '',
            tcZzjgdm: this.query.tcZzjgdm || '',
            tcSjjgdm: this.query.tcSjjgdm || '',
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
          const fileName = '单位基础数据-' + myDate
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
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({ path: '/data/org/detail', query: { curOrg: row.tcDwbm } }) 
    },
    // 事件-改变每页显示数量
    _PageRowsChange(num) {
      this.pageRows = num;
      this.pageNum = 1;
      this.getOrgList();
    },
    // 事件-翻页
    _PageChange(num) {
      this.pageNum = num;
      this.getOrgList();
    },
    // 获取单位基础数据列表
    async getOrgList() {
      const result = await Model.getOrgList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '00040102',
        requestData: {
          tcDwbm: this.curOrg.id,
          tcDwmc: this.query.tcDwmc || '',
          tcZzjgdm: this.query.tcZzjgdm || '',
          tcSjjgdm: this.query.tcSjjgdm || '',
        }
      })
      if (result && result.data) {
        this.list = result.data
        this.pageTotal = result.total
        this.list.forEach(item =>{
          const orgTypeIdx = this.options['000501'].findIndex(dict => dict.tcSjubm === item.tcDwlx)
          if (orgTypeIdx >= 0) {
            item.tcDwlxmc = this.options['000501'][orgTypeIdx].tcSjnr
          }

          const netTypeIdx = this.options['000502'].findIndex(dict => dict.tcSjubm === item.tcWdlb)
          if (netTypeIdx >= 0) {
            item.tcWdlbmc = this.options['000502'][netTypeIdx].tcSjnr
          }
          if(item.tnWdzt === 0) {
            item.tnWdztmc = '正常'
          } else {
            item.tnWdztmc = '无效'
          }
        })
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      if (this.curOrg.id) {
        this.getOrgList()
      }
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
