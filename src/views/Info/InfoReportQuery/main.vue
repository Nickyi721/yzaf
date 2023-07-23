<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree slot="side" fnCode="000403" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded" />
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" />
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          {{currentOrg.name}}
        </span>
        <CustomButton icon="unlock" text="重新上报" @click="_ButtonClick('unlock')" />
      </CustomToolbar>
    </div>

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
import Moment from 'moment'

// 页面组件
import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'
export default {
  name: 'InfoReportQuery',
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
      currentOrg: {},
      isFirstEnter: true
    }
  },
  methods: {
    // $init () {
    //   // this.getBbsbList()
    // },
    // 事件-点击树结点
    _OrgTreeClick (node) {
      this.currentOrg = node
      this.getBbsbList()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded (node) {
      this.currentOrg = node
      this.getBbsbList()
    },
    // 查询
    _DataFilterQuery (query) {
      this.query = query
      this.getBbsbList()
    },
    // 顶部按钮点击
    _ButtonClick (type) {
      if (!this.selection.length) {
        this.$alert('请选择要操作的记录！')
        return
      }
      let able = 0
      this.selection.forEach(item => {
        if(item.tnTbzt !== 2) {
          able = 1
          return
        }
      })
      if(able === 1) {
        this.$alert('只能操作状态为申请重报的记录！')
      } else {
        this.$confirm('是否重新上报所选数据？').then(async () => {
          const delIds = this.selection.map(item => item.tnRwid)
          const result = await Model.applyData({
            rwidArr: delIds
          })
          if (result.state === '1') {
            this.$message({
              message: '操作成功',
              duration: 1000,
              onClose: () => {
                // this.$init()
                this.getBbsbList()
              }
            })
          }
        }).catch(() => { })
      }
    },
    // 事件-双击表格行
    async _DataGridDblClick (row) {
      if(row.tnLx === 0) {
        const result = await Model.queryRwzt({
          isQuery: 1,
          cdId: '0004030303',
          requestData: {
            tnRwid: row.tnRwid,
            tnLx: row.tnLx,
            tcDwdm: row.tcDwdm
          }
        })
        if (result.data && result.data.length !== 0) {
          // 已提交--预览
          this.$router.push({ 
            path: '/info/report/query/base-form', 
            query: {
              row: JSON.stringify(result.data[0])
            } 
          })
        }
      } else {
        this.$router.push({ path: '/info/report/query/detail', query: row })
      }
    },
    // 事件-行选
    _DataGridSelectionChange (selection) {
      this.selection = selection;
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.getBbsbList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getBbsbList()
    },
    // 加载列表
    async getBbsbList () {
      const sessionId = sessionStorage.sessionId
      const result = await Model.getBbsbList({
        sessionId,
        pageNum: this.pageNum,
        rows: this.pageRows,
        requestData: {
          ...this.query,
          tcDwdm: this.currentOrg.id
        }
      })
      this.list = result.data.list || []
      if(result.data) {
        this.pageTotal = result.total
      }
      
      this.list.forEach((item) => {
        item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD')
      })
    }
  },
  activated () {
    if(!this.isFirstEnter) {
      this.currentOrg && this.getBbsbList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
