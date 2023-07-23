<template>
  <CustomView :location="[{ text: detailTypeText + '列表' }]">
    <div slot="top">
      <CustomToolbar>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
        <CustomButton v-if="list.length" icon="export" text="导出" @click="_ExportClick"/>
      </CustomToolbar>
    </div>

    <DataGrid :config="config" :list="list" @dblclick="_DataGridDblClick" @selection-change="_GridSelectionChange" />
  </CustomView>

</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import ExportToExcel from "@commons/exportToExcel.js"

import DataGrid from './components/DataGrid.vue'

export default {
  mixins: [
    Mixin.init,
    Mixin.page
  ],
  components: {
    DataGrid
  },
  data () {
    return {
      selection: [],
      config: [],
      list: [],
      orgName: '',
      detailType: '',
      tableConfig: {
        _this: this
      },
      title: [],
      downloadList: [],
    }
  },
  methods: {
    async $init (options) {
      this.detailType = this.$route.query.detailType
      this.detailTypeText = this.$route.query.detailTypeText
      this.orgName = this.$route.query.orgName
      this.orgId = this.$route.query.orgId

      await this.getEquipConfig()
      await this.getEquipData()
    },
    _DataGridDblClick (row) {
      this.$router.push({
        path: '/finance/equip/detail',
        query: {
          type: 'update',
          orgId: this.orgId,
          orgName: this.orgName,
          equipType: this.detailType,
          equipTypeText: this.detailTypeText,
          tnDyywpc: this.$route.query.tnYwpc,
          equipOrder: row.tnYwpc
        }
      })
    },
    _GridSelectionChange (selection) {
      this.selection = selection
    },
    _ButtonAddClick () {
      this.$router.push({
        path: '/finance/equip/detail',
        query: {
          type: 'add',
          orgId: this.orgId,
          orgName: this.orgName,
          equipType: this.detailType,
          tnDyywpc: this.$route.query.tnYwpc,
          equipTypeText: this.detailTypeText
        }
      })
    },
    _ButtonDeleteClick () {
      if (this.selection.length) {
        this.deleteEquipData(this.selection.filter(item => item.tnYwpc).map(item => item.tnYwpc))
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
      let fileName = this.$route.query.detailTypeText
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
    // 获取明细配置
    async getEquipConfig () {
      const result = await Model.getEquipConfig(this.detailType)
      if (result.data) {
        this.config = result.data
      }
    },
    async deleteEquipData (selection) {
      const result = await Model.deleteEquipData({
        tnDllx: 0,
        tcXxxlx: this.detailType,
        tnYwpc: selection
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
        tcXxxlx: this.detailType,
        tcSsdwdm: this.$route.query.orgId,
        tnDyywpc: this.$route.query.tnYwpc
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
            if (typeof item.tnSzfdsj !== 'undefined') {
              value = item.tnSzfdsj
            }
            data[item.tnAfabszid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          data.tnSfgz = fields[0].tnSfgz
          return data
        })
    }
  }
}
</script>
