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
        'orgName': '湖南省分公司',
        'hiddenName': '隐患XXXXX',
      }
    ]
  }
}
</script>
