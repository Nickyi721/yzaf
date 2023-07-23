<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <CustomToolbar slot="top">
      <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
      <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
    </CustomToolbar>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelectionChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange" />
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'SystemInfoGroup',
  mixins: [
    Mixin.page,
    Mixin.init,
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      list: [],
      selection: [],
      currentRow: '',
      isFirstEnter: true
    }
  },
  methods: {
    // 页面初始化
    $init (options) {
      this.getListData()
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
    async deleteData () {
      const result = await Model.deleteData({
        isQuery: 0,  //是否是查询类 0-否 1-是
        cdId: '00040204', //菜单ID
        // sessionId: window.sessionStorage.sessionId,
        requestData: {
          "tnQzglid": this.selection.map(item => item.tnQzglid)
        }
      })
      if (result && result.state === '1') {
        this.$message({
          message: '删除成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
        this.getListData()
        // this.$router.push({path: '/system/info-group'})
      }
      // else {
      //   this.$message({
      //     message: '删除失败!',
      //     type: "fail",
      //     duration: 1000,
      //     customClass: "middle",
      //     showClose: true,
      //   })
      // }
    },
    // 事件-点击新增按钮
    _ButtonAddClick () {
      this.$router.push({ path: '/system/info-group/add' })
    },
    // 事件-双击表格行
    _DataGridDblClick (row) {
      this.currentRow = row
      // this.$router.push({ path: '/system/info-group/detail', query: row })
      this.$router.push({ path: '/system/info-group/detail', query: {tnQzglid: row.tnQzglid} })
    },

    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getListData()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getListData()
    },
    _DataGridSelectionChange (selection) {
      this.selection = selection
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
    async getListData () {
      const result = await Model.getListData({
        rows: this.pageRows,
        pageNum: this.pageNum,
        isQuery: 1,  //是否是查询类 0-否 1-是
        cdId: '00040204', //菜单ID
        // sessionId: window.sessionStorage.sessionId,
        requestData: {
        }
      })
      if (result) {
        this.list = result.data
        this.list.forEach(ele => {
          ele.dwpzList.forEach(el => {
            el.mode = el.tnXjxzbz
            el.selected = !el.tnBjxzbz
          })
          ele.dwpzListXS = this.getValueStrArr(ele.dwpzList)
        })
        // console.log(this.list)
        this.pageTotal = result.total
      }
    },
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getListData()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
