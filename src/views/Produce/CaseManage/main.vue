<template>
  <CustomView>
    <!-- 机构树 -->
    <CommonOrgTree ref="commonTree" slot="side" fnCode="000407" module="normal" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/>

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">
      <DataFilter ref="dataFilter" :curRegion="curRegion" @choose="_DataFilterChoose" @query="_DataFilterQuery" />
      <CustomToolbar>
        <span class="common-org-title" slot="left">
          <CustomIcon name="afiliate"/>
          {{currentOrg.name}}
        </span>
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @switch-change="_SwitchChange">
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
    </DataGrid>

    <!-- 选择提交单位弹框 -->
    <CustomDialog title=" 选择提交单位" :visible="dlgVisble" @close="_DlgCloseHandle">
      <CommonOrgTree ref="orgTree" check-strictly content fnCode="000407" style="height: 400px" @click="_OrgTreeRegionClick" />
      <div class="filter-btn" style="text-align:right;padding: 10px;">
        <el-button type="primary" size="mini" @click="_DlgButtonClick">确定</el-button>
      </div>
    </CustomDialog>
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
      // 数据列表
      list: [
        
      ],
      currentOrg: {},
      dlgVisble: false,
      curRegion: {},
      query: {}
    }
  },
  methods: {
    $init(){
      // 根据需求 事故上报功能直接链接到信息上报中去
      this.$router.push({
        path: '/info/case/commit'
      })
    },
    // 事件-点击树结点
    _OrgTreeClick(node) {      
      this.currentOrg = node
      this.getList()
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      this.currentOrg = node
      this.getList()
    },
    // 事件 - 表格双击
    _DataGridDblClick(row) {
      this.$router.push({
        path: '/finance/daily/train/detail',
        query: {
          type: 'update',
          // orgId: row.id,
          // orgName: this.currentOrg.name,
        }
      })
    },
    // 事件 - 新增
    _ButtonAddClick() {
      this.$router.push({
        path: '/produce/case/manage/detail',
        query: {
          type: 'add',
          orgId: this.currentOrg.id,
          orgName: this.currentOrg.name,
        }
      })
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
    },
    // 事件 - 查询
    _DataFilterQuery(query) {
      this.query = query
      this.getList()
    },
    // 事件 - 选择提交单位
    _DataFilterChoose() {
      this.dlgVisble = true
    },
    _DlgCloseHandle() {
      this.dlgVisble = false
      this.$forceUpdate()
    },
    _DlgButtonClick() {
      this.dlgVisble = false
    },
    // 事件-选择区域-点击树节点
    _OrgTreeRegionClick(node) {
      this.curRegion = node
    },
    // 加载列表
    async getList () {
      const result = await Model.getSggllist({
        cdId: '00040702',
        isQuery: 1,
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tcCjdwbm: this.query.tcDwdm || '',
          tcSglxbm: this.query.tcSglx || '',
          beginDate: this.query.tcSgkssj || '',
          endDate: this.query.tcSgjssj || '',
          tcSgfsdwbm: this.currentOrg.id
        }
      })
      if(result.state === '1' && result.data) {
        this.list = result.data
        this.list.forEach(item => {
          item.tdSgfssj = Moment(item.tdSgfssj).format('YYYY-MM-DD')
        })
        this.pageTotal = result.total
      }
    },
    // 停用/启用
    async _SwitchChange(val, tnSgglid) {
      const result = await Model.updateSggl({
        isQuery: 0,
        requestData: {
          tnSgglid: tnSgglid,
          tnSfyx: val
        }
      })
      if (result.state === '1') {
        if(val) {
          this.$message({
            message: '启用成功!',
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true,
          })
        } else {
          this.$message({
            message: '停用成功!',
            type: "success",
            duration: 1000,
            customClass: "middle",
            showClose: true,
          })
        }
        this.getList()
      }
    }
  },
}
</script>

