<template>
  <CustomView :location="[{ text: tipName }]">
    
    <div slot="top">
      <CustomToolbar>
        <CustomButton v-if="!disabled" icon="delete" text="删除" @click="_ButtonDeleteClick" />
        <CustomButton v-if="!disabled" icon="add" text="新增" @click="_ButtonAddClick" />
        <CustomButton v-if="list.length && disabled" icon="export" text="导出" @click="_ExportClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid v-if="currentOrg" :disabled="disabled" :currentType="currentType" :currentOrg="currentOrg" :detailTypeText="detailTypeText" :config="config" :list="list" @dblclick="_DataGridDblClick" @selection-change="_GridSelectionChange"/>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import ExportToExcel from "@commons/exportToExcel.js"
// 页面组件
import DataGrid from './components/DataGrid.vue'
export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      dict: ['1001'],
      equipTypeSet: [],
      equipType: [],
      currentType: '',
      currentTypeText: '',
      detailTypeText: '',
      config: [],
      // 数据列表
      list: [],
      selection: [],
      currentOrg: {},
      type: 1,
      disabled: false,
      tipName: '',
      tableConfig: {
        _this: this
      },
      title: [],
      downloadList: [],
    }
  },
  methods: {
    async $init(options){
      this.getEquipConfig()
      this.disabled = (this.$route.query.view === 'false' || this.$route.query.view === false)?false:true
      this.currentOrg = {
        id: this.$route.query.orgId,
        name: this.$route.query.orgName
      }
      this.tipName = this.$route.query.tipName
    },
    // 事件 - 新增按钮点击 - 新增明细
    _ButtonAddClick () {
      this.$router.push({
        path: '/firecontrol/info/detail',
        query: {
          type: 'addMx',
          orgId: this.$route.query.orgId,
          orgName: this.$route.query.orgName,
          equipType: this.$route.query.detailType,
          equipTypeText: this.$route.query.detailTypeText,
          equipOrder: this.$route.query.tnYwpc,
          view: this.disabled
        }
      })
    },
    // 事件 - 删除按钮点击
    _ButtonDeleteClick () {
      if (this.selection.length) {
        this.$confirm('是否删除所选数据？').then(() => {
          this.deleteXfxxList(this.selection.filter(item => item.tnYwpc).map(item => item.tnYwpc))
        }).catch(err => { })
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    // 事件 - 表格勾选
    _GridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件 - 表格双击 - 修改明细
    _DataGridDblClick (row) {
      this.$router.push({
        path: '/firecontrol/info/detail',
        query: {
          type: 'updateMx',
          orgId: this.$route.query.orgId,
          orgName: this.$route.query.orgName,
          equipType: this.$route.query.detailType,
          equipTypeText: this.$route.query.detailTypeText,
          equipOrder: this.$route.query.tnYwpc,
          tnYwpc: row.tnYwpc,
          detailTypeText: this.$route.query.detailTypeText,
          view: this.disabled
        }
      })
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
    async getEquipConfig () {
      const result = await Model.getEquipConfig({
        tnDllx: 0,
        tcXxxlx: this.$route.query.detailType
      })
      if (result.data) {
        this.config = result.data
        this.$forceUpdate()
        this.getEquipData()
      }
    },
    // 删除
    async deleteXfxxList (selection) {
      const result = await Model.deleteXfxxList({
        tnDllx: 0,
        ywpcList: selection.length ? selection : [],
      })

      if (result.state === '1') {
        this.$message({
          message: '删除成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.getEquipData()
      }
    },
    // 获取列表
    async getEquipData () {
      const result = await Model.getXfxxList({
        requestData: {
          tcXxxlx: this.$route.query.detailType,
          // tcSsdwdm: this.$route.query.orgId,
          tnDyywpc: this.$route.query.tnYwpc
        }
      })
      if (result.data) {
        this.list = this.processData(result.data)
        this.$forceUpdate()
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
}
</script>
