<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000404" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" :afjgxzTypes='afjgxzTypes' :tcDwbm="query.tcDwbm"/>
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          {{currentOrg.name}}
        </span>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
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

export default {
  name: 'GuardOrg',
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
      query: {
        tcDwbm: '',
        tcAbjgmc: '',
        tcAbjgxz: ''
      },
      // 数据列表
      list: [],
      // 已选列表
      selection: [],
      currentOrg: {},
      afjgxzTypes: [],
      bkList:[],
      bk: '',
      isFirstEnter: true
    }
  },
  methods: {
    $init(){
      this.getABJGXZ()
    },
    // 事件-点击树结点
    _OrgTreeClick(node) {      
      this.currentOrg = node   
      if (node) {
        if(node.jgtype==='1'){//1为单位2为安保机构
          this.query.tcDwbm = node.id
          this.getSecurityOrgList()
        }
        else{
          this.query.tcDwbm = node.parentId
          this.$router.push({ name: 'guardOrgDetail', params: {tnAbjgid: node.id, dwbm: this.query.tcDwbm}}) 
        }
      }
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      if (node) {
        if(node.jgtype==='1'){//1为单位2为安保机构
          this.query.tcDwbm = node.id
          this.getSecurityOrgList()
        }
      }
    },
    // 查询按钮点击
    _DataFilterQuery(query) {
      this.query = query
      this.getSecurityOrgList()
    },
    // 事件-点击删除用户按钮
    _ButtonDeleteClick() {
      if (this.selection.length) {
        this.$confirm('是否删除所选数据？').then(() => {
          this.deleteSecurityOrg({
            deleteList: this.selection.map(item => item.tnAbjgid),
            isQuery:0,  //是否是查询类 0-否 1-是
            cdId:'00040401', //菜单ID
          })
        }).catch(err => {})
      } else {
        this.$msgbox({
          message: '请选择机构',
          type: 'warning'
        })
      }
    },
    // 事件-点击新增用户按钮
    _ButtonAddClick() {
      this.$router.push({ name: 'guardOrgAdd', params: {dwbm: this.query.tcDwbm}})
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({ name: 'guardOrgDetail', params: {tnAbjgid: row.tnAbjgid, dwbm: this.query.tcDwbm}}) 
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
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
    //获取安保机构性质
    async getABJGXZ () {
      const result = await CommonModel.getDictData(['050101'])
      if (result && result.data) {
        let all = [{tcSjnr: "全部", tcSjubm: ""}]
        this.afjgxzTypes = all.concat(result.data['050101'])
      }
    }, 
    // 获取用户列表
    async getSecurityOrgList () {
      const result = await Model.getSecurityOrgList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery:1,  //是否是查询类 0-否 1-是
        cdId:'00040401', //菜单ID
        cdMc:'安全保卫机构管理',
        requestData: this.query
      })
      if (result.data) {
        this.list = result.data.dataList
        this.bkList = result.data.bkdmList
        this.pageTotal = result.total
        this.bk = []
        this.bkList.forEach(el=>{
          this.bk += JSON.stringify(el) + ';'
        })
        window.localStorage.setItem('bk', this.bk)
      }
    },
    async deleteSecurityOrg (ids) {
      const result = await Model.deleteSecurityOrg({
        requestData: ids
      })
      if (result.state==='1') {
        this.$msgbox({
          message: '删除成功',
          type: 'success',
          duration: 1000,
          showClose: true,
        })
        this.getSecurityOrgList()
        this.$refs.commonTree.refresh()
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
