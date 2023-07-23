<template>
  <CustomView :location="[{ text: '培训计划详情' }]">
    
    <div slot="top">
      <CustomToolbar>
        <CustomButton icon="delete" text="删除" @click="_ButtonDeleteClick" />
        <CustomButton icon="add" text="新增" @click="_ButtonAddClick" />
      </CustomToolbar>
    </div>
    
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblClick" @selection-change="_DataGridSelection"/>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
// import Model from './model.js'

// 页面组件
import DataGrid from './components/DataGrid.vue'
export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      // 数据列表
      list: [],
      selection: [],
    }
  },
  methods: {
    async $init(options){
      
    },
    // 事件 - 新增按钮点击 - 新增明细
    _ButtonAddClick () {
      this.$router.push({
        path: '/finance/daily/train/detail',
        query: this.$route.query
      })
      // this.$router.push({
      //   path: '/firecontrol/info/detail',
      //   query: {
      //     type: 'addMx',
      //     orgId: this.$route.query.orgId,
      //     orgName: this.$route.query.orgName,
      //     equipType: this.$route.query.detailType,
      //     equipTypeText: this.$route.query.detailTypeText,
      //     equipOrder: this.$route.query.tnYwpc,
      //     view: this.disabled
      //   }
      // })
    },
    // 事件 - 删除按钮点击
    _ButtonDeleteClick () {
      if (this.selection.length) {
        this.$confirm('是否删除所选数据？').then(() => {

        }).catch(err => { })
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    },
    // 事件 - 表格勾选
    _DataGridSelection (selection) {
      this.selection = selection
    },
    // 事件 - 表格双击 
    _DataGridDblClick (row) {
      
    },
  },
}
</script>
