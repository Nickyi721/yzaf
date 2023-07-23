<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree slot="side" fnCode="000402" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          {{currentOrg.name}}
        </span>
        <!-- <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick"/> -->
        <CustomButton icon="add" text="多选启用" @click="_ButtonOpenlick"/>
        <CustomButton icon="delete" text="多选停用" @click="_ButtonDeleteClick"/>
        <CustomButton icon="delete" text="多选删除" @click="_ButtonDeleteClick2"/>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
        <CustomButton icon="export" text="导出" @click="_ButtonExportClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @switch-change="_SwitchChange" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Moment from 'moment'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'SystemUser',
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
    // 事件-点击树结点
    _OrgTreeClick(node) {
      this.currentOrg = node
      this.pageNum = 1
      this.getUserList()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      if (node) {
        this.getUserList()
      }
    },
    // 事件-点击查询按钮
    _DataFilterQuery(query, isClicked) {
      this.query = query
      this.currentOrg = isClicked ? {} : this.currentOrg
      this.getUserList()
    },
    // 事件-多选启动 用户
    _ButtonOpenlick() {
      if (this.selection.length) {
        this.$confirm('是否启用所选用户').then(()=>{
          this.deleteUser(this.selection.map(item => item.tnYhid), 0)
        }).catch(()=>{})
      } else {
        this.$msgbox({
          message: '请选择用户',
          type: 'warning'
        })
      }
    },
    _ButtonExportClick() {
      this.exportTable()
    },
    // 事件-点击停用用户按钮
    _ButtonDeleteClick() {
      if (this.selection.length) {
        this.$confirm('是否停用所选用户').then(()=>{
          this.deleteUser(this.selection.map(item => item.tnYhid), 1)
        }).catch(()=>{})
      } else {
        this.$msgbox({
          message: '请选择用户',
          type: 'warning'
        })
      }
    },
    // 事件-点击删除用户按钮
    _ButtonDeleteClick2() {
      if (this.selection.length) {
        this.$confirm('是否删除所选用户').then(()=>{
          this.deleteUser2(this.selection.map(item => item.tnYhid),this.selection.map(item => item.tcYhzh), 2)
        }).catch(()=>{})
      } else {
        this.$msgbox({
          message: '请选择用户',
          type: 'warning'
        })
      }
    },
    // 事件-点击新增用户按钮
    _ButtonAddClick() {
      this.$router.push({ path: '/system/user/detail', query: { type: 'add', orgCode: this.currentOrg.id, orgName: this.currentOrg.name } }) 
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({ path: '/system/user/detail', query: { type: 'update', userId: row.tnYhid ,userZh:row.tcYhzh} }) 
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getUserList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getUserList()
    },
    async exportTable() {
      const result = await Model.exportTable({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcDwdm: this.currentOrg.id,
          tcYhzh: this.query.tcYhzh,
          tcYhmc: this.query.tcYhmc,
          tcDwmc: this.query.tcDwmc
        }
      })
      if(result){
        this.$message({
          message: '导出成功',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        const content = result
        const blob = new Blob([content])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `${this.currentOrg.name}用户.xls`
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
    },
    // 获取用户列表
    async getUserList () {
      const result = await Model.getUserList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcDwdm: this.currentOrg.id,
          tcYhzh: this.query.tcYhzh,
          tcYhmc: this.query.tcYhmc,
          tcDwmc: this.query.tcDwmc
        }
      })
      if (result.data) {
        this.list = result.data.map(item => {
          item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD')
          item.role = item.tnJsidList.map(role => role.tcJsmc).join(',')
          return item
        })
        this.pageTotal = result.total
      }
    },
    async deleteUser (ids, tnZt) {
      const result = await Model.deleteUser({
        delete: ids,
        tnZt: tnZt
      })
      if (result) {
        if(tnZt) {
          this.$message({
            message: '停用成功!',
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true,
          })
        } else {
          this.$message({
            message: '启用成功!',
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true,
          })
        }
        this.getUserList()
      }
    },
    async deleteUser2 (ids,yhzhs, tnZt) {
      const result = await Model.deleteUser2({
        delete: ids,
        yhzhs: yhzhs,
        tnZt: tnZt
      })
      if (result) {
        if(tnZt) {
          this.$message({
            message: '删除成功!',
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true,
          })
        } 
        this.getUserList()
      }
    },
    _SwitchChange(val, tnYhid) {
      console.log(val)
      this.deleteUser([tnYhid], val)
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.currentOrg && this.getUserList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
