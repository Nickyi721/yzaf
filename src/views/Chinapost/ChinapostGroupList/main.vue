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
  name: 'ChinapostGroupList',
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
      query: {},
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
        path: '/chinapost/group/list/detail',
        query: {
          year: row.tcNd,
          orgId: row.tcDwdm,
          orgName: row.tcDwmc,
          tnNzkpzid: row.tnNzkpzid,
          tnZt: row.tnZt,
          oneVeto: row.oneVeto
        }
      })
    },
    _DataGridSelectionChange() {

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
        cdId: '0004090301',
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcNd: this.query.tcNd ? this.query.tcNd.getFullYear() : '',
          tnZt: (this.query.tnZt !== undefined) ? (this.query.tnZt) : '',
          tcKpdj: (this.query.tcKpdj !== undefined) ? (this.query.tcKpdj) : '',
        }
      })
      if(result.data) {
        this.list = result.data
        this.pageTotal = result.total
        this.list.forEach((item) => {
          if(item.tcBz == '' || item.tcBz == undefined) {
            if(item.tcKpdj === '0') {
              item.tcKpdjmc = '优秀'
            } else if(item.tcKpdj === '1') {
              item.tcKpdjmc = '合格'
            } else if(item.tcKpdj === '2') {
              item.tcKpdjmc = '不合格'
            }

            if(item.tnZt === 0) {
              item.tnZtmc = '未考评'
            } else {
              item.tnZtmc = '已考评'
            }
            if(item.tnKpzdf !== undefined) {
              item.tnZhdf = (parseFloat(item.tnKpzdf)*0.7 + parseFloat(item.tnZpzdf)*0.3).toFixed(2)
            } else {
              item.tnZhdf = item.tnZpzdf
            }
            item.oneVeto = 0
          } else {
            item.tnKpzdf = 0
            item.tnZhdf = 0
            item.tnZtmc = '一票否决'
            item.tcKpdjmc = '不合格'
            item.oneVeto = 1
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
