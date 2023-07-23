<template>
  <CustomView>
    <DataGrid :list="list" @dblclick="_DataGridDblClick" />
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
  name: 'ChinapostSelfList',
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
    $init (options) {
      this.getList()
    },
    _DataGridDblClick (row) {
      this.$router.push({
        path: '/chinapost/self/list/detail',
        query: {
          orgName: row.tcDwmc,
          year: row.tcNd,
          tnNzkpzid: row.tnNzkpzid,
          tnTjzt: row.tnTjzt,
          isZp: row.tnZpzdf ? 1 : 0,
          isDone: (row.tnZpzdf !== undefined)?true:false
        }
      })
    },
    async getList() {
      const result = await Model.getList({
        isQuery: 1,
        cdId: '0004090201',
        requestData: {}
      })
      if(result.data && result.data.length !==0) {
        this.list = result.data
        for(let i in this.list) {
          if(this.list[i].tnTjzt === 0) {
            this.list[i].tnTjztmc = '未提交'
          } else {
            this.list[i].tnTjztmc = '已提交'
          }
        }
      } else {
        this.$message({
          message: '暂无数据，请在日常工作登记页面进行相应年度登记',
          duration: 2500,
          type: 'warning',
          showClose: true,
          customClass: "middle",
          onClose: () => {
            this.$router.push({
              path: '/chinapost/work/checkin'
            })
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
