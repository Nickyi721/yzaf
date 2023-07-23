<template>
  <CustomView>
    <!-- <CommonOrgTree slot="side" fnCode="000402" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"  />  -->
    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery" :jhlxs="jhlxs"/>
      <!-- <CustomToolbar>
        <CustomButton icon="unlock" text="重新提交" @click="_ButtonAddClick"/>
      </CustomToolbar> -->
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import Moment from 'moment'

import DataFilter from './components/DataFilter.vue'
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'SafeManageQuery',
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
      query: {
        tnJhlx: '0'
      },
      // 列表
      list: [],
      begintime:'',
      endtime:'',
      tcJhmc:'',
      id:'',
      jhlxs: [
        {tcSjubm:'0',tcSjnr:'专项'},
        {tcSjubm:'1',tcSjnr:'例项'}
      ],
      isFirstEnter: true
    }
  },
  methods: {
    // 事件-条件查询
    _DataFilterQuery (query) {
      this.query = query
      // if(query.time!=null){
      this.begintime = query.time != null ? query.time[0] : ''
      this.endtime = query.time != null ? query.time[1] : ''
      // }
      this.getAqjcbList()
    },
     _OrgTreeLoaded(node) {
      this.currentOrg = node
      if (node) {
        this.getAqjcbList()
      }
    },
    _ButtonAddClick(){

    },
    // 事件-双击表格行列
    _DataGridDblClick (row) {
      this.currentRow = row
      window.localStorage.setItem('tcJhmc', row.tcJhmc)
      this.$router.push({ path: '/safe/manage/query/detail', query: { 
          tnAqjcjhid: row.tnAqjcjhid,
          tcJhsm: row.tcJhsm,
          tcJhjzsj: row.tcJhjzsj,
          tnJhzt: row.tnJhzt,
          ytNum: row.ytNum,
          wtNum: row.wtNum
        } 
      })
    },
    //选择机构树
    _OrgTreeClick(node,checked){
      this.currentOrg = node
      this.id=node.id
      this.pageNum = 1
      this.getAqjcbList()
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getAqjcbList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getAqjcbList()
    },
    // 获取列表数据
    // 获取列表
    async getAqjcbList () {
      const result = await Model.getAqjcbList({
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcJhkssj : this.begintime || '',
          tcJhjssj : this.endtime ||'',
          tcJhmc:this.query.tcJhmc || '',
          tcDwdm:this.id || '',
          tnJhlx: this.query.tnJhlx
        }
      })
      if (result.data) {
        this.list = result.data
        this.pageTotal = result.total
         this.list.forEach(function (item) {
            if(item.tnXxzt===0){
              item.tnXxzt="未生成"
            }else if(item.tnXxzt===1){
              item.tnXxzt="生成报告书"
            }else if(item.tnXxzt===2){
              item.tnXxzt="生成整改通知书"
            }else if(item.tnXxzt===3){
              item.tnXxzt="生成隐患整改回馈书"
            }
          })
      }
    },
  },
  created () {
    this.getAqjcbList()
  },
  activated () {
    if(!this.isFirstEnter) {
      this.getAqjcbList()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
