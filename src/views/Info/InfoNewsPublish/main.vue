<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" :infoTypes="infoTypes" :infoStates="infoStates" @query="_DataFilterQuery" />
      <CustomToolbar>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
      </CustomToolbar>
    </div>
    <!-- 数据表格 -->
    <DataGrid ref="dataGrid" :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange" />
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

export default {
  name: 'InfoNewsPublish',
  mixins: [
    Mixin.init,
    Mixin.page
  ],
  components: {
    DataFilter,
    DataGrid
  },
  data () {
    return {
      query: {
        // tcDwmc: '',
        tcXxbt: '',
        tcLx: '',
        tcSpzt: '',
        startDate: '',
        endDate: ''
      },
      list: [],
      selection: [],
      currentRow: '',
      infoTypes: [],
      infoStates: [],
      isFirstEnter: true
    }
  },
  methods: {
    $init (options) {
      this.getInfoTypes()
      this.getInfoStates()
      this.getDataList()
    },
    _DataFilterQuery (params) {
      this.query = params
      this.getDataList()
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getDataList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getDataList()
    },
    // 事件-点击删除按钮
    _ButtonDeleteClick () {
      if (this.selection.length) {
        this.$confirm('是否删除所选数据？').then(() => {
          this.deleteData(this.selection)
        }).catch(err => { })
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    _RowSelect(selection, row){
      if (row.tcSpzt === "000602") {
        this.$refs.dataGrid.toggleRowSelection(row, false)
        this.$msgbox({
          message: '无法删除已发送的信息',
          type: 'warning'
        })
      }
    },
    _DataGridSelectAll(selection){
      let selectAll = [].concat(selection)
      for(let i=0; i<selectAll.length; i++){
        if (selectAll[i].tnShzt !== 0) {
          this.$refs.dataGrid.toggleRowSelection(selectAll[i], false);
          this.$msgbox({
            message: "无法删除已发送的信息",
            type: "warning"
          });
        }
      }
    },
    async deleteData () {
      const result = await Model.deleteData({
        isQuery: 0, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        requestData: {
          'tnXxidArr': this.selection.map(item => item.tnXxid)
        }
      })
      if (result && result.state === '1') {
        this.$message({
          message: '删除成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle',
          showClose: true,
        })
        this.getDataList()
      }
    },
    // 新增按钮
    _ButtonAddClick () {
      this.$router.push({ path: '/info/news/publish/add' })
    },
    // 双击查看详细
    _DataGridDblClick (row) {
      this.currentRow = row
      const { xxglXxgldwpzDto, ...others } = row
      window.localStorage.setItem('tcSpztmc', row.tcSpztmc)
      if(row.tcSpzt!=='000602'){
        this.$router.push({ name: 'infoNewsPublishDetail', params:{tnXxid: others.tnXxid, sfdxx: others.sfdxx, tcSpzt: others.tcSpzt, tnYxj: others.tnYxj, tnSfhf: others.tnSfhf}})
      }
      if(row.tcSpzt==='000602') {
        this.$router.push({ name: 'infoNewsPublishDetailView', params:{tnXxid: others.tnXxid, sfdxx: others.sfdxx, tcSpzt: others.tcSpzt, tnYxj: others.tnYxj, whfNum: others.jsdwzs - others.dwyhfNum, yhfNum: others.dwyhfNum, tcLx: others.tcLx}})
      }
    },
    // 数据选择
    _DataGridSelectionChange (selection) {
      this.selection = selection
    },
    // 获取列表
    async getDataList () {
      const result = await Model.getDataList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        requestData: this.query
      })
      if (result.data && result.data.list) {
        this.list = result.data.list
        this.list.forEach(el => {
          el.dwwhfNum = el.jsdwzs - el.dwyhfNum
          el.xxglXxgldwpzDto.filter(el=> el.tnLx === 6).forEach(el => {
            el.mode = el.tnXjxzbz
            el.selected = !el.tnBjxzbz
          })
          el.xxglXxgldwpzDtoXS = this.getValueStrArr(el.xxglXxgldwpzDto)
        })
        this.pageTotal = result.total
      }
    },
    getValueStrArr (nodes) {
      let strArr = []
      nodes.forEach(item => {
        if (item.mode === 1) {
          if (item.selected) {
            strArr.push(`${item.tcDwmc}及下一级单位`)
          } else {
            strArr.push(`${item.tcDwmc}下一级单位`)
            // str += `${item.name}下一级单位`
          }
        } else if (item.mode === 2) {
          if (item.selected) {
            strArr.push(`${item.tcDwmc}及所有子单位`)
            // str += `${item.name}及所有子单位`
          } else {
            strArr.push(`${item.tcDwmc}所有子单位`)
            // str += `${item.name}所有子单位`
          }
        } else if (item.selected && !item.mode) {
          strArr.push(`${item.tcDwmc}`)
        }
      })
      return strArr
    },
    async getInfoTypes () {
      const result = await Model.getInfoTypes({
        isQuery: 1, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        requestData: ''
      })
      let all = [{ 'tcSjubm': '', 'tcSjnr': '全部' }]
      this.infoTypes = all.concat(result.data)
    },
    async getInfoStates () {
      const result = await Model.getInfoStates({
        isQuery: 1, // 是否是查询类 0-否 1-是
        cdId: '0004030101', // 菜单ID
        requestData: ''
      })
      let all = [{ 'tcSjubm': '', 'tcSjnr': '全部' }]
      this.infoStates = all.concat(result.data)
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getDataList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
