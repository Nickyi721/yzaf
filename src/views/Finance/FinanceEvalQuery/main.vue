<template>
  <CustomView>

    <!-- 侧栏 -->
    <CommonOrgTree slot="side" fnCode="000405" module="eval" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>
    
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @change="_DataFilterChange" @query="_DataFilterQuery"/>
      <el-tabs value="evalDetail" @tab-click="_TabClick">
        <el-tab-pane key="1" label="评估详情" name="evalDetail"></el-tab-pane>
        <el-tab-pane key="2" label="评估概况" name="evalOverview"></el-tab-pane>
        <el-tab-pane key="3" label="机构计分" name="orgScore"></el-tab-pane>
      </el-tabs>
      <CustomToolbar>
        <CustomButton v-if="formType ==='evalDetail'" icon="add" text="安全评估计分表" @click="_ButtonClickEvalSheet"/>
        <!-- <CustomButton v-if="formType ==='evalDetail'" icon="add" text="评估详情" @click="_ButtonClickEvalDetail"/> -->
        <CustomButton v-if="formType ==='evalOverview'" icon="add" text="安全评估计分表" @click="_ButtonClickEvalSheet"/>
        <!-- <CustomButton v-if="formType ==='evalOverview'" icon="add" text="金融机构统计表" @click="_ButtonClickEvalCountSheet"/> -->
        <CustomButton v-if="formType ==='orgScore'" icon="add" text="导出" @click="_ButtonExportClick"/>
      </CustomToolbar>
    </div>
    <!-- 数据表格 -->
    <DataGrid v-if="formType ==='evalDetail'" :list="list" @dblclick="_DataGridDetailDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :rows="pageRows" :pageNum="pageNum" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

    <DataGridOverview v-if="formType ==='evalOverview'" :list="list" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :rows="pageRows" :pageNum="pageNum" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGridOverview>

    <DataGridOrg v-if="formType ==='orgScore'" :list="list" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :rows="pageRows" :pageNum="pageNum" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGridOrg>

  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import Moment from 'moment'
import request from '@commons/request.js'

import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import DataGridOverview from './components/DataGridOverview.vue'
import DataGridOrg from './components/DataGridOrg.vue'

