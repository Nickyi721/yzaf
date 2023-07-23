<template>
  <CustomView>
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
    </div>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblclick">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

  </CustomView>
</template>

<script>
import Moment from 'moment'

// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'SafeExecQuery',
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
      query: {},
      isFirstEnter: true
    }
  },
  methods: {
    $init () {
      this.getPlanList()
    },
    // 事件-查询
    _DataFilterQuery(query) {
      this.query = query
      this.getPlanList()
    },
    // 事件-表格双击
    _DataGridDblclick(row) {
      this.$router.push({ path: '/safe/exec/query/detail' ,query: {id: row.tnAqjcbgid} })
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getPlanList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getPlanList()
    },
    // 加载列表
    async getPlanList () {
      const result = await Model.getPlanList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcJhmc: this.query.tcJhmc || '',
          tcZt: this.query.tcZt || '',
          tcJcrq:this.query.tcJcrq || '',
          beginDate: this.query.tcJhsj != null ? this.query.tcJhsj[0] : '',
          endDate: this.query.tcJhsj != null ? this.query.tcJhsj[1] : ''
        }
      })
      if (result && result.data) {
        this.list = result.data
        this.list.forEach(item => {
          item.tdSbsj = Moment(item.tdSbsj).format('YYYY-MM-DD')
          if(item.tnXxzt === 0) {
            item.tnXxztmc = '未生成报告书'
          } else if(item.tnXxzt === 1) {
            item.tnXxztmc = '已生成报告书'
          } else if(item.tnXxzt === 2) {
            item.tnXxztmc = '已生成隐患整改通知'
          } else {
            item.tnXxztmc = '已生成隐患整改回复'
          }
        })
        this.pageTotal = result.total
      }
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getPlanList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
