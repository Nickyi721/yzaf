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
        'infoTitle': '某某案件通报',
        'infoType': '私拆案件',
        'receiveOrg': '湖南省分公司',
        'infoStatus': '初报',
        'sendDate': '2017-09-12',
        'sendOrg': '长沙市分公司',
      },
      {
        'infoTitle': '某某案件通报',
        'infoType': '私拆案件',
        'receiveOrg': '湖南省分公司',
        'infoStatus': '续报',
        'sendDate': '2017-09-12',
        'sendOrg': '长沙市分公司',
      },
      {
        'infoTitle': '某某案件通报',
        'infoType': '私拆案件',
        'receiveOrg': '湖南省分公司',
        'infoStatus': '完结',
        'sendDate': '2017-09-12',
        'sendOrg': '长沙市分公司',
      },
    ]
  }
}
</script>
