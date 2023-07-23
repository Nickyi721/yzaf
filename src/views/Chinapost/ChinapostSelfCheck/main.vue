<template>
  <CustomView>
    <DataGrid :list="list" @dblclick="_DataGridDblClick"/>
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
  name: 'ChinapostSelfCheck',
  mixins: [
    Mixin.init, 
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      list: [],
      isFirstEnter: true
    }
  },
  methods: {
    $init(options) {
      this.getList()
    },
    _DataGridDblClick (row) {
      this.$router.push({ 
        path: '/chinapost/self/check/detail',
        query: {
          orgName: row.tcDwmc,
          year: row.tcNd,
          tnNzkpzid: row.tnNzkpzid,
          tnShzt: row.tnShzt
        }   
      })
    },
    async getList() {
      const result = await Model.getList({
        isQuery: 1,
        cdId: '004090202',
        requestData: {}
      })
      if(result.data) {
        this.list = result.data
        this.list.forEach((item) => {
          if(item.tnShzt === 0) {
            item.tnShztmc = '未审核'
          } else {
            item.tnShztmc = '已审核'
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
