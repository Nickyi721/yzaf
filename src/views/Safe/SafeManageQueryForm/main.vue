<template>
  <CustomView>
    <!-- 数据表格 -->
    <DataGrid :list="list" @dblclick="_DataGridDblclick">
    </DataGrid>
  </CustomView>
</template>

<script>
import Moment from 'moment'

// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

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
      list: [{},{},{}],
    }
  },
  methods: {
    $init () {
      
    },
    // 事件-表格双击
    _DataGridDblclick(row) {
      this.$router.push({ path: '/safe/manage/query/form/detail' })
    },
    // 加载列表
    async getDataList () {
      
    }
  },
}
</script>
