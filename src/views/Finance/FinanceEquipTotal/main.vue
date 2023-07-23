<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree slot="side" fnCode="000405" net @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <div slot="top" v-if="currentOrg">
      <InfoCard :infoCardShow="infoCardShow" :title="currentOrg.name" :info="currentOrg"/>
      <el-tabs v-if="currentOrg && type==1" v-model="activeTab" @tab-click="_TabClick">
        <el-tab-pane :label="tab.tcSjnr" v-for="(tab, $index) in equipType" :key="$index"></el-tab-pane>
      </el-tabs>
      <CustomToolbar>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
        <CustomButton v-if="list.length" icon="export" text="导出" @click="_ExportClick"/>
      </CustomToolbar>
    </div>

    <DataGrid v-if="currentOrg" :currentType="currentType" :currentOrg="currentOrg" :detailType="detailType" :detailTypeText="detailTypeText" :config="config[currentType]" :list="list" @dblclick="_DataGridDblClick" @selection-change="_GridSelectionChange"/>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import ExportToExcel from "@commons/exportToExcel.js"

import DataGrid from './components/DataGrid.vue'
import InfoCard from './components/InfoCard.vue'

export default {
  name: 'FinanceEquipTotal',
  mixins: [
    Mixin.init
  ],
  components: {
    DataGrid,
    InfoCard
  },
  data () {
    return {
      dict: ['0301'],
      equipTypeSet: [],
      equipType: [],
      currentType: '',
      currentTypeText: '',
      detailType: '',
      detailTypeText: '',
      activeTab: '',
      config: {},
      list: [],
      selection: [],
      currentOrg: null,
      type: 1,
      isFirstEnter: true,
      tempCurrentType: '',
      tempCurrentTypeText: '',
      infoCardShow: true,
      tableConfig: {
        _this: this
      },
      title: [],
      downloadList: [],
    }
  },
  methods: {
    $init (options) {
      if (options && options['0301']) {
        this.equipTypeSet = options['0301']
        this.equipType = this.equipTypeSet.filter(item => item.tcSjubm !== '030108' && item.tcSjubm !== '030109')
        this.currentType = this.equipType[0].tcSjubm
        this.tempCurrentType = this.equipType[0].tcSjubm
        this.currentTypeText = this.equipType[0].tcSjnr
        this.tempCurrentTypeText = this.equipType[0].tcSjnr
      }
      this.getEquipConfig()
    },
    // 事件 - 树节点点击
    _OrgTreeClick (node) {
      /*  原来的写法，浅拷贝，后续修改了对象的属性，会导致错误
        this.currentOrg = node
      */
      this.currentOrg = JSON.parse(JSON.stringify(node))
      this.type = this.currentOrg.type == 2 ? 2 : 1
      if (this.type == 2) {
        this.currentType = node.id
        this.currentOrg.id = node.dwbm
        if (this.currentType === '030106') {
          this.detailType = '030108'
          this.detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.detailType)[0].tcSjnr
        } else if (this.currentType === '030107') {
          this.detailType = '030109'
          this.detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.detailType)[0].tcSjnr
        } else {
          this.detailType = ''
          this.detailTypeText = ''
        }
        this.infoCardShow = false
        // this.currentTypeText = node.name
      } else {
        this.infoCardShow = true
        this.currentType = this.tempCurrentType
      }
      this.getEquipData()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded (node) {
      this.currentOrg = node
      this.type = this.currentOrg.type == 2 ? 2 : 1
      this.getEquipData()
      // this.dwbm = node.id
      // if (node) {
      //   if(node.jgtype==='1'){//1为单位2为安保机构
      //     this.type = 'grid'//显示列表
      //     this.getSecurityOrgList()
      //   }
      //   if(node.jgtype==='2'){
      //     this.type = 'item'//显示机构详细信息
      //     this.getSecurityOrgInfo()
      //   }
      // }
    },
    // 事件 - 选项卡切换
    _TabClick () {
      this.currentType = this.equipType[this.activeTab].tcSjubm
      this.currentTypeText = this.equipType[this.activeTab].tcSjnr
      this.tempCurrentType = this.equipType[this.activeTab].tcSjubm
      this.tempCurrentTypeText = this.equipType[this.activeTab].tcSjnr

      if (this.currentType === '030106') {
        this.detailType = '030108'
        this.detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.detailType)[0].tcSjnr
      } else if (this.currentType === '030107') {
        this.detailType = '030109'
        this.detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.detailType)[0].tcSjnr
      } else {
        this.detailType = ''
        this.detailTypeText = ''
      }

      this.getEquipData()
    },
    // 事件 - 表格双击
    _DataGridDblClick (row) {
      this.$router.push({
        path: '/finance/equip/detail',
        query: {
          type: 'update',
          orgId: this.currentOrg.id,
          orgName: this.currentOrg.name,
          equipType: this.currentType,
          equipTypeText: this.currentTypeText,
          equipOrder: row.tnYwpc,
          detailType: this.detailType,
          detailTypeText: this.detailTypeText
        }
      })
    },
    // 事件 - 表格勾选
    _GridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件 - 新增按钮点击
    _ButtonAddClick () {
      this.$router.push({
        path: '/finance/equip/detail',
        query: {
          type: 'add',
          orgId: this.currentOrg.id,
          orgName: this.currentOrg.name,
          equipType: this.currentType,
          equipTypeText: this.equipType[this.activeTab].tcSjnr
        }
      })
    },
    _ButtonDeleteClick () {
      if (this.selection.length) {
        this.$confirm('是否删除所选数据？').then(() => {
          this.deleteEquipData(this.selection.filter(item => item.tnYwpc).map(item => item.tnYwpc))
        }).catch(err => { })
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
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
      const result = await Model.getEquipConfig()
      if (result.data) {
        this.config = result.data
      }
    },
    async deleteEquipData (selection) {
      const result = await Model.deleteEquipData({
        tnDllx: 0,
        tcXxxlx: this.currentType,
        tcSsdwdm: this.currentOrg.id,
        tnYwpc: selection.length ? selection : null
      })

      if (result.state === '1') {
        this.$message({
          message: '删除成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle',
          showClose: true
        })
        this.getEquipData()
      }
    },
    async getEquipData () {
      const result = await Model.getEquipData({
        tnDllx: 0,
        tcXxxlx: this.currentType,
        tcSsdwdm: this.currentOrg.id
      })
      if (result.data) {
        this.list = this.processData(result.data.dataList)
      }
    },
    processData (listData) {
      const data = {}
      listData.forEach(item => {
        data[item.tnYwpc] = data[item.tnYwpc] || []
        data[item.tnYwpc].push(item)
        if(item.jraqAfabszDto && item.jraqAfabszDto.tnXxxlrfs === 1){
          Reflect.deleteProperty(item, 'tcSjmc')
        }
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
            data[item.tnAfabszid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          data.tnSfgz = fields[0].tnSfgz
          return data
        })
    },
    refresh () {
      this.getEquipData()
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      if (this.currentType && this.currentOrg) {
        this.refresh()
      }
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
