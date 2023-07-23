<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar slot="top">
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

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
import Moment from 'moment'

export default {
  name: 'SystemGroup',
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
      // 查询条件
      query: {},
      // 数据列表
      list: [],
      // 已选列表
      selection: [],
      isFirstEnter: true
    }
  },
  methods: {
    // 初始化
    $init (options) {
      this.getWorkGroupList()
    },
    // 事件-点击查询
    _DataFilterQuery(query) {
      query.tcYxkssj = query.range ? query.range[0] : null
      query.tcYxjssj = query.range ? query.range[1] : null
      this.query = query
      this.getWorkGroupList()
    },
    // 事件-点击删除工作组按钮
    _ButtonDeleteClick() {
      if (this.selection.length) {
        this.$confirm('确认删除当前选择数据吗？').then(() => {
          let isDelete = true
          this.selection.forEach(el=>{
            const dwbm = JSON.parse(window.sessionStorage.getItem('user')).tcDwdm
            if(el.tcSsdwdm===dwbm){
              isDelete = false
            }
          })
          if(!isDelete){
            this.deleteWorkGroup(this.selection.map(item => item.tnGzzszbid))
          }else{
            this.$alert('您勾选的选项中包含不能删除的非本单位创建数据,请重新选择').then(()=>{}).catch(err => {})
          }
        }).catch(err => {})
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    // 事件-点击新增工作组按钮
    _ButtonAddClick() {
      this.$router.push({ path: '/system/group/detail', query: { type: 'add' } })
    },
    // 事件-双击表格行
    _DataGridDblClick(row) {
      this.$router.push({ path: '/system/group/detail', query: { type: 'update', groupId: row.tnGzzszbid, isEditable:  row.tcSsdwdm !== JSON.parse(window.sessionStorage.getItem('user')).tcDwdm?'1':'0'} })
    },
    // 事件-选择表格数据行
    _DataGridSelectionChange (selection) {
      this.selection = selection      
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getWorkGroupList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getWorkGroupList()
    },
    // 查询工作组列表
    async getWorkGroupList () {
      const result = await Model.getWorkGroupList({
        isQuery: 1,
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: this.query
      })
      if (result.data) {
        this.list = result.data.list.map(item => {
          item.members = item.workGroupFz.filter(item => item.tnLx === 0).map(member => member.tcMc).join(',')
          item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD')
          return item
        })
        this.pageTotal = result.total
      }
    },
    // 删除工作组
    async deleteWorkGroup (deleteIds) {
      const result = await Model.deleteWorkGroup({
        tnGzzszbidArr: deleteIds
      })
      if (result.state === '1') {
        this.$message({
          message: '删除成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.getWorkGroupList()
      }
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getWorkGroupList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
