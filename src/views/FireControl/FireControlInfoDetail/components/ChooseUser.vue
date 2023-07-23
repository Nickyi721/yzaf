<template>
  <CustomView style="height: 500px">
    <!-- 机构树 -->
    <!-- <CommonOrgTree slot="side" fnCode="000405" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded" :isWorkGroup="true" /> -->

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
      <CustomToolbar v-if="multi">
        <CustomButton icon="add" text="选择" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :multi="multi" :checked="checkedList" :list="list" @dblclick="_DataGridDblClick" @select="_DataGridSelect">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import UserModel from '../../../System/SystemUser/model.js'

// 页面组件
import DataFilter from './DataFilter.vue'
import DataGrid from './DataGrid.vue'
import Moment from 'moment'

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
    multi: Boolean,
    checked: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      query: {},
      // 数据列表
      list: [],
      // 已选列表
      selection: [],
      checkedList: []
    }
  },
  methods: {
    // 事件-点击树结点
    // _OrgTreeClick(node) {
    //   this.currentOrg = node
    //   this.getUserList()
    // },
    // // 事件-机构树加载完成
    // _OrgTreeLoaded(node) {
    //   this.currentOrg = node
    //   this.getUserList()
    // },
    $init(){
      this.getUserList()
    },
    // 事件-条件查询
    _DataFilterQuery(query, isClicked) {
      this.query = query
      this.getUserList()
    },
    _DataGridSelect (selected) {
      this.selection = selected
    },
    _ButtonAddClick () {
      if (this.selection.length) {
        this.$emit('choose', this.selection)
      } else {
        this.$msgbox({
          message: '请选择用户',
          type: 'warning'
        })
      }
    },
    _DataGridDblClick (row) {
      !this.multi && this.$confirm(`是否选择该用户？`, {
        type: 'warning',
      }).then(() => {
        this.$emit('choose', [row])
      }).catch(() => {})
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
    // 获取用户列表
    async getUserList () {
      const result = await UserModel.getUserList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcDwdm: JSON.parse(window.sessionStorage.user).tcDwdm,
          tcYhzh: this.query.tcYhzh,
          tcYhmc: this.query.tcYhmc,
          tcDwmc: this.query.tcDwmc
        }
      })
      if (result.data) {
        this.list = result.data
        this.list.forEach(el=>{
          el.tdCjsj = Moment(el.tdCjsj).format('YYYY-MM-DD')
        })
        this.pageTotal = result.total
      }
    },
  },
  mounted() {
    this.checkedList = this.checked
  }
}
</script>
