<template>
  <ComposeQuery :config="queryConfig" :list="list" @control="controlHandle" @query="queryHandle"/>
</template>

<script>
import queryConfig from './config'

export default {
  data () {
    return {
      queryConfig: queryConfig,
      list: []
    }
  },
  methods: {
    queryHandle (bindData) {

    },
    controlHandle (type, payload) {

    }
  },
  created () {
    this.list = [
      {
        'orgName': '广东省分公司',
        'reportName': '默认报表A',
        'count1': 'XXX',
        'count2': 'XXX',
        'count3': 'XXX',
        'count4': 'XXX',
        'count5': 'XXX',
        'countN': 'XXX',
      },
      {
        'orgName': '湖南省分公司',
        'reportName': '自定义报表A',
        'count1': 'XXX',
        'count2': 'XXX',
        'count3': 'XXX',
        'count4': 'XXX',
        'count5': 'XXX',
        'countN': 'XXX',
      },
      {
        'orgName': '广东省分公司',
        'reportName': '默认报表A',
        'count1': 'XXX',
        'count2': 'XXX',
        'count3': 'XXX',
        'count4': 'XXX',
        'count5': 'XXX',
        'countN': 'XXX',
      },
      {
        'orgName': '湖南省分公司',
        'reportName': '自定义报表A',
        'count1': 'XXX',
        'count2': 'XXX',
        'count3': 'XXX',
        'count4': 'XXX',
        'count5': 'XXX',
        'countN': 'XXX',
      },
      {
        'orgName': '广东省分公司',
        'reportName': '默认报表A',
        'count1': 'XXX',
        'count2': 'XXX',
        'count3': 'XXX',
        'count4': 'XXX',
        'count5': 'XXX',
        'countN': 'XXX',
      },
      {
        'orgName': '湖南省分公司',
        'reportName': '自定义报表A',
        'count1': 'XXX',
        'count2': 'XXX',
        'count3': 'XXX',
        'count4': 'XXX',
        'count5': 'XXX',
        'countN': 'XXX',
      },
    ]
  }
}
</script>
