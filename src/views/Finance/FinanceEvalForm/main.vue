<template>
  <CustomView :location="[{ text: '选择评分表' }]">
    <CustomToolbar>
      <span slot="left">{{$route.query.orgName}}——{{column_name}}</span>
    </CustomToolbar>
    
    <DataGrid :list="list" :column_name="column_name" @dblclick="_DataGridDblClick"/>    
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'

import DataGrid from './components/DataGrid/main.vue'

export default {
  mixins: [
    Mixin.init
  ],
  components: {
    DataGrid,
  },
  data () {
    return {
      list: [],
      column_name: '',
      tnPgkf: 0,
      tnPgnrzbid: 0
    }
  },
  methods: {
    $init(options) {
      if(this.$route.query.jumpMode === 'dbclick') {
        this.tnPgnrzbid = parseInt(this.$route.query.evalId, 10)
      }
      if(this.$route.query.jumpMode === 'button') {
        if(window.sessionStorage.tnPgnrzbid === undefined) {
          this.tnPgnrzbid = ''
        } else {
          this.tnPgnrzbid = window.sessionStorage.tnPgnrzbid
        }
      } 
      this.getEvalStatus()
    },
    _DataGridDblClick (row) {
      this.$router.push({ 
        path: '/finance/eval/detail', 
        query: { 
          type: row.tnPgnrzbid ? 'update' : 'add',
          formType: row.tcXxxlx,
          tcXxxlxmc: row.tcXxxlxmc,
          tnPgztid: this.$route.query.tnPgztid,
          tcPgrid: this.$route.query.tcPgrid,
          evalId: row.tnPgnrzbid,
          orgCode: this.$route.query.orgCode, 
          orgName: this.$route.query.orgName, 
          isGroup: this.$route.query.isGroup,
          sfYjpg: row.tnPgztid,
          tnSfjm: row.tnSfjm,
          pgsjbzw: this.$route.query.pgsjbzw
        } 
      })
    },
    async getEvalStatus () {
      const result = await Model.getEvalStatus({
        tcDwbm: this.$route.query.orgCode,
        tnPgnrzbid: this.tnPgnrzbid,
      })
      if(result.data && result.data.length !==0) {
        this.list = result.data
        this.list.forEach(item => {
          if(item.tnPgkf) {
            this.tnPgkf += item.tnPgkf
          }
        })
        this.column_name = '满分：' + 100 + '，' + '评估得分：' + (100 - this.tnPgkf) + '，' + '评估扣分：' + this.tnPgkf
      }
    },
  },
  destroyed() {
    window.sessionStorage.removeItem('tnPgnrzbid')
  }
}
</script>
