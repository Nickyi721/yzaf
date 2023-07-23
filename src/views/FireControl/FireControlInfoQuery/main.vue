<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree :search="search" ref="commonTree" slot="side" fnCode="000408" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>    
    
    <div slot="top">
      <InfoCard :infoCardShow="infoCardShow" :title="currentOrg.name" :info="currentOrg"/>
      <el-tabs v-if="currentOrg && type==1" v-model="activeTab" @tab-click="_TabClick">
        <el-tab-pane :label="tab.tcSjnr" v-for="(tab, $index) in equipType" :key="$index"></el-tab-pane>
      </el-tabs>
      <CustomToolbar>
        <CustomButton v-if="list.length" icon="export" text="导出" @click="_ExportClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid v-if="currentOrg" :disabled="disabled" :currentType="currentType" :currentOrg="currentOrg" :detailType="detailType" :detailTypeText="detailTypeText" :config="config" :list="list" @dblclick="_DataGridDblClick" />
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import ExportToExcel from "@commons/exportToExcel.js"

// 页面组件
import DataGrid from './components/DataGrid.vue'
import InfoCard from './components/InfoCard.vue'
export default {
  name: 'FireControlInfoQuery',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataGrid,
    InfoCard
  },
  data () {
    return {
      dict: ['1001'],
      equipTypeSet: [],
      equipType: [],
      currentType: '',
      currentTypeText: '',
      detailType: '',
      detailTypeText: '',
      config: [],
      // 数据列表
      list: [],
      selection: [],
      // 机构树是否可以筛选
      search: false,
      isFirstEnter: true,
      currentOrg: {},
      activeTab: '',
      tempCurrentType: '',
      tempCurrentTypeText: '',
      infoCardShow: true,
      type: 1,
      disabled: true,
      tableConfig: {
        _this: this
      },
      title: [],
      downloadList: [],
    }
  },
  methods: {
    async $init(options){
      if (options) {
        const result = await Model.getEquipType({})
        if (result.data && result.state === '1') {
          this.equipType = result.data
          this.currentType = this.equipType[0].tcSjubm
          this.tempCurrentType = this.equipType[0].tcSjubm
          this.currentTypeText = this.equipType[0].tcSjnr
          this.tempCurrentTypeText = this.equipType[0].tcSjnr
        }
      }
      this.getEquipConfig()
    },
    // 事件-点击树结点
    async _OrgTreeClick(node) {      
      this.currentOrg = JSON.parse(JSON.stringify(node))
      this.type = this.currentOrg.type == 2 ? 2 : 1
      if(this.type === 2) {
        this.infoCardShow = false
        // 查询配置-表头
        const result = await Model.getEquipConfig({
          tnDllx: 0,
          tcXxxlx: '100101'
        })
        if (result.data) {
          this.config = result.data
          // 查询列表
          const resultList = await Model.getXfxxList({
            requestData: {
              tcXxxlx: '100101',
              tcZfclxsj: this.currentOrg.id,
              tcSsdwdm: this.currentOrg.dwbm
            }
          })
          if (resultList.data) {
            this.list = this.processData(resultList.data)
          }
        }
      } else {
        this.infoCardShow = true
        this.getEquipData()
      }
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      this.type = this.currentOrg.type == 2 ? 2 : 1
      this.getEquipData()
    },
    // 事件 - 表格双击
    _DataGridDblClick (row) {
      this.$router.push({
        path: '/firecontrol/info/detail',
        query: {
          type: 'update',
          // 根据节点类型 去判断单位编码和名称传值
          orgId: this.currentOrg.dwbm || this.currentOrg.id,
          orgName: this.currentOrg.name,
          equipType: this.currentType,
          equipTypeText: this.currentTypeText,
          equipOrder: row.tnYwpc,
          view: this.disabled
          // detailType: this.detailType,
          // detailTypeText: this.detailTypeText,
        }
      })
      
    },
    // 事件 - 选项卡切换
    _TabClick () {
      this.currentType = this.equipType[this.activeTab].tcSjubm
      this.currentTypeText = this.equipType[this.activeTab].tcSjnr
      this.tempCurrentType = this.equipType[this.activeTab].tcSjubm
      this.tempCurrentTypeText = this.equipType[this.activeTab].tcSjnr

      this.getEquipConfig()
    },
    //导出按钮
    _ExportClick() {
      let exportList = []
      let fileName = this.equipType[this.activeTab].tcSjnr
      let thList = document.getElementsByTagName('thead')[0].childNodes[0].childNodes //表头
      let idx = [] //用于表头和表体一一对应
      thList.forEach((v, j) => {
        let text = v.innerText
        if(!!text && text!='#') {
          this.title.push(v.innerText)
          idx.push(j)
        }
      })
      let trList = document.getElementsByTagName('tbody')[0].childNodes  //tr
      trList.forEach((v, j) => {
        if(j < trList.length-1){
          let temp = {}
          let tdList = v.childNodes
          tdList.forEach((a, i) => {
            let text = a.innerText
            idx.forEach(arr => {
              if(i=== arr) {
                let key = thList[arr].innerText
                temp[key] = text
              }
            })
          })
          exportList.push(temp)
        }
      })
      if (this.downloadList.includes(fileName)) {
        if (!window.confirm("您刚刚已经下载过改文件了哦，需要重新下载吗？")){
          return false;
        }
      }
      var isrepeat = true;
      for(let key in exportList[0]){
        if(exportList[0][key] !== key){
          isrepeat = false;
        }
      }
      if(isrepeat){
        exportList.shift()
      }
      ExportToExcel(exportList, this.tableConfig, fileName);
      // 把已下载的表名存入已下载列表中
      this.downloadList.push(fileName);
    },
    async getEquipConfig () {
      const result = await Model.getEquipConfig({
        tnDllx: 0,
        tcXxxlx: this.currentType
      })
      if (result.data) {
        this.config = result.data
        this.getEquipData()
      }
    },
    // 获取列表
    async getEquipData () {
      const result = await Model.getXfxxList({
        requestData: {
          tcXxxlx: this.currentType,
          tcSsdwdm: this.currentOrg.id,
        }
      })
      if (result.data) {
        this.list = this.processData(result.data)
      }
    },
    // 对数据处理
    processData (listData) {
      const data = {}
      listData.forEach(item => {
        data[item.tnYwpc] = data[item.tnYwpc] || []
        data[item.tnYwpc].push(item)
      })
      return Object.keys(data)
        .map(key => data[key])
        .sort((a, b) => b.tnYwpc - a.tnYwpc)
        .map(fields => {
          const data = {}
          fields.forEach(item => {
            let value
            if (typeof item.tcZfclxsj !== 'undefined') {
              value = item.tcZfclxsj
            }
            if (typeof item.tnSzzxsj !== 'undefined') {
              value = item.tnSzzxsj
            }
            if (typeof item.tnFdxsj !== 'undefined') {
              value = item.tnFdxsj
            }
            data[item.tnXfaqjbxxszid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          return data
        })
    },
  },
  async activated () {
    if(!this.isFirstEnter) {
      if (this.currentType && this.currentOrg) {
        if(this.type == 1) {
          this.getEquipData()
        } else {
          // 查询列表
          const resultList = await Model.getXfxxList({
            requestData: {
              tcXxxlx: '100101',
              tcZfclxsj: this.currentOrg.id,
              tcSsdwdm: this.currentOrg.dwbm
            }
          })
          if (resultList.data) {
            this.list = this.processData(resultList.data)
          }
        }
      }
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
