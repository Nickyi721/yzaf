import Model from '@commons/model.js'
import Config from '@commons/config.js'

import Grid from './components/Grid.js'
import Filter from './components/Filter.js'

export default {
  Grid,
  Filter,
  page: {
    data () {
      return {
        pageTotal: 0,
        pageRows: 20,
        pageNum: 1
      }
    }
  },
  // 初始化
  init: {
    data () {
      return {
        params: {}
      }
    },
    methods: {
      async $getDict () {
        const result = await Model.getDictData(this.dict)
        this.$init && this.$init(result.data || {})
      }
    },
    created () {
      this.params = { ...this.$route.query }
      if (this.dict && this.dict.length) {
        this.$getDict()
      } else {
        this.$init && this.$init()
      }
    },
  },
  dict: {
    methods: {
      async $getOptions(dicts) {
        const result = await Model.getDictData(dicts)
        return (result && result.data) ? result.data : {}
      },
    },
  },
  report: {
    methods: {
      createReportUrl (url) {
        return Config.report + url
      },
    },
  }
}