export default {
  name: 'FinanceEvalQuery',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
    DataGridOverview,
    DataGridOrg
  },
  data () {
    return {
      // 列表
      list: [],
      currentNode: {},
      curFilterQuery: {},
      formType: "evalDetail",
      selection: [],
      isFirstEnter: true
    }
  },
  methods: {
    // 事件-点击树节点
    _OrgTreeClick (node) {
      this.currentNode = node
      this.pageNum = 1
      let bindData = {
        tcDwbm: this.currentNode.id,
        tcDwmc: (this.curFilterQuery.c_dwmc !== undefined)?this.curFilterQuery.c_dwmc:'',
        tcPgrmc: (this.curFilterQuery.c_pgrmc !== undefined)?this.curFilterQuery.c_pgrmc:'',
        tcPgdj: (this.curFilterQuery.c_pgdj !== undefined)?this.curFilterQuery.c_pgdj:'',
        tnPgztid: (this.curFilterQuery.c_pgztid !== undefined)?this.curFilterQuery.c_pgztid:'',
        begintime: (this.curFilterQuery.c_time)?(this.curFilterQuery.c_time[0]):(""),
        endtime: (this.curFilterQuery.c_time)?(this.curFilterQuery.c_time[1]):("")
      }
      if(this.formType === "evalDetail") {
        this.getListDataDetail(bindData)
      } else if(this.formType === "evalOverview") {
        this.getFinSecEvaAbout(bindData)
      } else {
        this.getFinSecEvaIns(bindData)
      }
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded (node) {
      this.currentNode = node
      let bindData = {
        tcDwbm: this.currentNode.id,
        tcDwmc: "",
        tcPgrid: "",
        tcPgdj: "",
        tnPgztid: "",
        begintime: "",
        endtime: "",
      }
      this.getListDataDetail(bindData)
    },
    // 事件-条件查询
    _DataFilterQuery (formData) {
      let bindData = {
        tcDwbm: this.currentNode.id,
        tcDwmc: (this.curFilterQuery.c_dwmc !== undefined)?this.curFilterQuery.c_dwmc:'',
        tcPgrmc: (this.curFilterQuery.c_pgrmc !== undefined)?this.curFilterQuery.c_pgrmc:'',
        tcPgdj: (this.curFilterQuery.c_pgdj !== undefined)?this.curFilterQuery.c_pgdj:'',
        tnPgztid: (this.curFilterQuery.c_pgztid !== undefined)?this.curFilterQuery.c_pgztid:'',
        begintime: (formData.c_time)?(formData.c_time[0]):(''),
        endtime: (formData.c_time)?(formData.c_time[1]):('')
      }
      if(this.formType === "evalDetail") {
        this.getListDataDetail(bindData)
      } else if(this.formType === "evalOverview") {
        this.getFinSecEvaAbout(bindData)
      } else {
        this.getFinSecEvaIns(bindData)
      }
    },
    // 事件-查询条件改变
    _DataFilterChange(formData) {
      this.curFilterQuery = formData;
    },
    // 事件-导出
    _ButtonExportClick() {
      // 后端导出
      request({
        url: '/finSecEva/exportPgdf',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          rows: this.pageRows,
          pageNum: this.pageNum,
          isQuery: 1,
          cdId: '0004050203',
          requestData:{
            tcDwdm: this.currentNode.id,
            tcDwmc: (this.curFilterQuery.c_dwmc !== undefined)?this.curFilterQuery.c_dwmc:'',
            tcPgrmc: (this.curFilterQuery.c_pgrmc !== undefined)?this.curFilterQuery.c_pgrmc:'',
            tcPgdj: (this.curFilterQuery.c_pgdj !== undefined)?this.curFilterQuery.c_pgdj:'',
            tnPgztid: (this.curFilterQuery.c_pgztid !== undefined)?this.curFilterQuery.c_pgztid:'',
            begintime: (this.curFilterQuery.c_time)?(this.curFilterQuery.c_time[0]):(""),
            endtime: (this.curFilterQuery.c_time)?(this.curFilterQuery.c_time[1]):("")
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
          const fileName = '机构计分表-' + myDate
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
    // 事件-改变每页显示数量
    _PageRowsChange(num) {
      this.pageRows = num;
      this.pageNum = 1;
      this._DataFilterQuery(this.curFilterQuery);
    },
    // 事件-翻页
    _PageChange(num) {
      this.pageNum = num;
      this._DataFilterQuery(this.curFilterQuery);
    },
    // 事件-双击表格
    _DataGridDetailDblClick(row) {
      this.$router.push({
        path: '/finance/eval/query/detail', 
        query: { 
          orgCode: row.tcDwdm, 
          orgName: row.tcDwmc,
          evalId: row.tnPgnrzbid,
        } 
      })
    },
    // 事件-行选
    _DataGridSelectionChange(selection) {
      this.selection = selection;
    },
    // 事件-标签页切换
    _TabClick(tab, event) {
      this.formType = tab.name;
      this._DataFilterQuery(this.curFilterQuery)
    },
    // 事件-安全评估计分表-跳转页面
    _ButtonClickEvalSheet() {
      if(this.selection.length < 1) {
        this.$alert('请选择数据')
      } else if(this.selection.length > 1) {
        this.$alert('只能选择一条记录查看')
      } else {
        this.selection[0].tdKspgsj = Moment(this.selection[0].tdKspgsj).format('YYYY-MM-DD')
        this.$router.push({
          path: '/finance/eval/query/sheet', 
          query: {curOrg: JSON.stringify(this.selection[0])}
        })
      }
    },
    // 事件-金融机构统计表
    _ButtonClickEvalCountSheet() {
      this.$message({
        message:"功能正在开发中!",
        type: 'warning',
        showClose: true,
        duration: 1000,
        customClass: "middle",
      })
    },
    // 评估详情页-列表
    async getListDataDetail(data) {
      const result = await Model.getFinSecEvaList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '0004050203', 
        requestData: {
          tcDwdm: data.tcDwbm,
          tcDwmc: data.tcDwmc,
          tcPgrmc: data.tcPgrmc,
          tcPgdj: data.tcPgdj,
          tnPgztid: data.tnPgztid,
          begintime: data.begintime,
          endtime: data.endtime
        }
      });
      if(result.data && result.state === '1') {
        this.list = result.data;
        this.pageTotal = result.total
        let len = this.list.length
        for(let i =0; i < len; i++) {
          this.list[i].tdKspgsj = Moment(this.list[i].tdKspgsj).format('YYYY-MM-DD')
        }
      }
    },
    // 评估概况页
    async getFinSecEvaAbout(data) {
      const result = await Model.getFinSecEvaAbout({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '0004050203', 
        requestData: {
          tcDwdm: data.tcDwbm,
          tcDwmc: data.tcDwmc,
          tcPgrmc: data.tcPgrmc,
          tcPgdj: data.tcPgdj,
          tnPgztid: data.tnPgztid,
          begintime: data.begintime,
          endtime: data.endtime
        }
      });
      if(result.data && result.state === '1') {
        this.list = result.data;
        this.pageTotal = result.total
        for(let i in this.list) {
          if(this.list[i].jraqPgnrf.length != 0) {
            for(let j in this.list[i].jraqPgnrf) {
              if(this.list[i].jraqPgnrf[j].tcXxxlx === '031001') {
                this.list[i].tcYycsdf = this.list[i].jraqPgnrf[j].tnPgdf
              } else if(this.list[i].jraqPgnrf[j].tcXxxlx === '031002'){
                this.list[i].tcYwkdf = this.list[i].jraqPgnrf[j].tnPgdf
              } else if(this.list[i].jraqPgnrf[j].tcXxxlx === '031003'){
                this.list[i].tcZzsbdf = this.list[i].jraqPgnrf[j].tnPgdf
              } else if(this.list[i].jraqPgnrf[j].tcXxxlx === '031004'){
                this.list[i].tcYcdf = this.list[i].jraqPgnrf[j].tnPgdf
              } else if(this.list[i].jraqPgnrf[j].tcXxxlx === '031005'){
                this.list[i].tcXfdf = this.list[i].jraqPgnrf[j].tnPgdf
              } else if(this.list[i].jraqPgnrf[j].tcXxxlx === '031006'){
                this.list[i].tcShjzxdf = this.list[i].jraqPgnrf[j].tnPgdf
              } else if(this.list[i].jraqPgnrf[j].tcXxxlx === '031007'){
                this.list[i].tcQzdydf = this.list[i].jraqPgnrf[j].tnPgdf
              } else if(this.list[i].jraqPgnrf[j].tcXxxlx === '031008'){
                this.list[i].tcAjffdf = this.list[i].jraqPgnrf[j].tnPgdf
              } else {
                this.list[i].tcAqbwdf = this.list[i].jraqPgnrf[j].tnPgdf
              }
            }
          } else {
            this.list[i].tcYycsdf = ''
            this.list[i].tcYwkdf = ''
            this.list[i].tcZzsbdf = ''
            this.list[i].tcYcdf = ''
            this.list[i].tcXfdf = ''
            this.list[i].tcShjzxdf = ''
            this.list[i].tcQzdydf = ''
            this.list[i].tcAjffdf = ''
            this.list[i].tcAqbwdf = ''
          }
        }
      }
    },
    // 机构计分页
    async getFinSecEvaIns(data) {
      const result = await Model.getFinSecEvaIns({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '0004050203', 
        requestData: {
          tcDwdm: data.tcDwbm,
          tcDwmc: data.tcDwmc,
          tcPgrmc: data.tcPgrmc,
          tcPgdj: data.tcPgdj,
          tnPgztid: data.tnPgztid,
          begintime: data.begintime,
          endtime: data.endtime
        }
      });
      if(result.data && result.state === '1') {
        this.list = result.data
        this.pageTotal = result.total
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      if(this.currentNode) {
        let bindData = {
          tcDwbm: this.currentNode.id,
          tcDwmc: "",
          tcPgrid: "",
          tcPgdj: "",
          tnPgztid: "",
          begintime: "",
          endtime: "",
        }
        if(this.formType === "evalDetail") {
          this.getListDataDetail(bindData)
        } else if(this.formType === "evalOverview") {
          this.getFinSecEvaAbout(bindData)
        } else {
          this.getFinSecEvaIns(bindData)
        }
      }
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>


<style lang="scss">
  .el-tabs {
    height: 100% !important;
  }
</style>