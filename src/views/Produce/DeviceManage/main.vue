<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000407" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" :tcSsdwbm="currentOrg.id"/>
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          {{currentOrg.name}}
        </span>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange" @switchChange="_SwitchChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import CommonModel from '@commons/model.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import Moment from 'moment'

export default {
  name: 'DeviceManage',
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
      query: {},
      // 数据列表
      list: [],
      // 已选列表
      selection: [],
      currentOrg: {},
      isFirstEnter: true
    }
  },
  methods: {
    $init(){
      this.getDeviceList()
    },
    // 事件-点击树结点
    _OrgTreeClick(node) {      
      this.currentOrg = node 
      this.query.tcSsdwbm = node.id
      this.getDeviceList()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      this.query.tcSsdwbm = node.id
    },
    // 查询按钮点击
    _DataFilterQuery(query) {
      this.query = query
      this.getDeviceList()
    },
    // 事件-点击新增用户按钮
    _ButtonAddClick() {
      this.$router.push({ path: '/produce/device/manage/detail', query: {type: 'add',tcDwbm: this.currentOrg.id, tcDwmc: this.currentOrg.name}})
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({ path: '/produce/device/manage/detail', query: {type: 'detail', tnSbsslrtoid: row.tnSbsslrtoid}}) 
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getDeviceList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getDeviceList()
    },
    _SwitchChange(val ,id){
      this.setStatus(val, id)
    },
    // 获取设备列表
    async getDeviceList () {
      const result = await Model.getDeviceList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
        cdId:'00040401', //菜单ID
        cdMc:'安全保卫机构管理',
        requestData: this.query
      })
      if (result.data) {
        this.list = result.data.list
        this.list.forEach(el => {
          el.tdCjsj = Moment(el.tdCjsj).format("YYYY-MM-DD")
        })
        this.pageTotal = result.total
      }
    },
    async deleteDevice (ids) {
      const result = await Model.deleteDevice({
        requestData: {
          tnSbsslrtoidArr: this.selection.map(el => el.tnSbsslrtoid)
        }
      })
      if (result.state==='1') {
        this.$msgbox({
          message: '删除成功',
          type: 'success',
          duration: 1000,
          showClose: true,
        })
        this.getDeviceList()
        this.$refs.commonTree.refresh()
      }
    },
    async setStatus(val, id) {
      const result = await Model.setStatus({
        requestData: {
          tnSbsslrtoid: id,
          tnSbzt: val
        }
      })
      if (result.state==='1') {
        this.$msgbox({
          message: result.msg,
          type: 'success',
          duration: 1000,
          showClose: true,
        })
        let index = this.list.findIndex(el => el.tnSbsslrtoid === id)
        if(index !== -1){
          this.list[index].tnSbzt = val
        }
      } else {
        this.list[index].tnSbzt = val ? 0 : 1
      }
    },
    async refresh () {
      this.getSecurityOrgList()
      // let data = await this.$refs.commonTree.getFnOrgList(this.query.tcDwbm)
      // this.$refs.commonTree.children
    },
  },
  activated () {
    if(!this.isFirstEnter) {
      if (this.query.tcDwbm && this.currentOrg) {
        this.refresh()
      }
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
