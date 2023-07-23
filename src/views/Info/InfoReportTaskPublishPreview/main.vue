<template>
  <CustomView :location="[{ text: '报表任务时间设置'}]">
    <!-- 查询条件 -->
    <div slot="top">
      <DataFilter ref="dataFilter" @query="_DataFilterQuery"/>
    </div>

    <CustomDialog title='日期设置' :visible="dlgVisible" @close="dlgVisible = false">
      <div class="block">
        <span class="task-time">任务截止时间</span>
        <el-date-picker size="mini" clearable v-model="sj" type="date" placeholder="选择日期" :picker-options="pickerOptions0">
        </el-date-picker>
      </div>
      <div class="dialog-button">
        <el-button size="mini" type="primary" @click="_SaveButtonClick">保存</el-button>
      </div>
    </CustomDialog>

    <!-- 数据表格 -->
    <DataGrid :list="list" :dlgVisible="dlgVisible" @open="dlgVisibleOpen" >
      <CustomPage :total="pageTotal" :pageNum="pageNum" :rows="pageRows" @rows-change="_PageRowsChange" @change="_PageChange"/>
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
      pickerOptions0: {
      disabledDate: (time) => {
        let date = new Date(this.list[0].tcXjzsj)
        return time.getTime() < date.getTime()
      }
    },  
     
      selection: [],
      query: {},
      dlgVisible: false,
      sj: '',
      id: '',
    }
  },
  methods: {
    $init (options) {
      this.getTaskList()
      // this.updateTaskList()
    },

    // 查询
    _DataFilterQuery (query) {
      this.query = query
      this.getTaskList()
    },


    // 打开弹窗
    dlgVisibleOpen (params) {
      this.dlgVisible = true
      this.sj = params.tcXjzsj
      this.id = params.tnId
    },

    _SaveButtonClick () {
      if(!!this.sj){
        this.sjw = Moment(this.sj).format('YYYY-MM-DD')
      }else{
        this.$alert(`请选择时间！`)
        return
      }
      this.dlgVisible = false
      this.$message ({
        message: '修改成功!',
        type: 'success',
        customClass: 'middle',
        showClose: true,
        duration:2000,
      })
      this.updateTaskList()
    },
    // 事件-改变每页数量
    _PageRowsChange (num) {
      this.pageRows = num
      this.pageNum = 1
      this.getTaskList()
    },
    // 事件-翻页
    _PageChange (num) {
      this.pageNum = num
      this.getTaskList()
    },
    async getTaskList() {
      const result = await Model.getTaskList({
        isQuery: 1,
        cdId: '0004030302',
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tnRwid: this.$route.query.id,
          tcDwmc: this.query.tcDwdm || '',
        }
      })
      if (result && result.data) {
        this.list = result.data

        this.list.forEach(item => {
          if (item.tcXjzsj === undefined) {
            item.tcXjzsj = this.$route.query.rwJzsj
          } 
        })
        this.pageTotal = result.total
      }
    },
    async updateTaskList () {
      const result = await Model.updateTaskList ({
        isQuery: 0,
        cdId: '0004030302',
        rows: this.pageRows,
        pageNum: this.pageNum,
        requestData: {
          tnId: this.id,
          tcXjzsj: this.sjw
        }
      })
      this.getTaskList()
    },
  },
}
</script>

<style lang="scss" scoped>
.block {
  height: 100px;
  line-height: 100px;
  text-align: center;
  .task-time {
    padding-right: 10px;
  }
}

.dialog-button {
  text-align: center;
  margin-bottom: 10px;
}
</style>

