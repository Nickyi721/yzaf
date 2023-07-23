<template>
  <CustomView>
    <!-- 侧栏 -->
    <!-- <CommonOrgTree slot="side" fnCode="000405" module="eval" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded" /> -->

    <!-- 顶部：条件查询/操作栏 -->
    <div slot="top">

      <!-- <Sample/>
      <InfoCard :title="currentOrg.name" :info="orgInfo"/> -->
      <div class="common-filter form-wrap" :inline="true">
        <div class="filter-items">
          <!-- <span>故障设施种类</span> -->
          <el-select v-model="params.tcGzsszlbm" placeholder="请选择故障设施种类" size="mini">
            <el-option value="" label="请选择"></el-option>
            <el-option :value="item.tcSjubm" :label="item.tcSjnr" v-for="item in equipType" :key="item.tcSjubm"></el-option>
          </el-select>
          <el-select v-model="params.tnSfgz" placeholder="请选择是否故障" size="mini">
            <el-option value="" label="请选择"></el-option>
            <el-option :value="item.id" :label="item.name" v-for="item in options" :key="item.tcSjubm"></el-option>
          </el-select>
          <!-- <span>故障设施种类</span> -->
          <el-input v-model="params.tcCjrmc" placeholder="请输入上报人" size="mini"></el-input>
          <!-- <span>故障时间</span> -->
          <el-date-picker v-model='params.time' :unlink-panels="true" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
          <el-button type="primary" size="mini" @click="searchQuery">查询</el-button>
        </div>
      </div>
      <CustomToolbar>
        <CustomButton icon="edit" text="上报" @click="_ButtonClick('add')" />
        <CustomButton icon="delete" text="删除" @click="_ButtonClick('delete')" />
      </CustomToolbar>
    </div>

    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_GridSelectionChange" @detail-click="detailClick">
      <CustomPage :total="pageTotal" :rows="pageRows" :pageNum="pageNum" @rows-change="_PageRowsChange" @change="_PageChange" />
    </DataGrid>
    <info-dialog ref="infoDialog" @dblclick="_infoGridDblClick"></info-dialog>
  </CustomView>

</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import Moment from 'moment'

import DataGrid from './components/DataGrid/main.vue'
import InfoDialog from './components/InfoDialog/main.vue'

export default {
  name: 'FinanceEvalCommit',
  mixins: [
    Mixin.init,
    Mixin.page
  ],
  components: {
    DataGrid,
    InfoDialog
  },
  data () {
    return {

      dict: ['0301'],
      equipType: [],
      equipTypeSet: [],
      options: [{
        id: 1,
        name: '是'
      }, {
        id: 0,
        name: '否'
      }],
      params: {
        tcGzsszlbm: '',
        tcCjrmc: '',
        tcGzfsdwmc: '',
        tnSfgz: '',
        time: ''
        // startTime: '',
        // endTime: ''
      },
      // 机构信息
      orgInfo: {},
      // 列表
      list: [],
      // 分页
      total: 0,
      rows: 20,
      pageNum: 1,
      hasCommiting: 0,
      selection: [],
      isFirstEnter: true
    }
  },
  methods: {
    _infoGridDblClick (row) {

    },
    $init (options) {
      this.equipTypeSet = options['0301']
      this.equipType = options['0301'].filter(item => item.tcSjubm !== '030108' && item.tcSjubm !== '030109')
      this.getListData()
    },
    detailClick (row) {
      let currentType = row.tcGzsszlbm
      let detailType, detailTypeText
      let currentOrg = {
        id: row.tcGzfsdwbm,
        name: row.tcGzfsdwmc
      }
      if (this.currentType === '030106') {
        detailType = '030108'
        detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm == row.tcGzsszlbm)[0].tcSjnr
      } else if (this.currentType === '030107') {
        detailType = '030109'
        detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm == row.tcGzsszlbm)[0].tcSjnr
      } else {
        detailType = ''
        detailTypeText = ''
      }
      this.$refs['infoDialog'].init({
        currentType,
        detailType,
        detailTypeText,
        currentOrg,
        tnYwpc: row.tnYwpc
      })
    },

    // 事件-按钮点击
    async _ButtonClick (type) {
      switch (type) {
        case 'add':
          this.$router.push({
            path: '/finance/devicerror/add'
          })
          break
        case 'delete':
          if (this.selection.length > 0) {
            this.$confirm('是否删除所选数据？').then(() => {
              this.deleteData(this.selection)
            })
          } else {
            this.$alert('请选择需要删除的数据！')
          }
      }
    },
    // 事件-双击表格行列
    _DataGridDblClick (row) {
      this.$router.push({
        path: '/finance/devicerror/add',
        query: {
          tnAfssgzbsid: row.tnAfssgzbsid
        }
      })
    },
    _GridSelectionChange (selection) {
      this.selection = selection
    },
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getListData()
    },
    _PageChange (num) {
      this.pageNum = num
      this.getListData()
    },
    // 删除数据
    async deleteData (selection) {
      const result = await Model.deleteEvalData({
        deleteArr: selection.map((item) => {
          return {
            tnYwpc: item.tnYwpc,
            tnAfssgzbsid: item.tnAfssgzbsid
          }
        })
      })
      if (result.state === '1') {
        const txt = result.total ? result.data : '删除成功'
        this.$message({
          message: txt,
          duration: 1000,
          customClass: 'middle',
          onClose: () => {
            this.getListData()
          }
        })
      }
    },
    // 获取列表数据
    async getListData () {
      this.hasCommiting = 0
      const result = await Model.getEvalList({
        rows: this.rows,
        pageNum: this.pageNum,
        requestData: this.params
      })
      if (result.data) {
        this.list = result.data
        this.pageTotal = result.total
      }
    },
    searchQuery () {
      this.pageNum = 1
      if (this.params.time) {
        this.params.startTime = this.params.time[0]
        this.params.endTime = this.params.time[1]
      }
      this.getListData()
    },
    refresh () {
      this.getListData()
      this.$refs.dataTree.refresh()
    }
  },
  activated () {
    if (!this.isFirstEnter) {
      this.getListData()
    }
  },
  deactivated () {
    this.isFirstEnter = false
  }
}
</script>
<style lang="scss" scoped>
.form-wrap {
  display: flex;
  align-items: center;
  padding: 10px;
  span {
    font-size: 14px;
    padding: 0 10px;
  }
  /deep/ .el-input {
    width: 160px;
    margin-right: 10px;
  }
}
</style>
