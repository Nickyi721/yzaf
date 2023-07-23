<template>
  <CustomView >
    <!-- 机构树 -->
    <CommonOrgTree slot="side" fnCode="000404" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>
    <DataItem v-if="type=='item'" :item="item" @viewManageStaff = '_viewManageStaff' @viewWorkStaff = '_viewWorkStaff'/>
    
    <CustomToolbar slot="top" v-if="type=='grid'">
      <span class="common-org-title" slot="left">
        <CustomIcon name="afiliate"/>
        {{currentOrg.name}}
      </span>
    </CustomToolbar>
    <DataGrid v-if="type=='grid'" :list="list" @dblclick="_DataGridDblClick">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>

import Mixin from '@mixins'
import DataItem from './components/DataItem.vue'
import DataGrid from './components/DataGrid.vue'
import Model from './model.js'

export default {
  name: 'GuardPerson',
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      query:{
        id: ''
      },
      currentOrg: {},
      item: {},
      list: [],
      type: 'grid',
      dwbm: '',
      isFirstEnter: true
    }
  },
  components: {
    DataItem, DataGrid
  },
  methods: {
    // 事件-点击树结点
    _OrgTreeClick(node) {
      this.currentOrg = node
      this.dwbm = node.id
      if (node) {
        if(node.jgtype==='1'){//1为单位2为安保机构
          this.type = 'grid'//显示列表
          this.getSecurityOrgList()
        }
        if(node.jgtype==='2'){
          this.type = 'item'//显示机构详细信息
          this.getSecurityOrgInfo()
        }
      }
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      this.dwbm = node.id
      if (node) {
        if(node.jgtype==='1'){//1为单位2为安保机构
          this.type = 'grid'//显示列表
          this.getSecurityOrgList()
        }
        if(node.jgtype==='2'){
          this.type = 'item'//显示机构详细信息
          this.getSecurityOrgInfo()
        }
      }
    },
    _DataGridDblClick(row) {
      this.type = 'item'//显示机构详细信息
      this.dwbm = row.tnAbjgid
      this.getSecurityOrgInfo()
    },
    _viewManageStaff(id, name){
      window.localStorage.setItem('tcDwmc', name)
      this.$router.push({name:'guardPersonManager',params: {id,tcSsdwbm:this.tcSsdwbm}})
    },
    _viewWorkStaff(id, name){
      window.localStorage.setItem('tcDwmc', name)
      this.$router.push({name:'guardPersonWorker',params: {id,tcSsdwbm:this.tcSsdwbm}})
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getSecurityOrgList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getSecurityOrgList()
    },
    async getSecurityOrgInfo () {
      const result = await Model.getSecurityOrgInfo({
        isQuery:1,  //是否是查询类 0-否 1-是
        cdId:'00040402', //菜单ID
        cdMc:'安全保卫人员管理',
        requestData: {
          tnAbjgid: this.dwbm
        }
      })
      if (result.data) {
        this.item = JSON.stringify(result.data)
      }
    },
    async getSecurityOrgList () {
      const result = await Model.getSecurityOrgList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
        cdId:'00040402', //菜单ID
        cdMc:'安全保卫人员管理',
        requestData: {
          tcDwbm: this.dwbm
        }
      })
      if (result.data) {
        this.list = result.data.dataList
        this.pageTotal = result.total
        this.tcSsdwbm = result.data.dataList[0].tcSsdwbm        
      }
    },
    refresh () {
      this.type == "grid" ? this.getSecurityOrgList() : this.getSecurityOrgInfo()
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      if (this.dwbm) {
        this.refresh()
      }
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
