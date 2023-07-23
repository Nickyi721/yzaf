<template>
  <CustomView>
    <!-- 顶部：条件查询/操作栏 -->
    <CustomToolbar slot="top">
      <CustomButton icon="add" text="新增" @click="_ButtonAddClick"/>
    </CustomToolbar>

    <!-- 数据列表 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick"/>

    <!-- 对话框 -->
    <CustomDialog title="设置时间" :visible="dlgVisble" @close="dlgVisble = false">
      <div style="padding:10px;">
        <el-date-picker v-model="range" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      </div>
      <div style="padding:10px;text-align: right">
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
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
import DataGrid from './components/DataGrid.vue'

export default {
  name: 'SystemFinanceTime',
  mixins: [
    Mixin.init, 
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      list: [],
      range: [],
      dlgVisble: false,
      isFirstEnter: true
    }
  },
  methods: {
    // 页面初始化
    $init(options) {
      this.getListData()
    },
    // 事件-点击新增按钮
    _ButtonAddClick () {
      this.dlgVisble = true
      this.currentId = null
    },
    // 点击对话框保存按钮
    _ButtonSaveClick() {
      this.dlgVisble = false
      this.saveData()
    },
    // 事件-双击表格单元行
    _DataGridDblClick (row) {
      if (row.tcZt !== 1) {
        this.dlgVisble = true
        this.currentId = row.tnId
        this.range = [row.tcKssj, row.tcJssj]
      } else {
        this.$msgbox({
          message: '停用状态的时间段不能修改',
          type: 'warning'
        })
      }
    },
    // 查询列表数据
    async getListData () {
      const result = await Model.getListData()
      if (result.data) {
        this.list = result.data.map(item => {
          item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD')
          return item
        })
      }
    },
    // 新增数据
    async saveData () {
      let result
      if (this.currentId) {
        result = await Model.updateData({
          tcKssj: this.range[0],
          tcJssj: this.range[1],
          tnId: this.currentId
        })
      } else {
        result = await Model.addData({
          tcKssj: this.range[0],
          tcJssj: this.range[1],
        })
      }
      if (result.state === '1') {
        this.$msgbox({
          message: '保存成功',
          type: 'success'
        })
        this.getListData()
      }
    }
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
