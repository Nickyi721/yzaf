<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
    </div>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick">
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

export default {
  name: 'ChinapostWorkList',
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
      list: [],
      selection: [],
      query:{},
      isFirstEnter: true
    }
  },
  methods: {
    $init (options) {
      this.getList()
    },
    _DataFilterQuery(query) {
      this.query = query
      this.getList();
    },
    _DataGridDblClick(row) {
      this.$router.push({
        path: '/chinapost/work/list/detail',
        query: {
          year: row.tcNd,
          tnNzkpzid: row.tnNzkpzid,
          tnZt: row.tnZt,
          tcDwdm: row.tcDwdm
        }
      })
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getList()
    },
    async getList() {
      const result = await Model.getList({
        isQuery: 1,
        cdId: '0004090101',
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcNd: this.query.tcNd?this.query.tcNd.getFullYear():'',
          tcDwmc: this.query.tcDwmc || '',
          tnZt: this.query.tnZt!==undefined?this.query.tnZt:''
        }
      })
      if(result.data) {
        this.list = result.data
        this.pageTotal = result.total
        
        this.list.forEach((item) => {
          if(item.tnZt === 0) {
            item.tnZtmc = '进行中'
          } else {
            item.tnZtmc = '已完结'
          }
        })
      }
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
