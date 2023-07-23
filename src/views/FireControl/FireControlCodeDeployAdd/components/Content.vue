<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <!-- <DataFilter ref="dataFilter" @query="_DataFilterQuery"/> -->
      <CustomToolbar>
        <CustomButton icon="add" text="确定选择" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    <!-- 数据表格 -->
    <DataGrid ref='contentList' :checked="checked" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange" :config="config" :list="list">
      <!-- <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/> -->
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from '../model.js'

// 页面组件
import DataFilter from './DataFilter.vue'
import DataGrid from './DataGrid.vue'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid,
  },
  props: {
    checked: {
      type: Array,
      default: () => []
    },
    tcEwmDlbm: {
      type: String,
      default: () => ''
    },
    tcEwmXlbm: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      query: {
        tcCtnr: '',
        tcYwtxid: '',
        tcSshjid: '',
        tcSslbid: '',
        tcJcfsid: '',
        tnCtzt: ''
      },
      list: [],
      selection: [],
      selected: [],
      config: [],
      currentDlType: '',
      currentXlType: '',
    }
  },
  methods: {
    $init(){
      this.currentDlType = this.tcEwmDlbm
      this.currentXlType = this.tcEwmXlbm
      if(this.currentDlType === '000701'){
        this.getXfEquipConfig()
      }
      else{
        this.getJrEquipConfig()
      }
    },
    _DataFilterQuery(params){
      this.pageNum = 1
      this.query = params
      this.selection = []
      this.selected = []
      this.getDataList()
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.selection = []
      this.selected = []
      this.getDataList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.selection = []
      this.selected = []      
      this.getDataList()
    },
    //新增按钮
    _ButtonAddClick(){
      if (this.selected.length) {
        this.$confirm('是否选择所选数据？').then(() => {
            this.$emit('select', this.selected)
        }).catch(err => {})
      } else{
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    // 事件-选择表格数据行
    _DataGridSelectionChange (selection) {
      this.selection = selection      
    },
    _DataGridDblClick (row) {
      !this.multi && this.$confirm(`是否选择该条数据？`, {
        type: 'warning',
      }).then(() => {
        this.$emit('choose', [row])
      }).catch(() => {})
    },
    clearSelection(){
      this.$refs.dangerList.clearSelection()
    },
    async getJrEquipConfig () {
      const result = await Model.getJrEquipConfig({
        requestData: {
          tnDllx: 0,
        }
      })
      if (result.data) {
        const data = result.data
        this.config = data[this.currentXlType]
        this.getJrEquipData()
      }
    },
    async getJrEquipData () {
      const result = await Model.getJrEquipData({
        tnDllx: 0,
        tcXxxlx: this.currentXlType,
        tcSsdwdm: JSON.parse(window.sessionStorage.getItem('user')).tcDwdm,
      })
      if (result.data) {
        this.list = this.processJrData(result.data)
      }
    },
    processJrData (listData) {
      const data = {}
      if(listData && listData.dataList && listData.dataList.length) {
        listData.dataList.forEach(item => {
          data[item.tnYwpc] = data[item.tnYwpc] || []
          data[item.tnYwpc].push(item)
        })
      }
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
          return data
        })
    },
    //获取表头信息
    async getXfEquipConfig () {
      const result = await Model.getXfEquipConfig({
        tnDllx: 0,
        tcXxxlx: this.currentXlType
      })
      if (result.data) {
        this.config = result.data
        this.getXfEquipData()
      }
    },
    // 获取列表
    async getXfEquipData () {
      const result = await Model.getXfxxList({
        requestData: {
          tcXxxlx: this.currentXlType,
          tcSsdwdm: JSON.parse(window.sessionStorage.getItem('user')).tcDwdm,
        }
      })
      if (result.data) {
        this.list = this.processData(result.data)
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
  watch: {
    tcEwmXlbm: {
      deep: true,
      handler(val) {
        this.currentXlType = val
      }
    }
  }
}
</script>
