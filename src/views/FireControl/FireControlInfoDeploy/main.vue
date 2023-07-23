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
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
        <CustomButton v-show="type === 1" icon="add" text="新增" @click="_ButtonAddClick" />
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid v-if="currentOrg" :currentType="currentType" :currentOrg="currentOrg" :detailType="detailType" :detailTypeText="detailTypeText" :config="config" :list="list" @dblclick="_DataGridDblClick" @selection-change="_GridSelectionChange"/>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataGrid from './components/DataGrid.vue'
import InfoCard from './components/InfoCard.vue'

export default {
  name: 'FireControlInfoDeploy',
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
      // 机构树是否可以搜索
      search: false,
      isFirstEnter: true,
      currentOrg: {},
      activeTab: '',
      tempCurrentType: '',
      tempCurrentTypeText: '',
      infoCardShow: true,
      type: 1,
      disabled: false
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
    // 事件 - 新增按钮点击 - 新增主类
    _ButtonAddClick () {
      this.$router.push({
        path: '/firecontrol/info/detail',
        query: {
          type: 'add',
          orgId: this.currentOrg.id,
          orgName: this.currentOrg.name,
          equipType: this.currentType,
          equipTypeText: this.equipType[this.activeTab].tcSjnr,
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
    // 事件 - 表格双击 - 修改主类
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
          detailType: this.detailType,
          detailTypeText: this.detailTypeText,
          view: this.disabled
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
          tcXxxlx: this.currentType,
          tcSsdwdm: this.currentOrg.id,
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
