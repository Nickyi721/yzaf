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
        'dataCode': '2213',
        'year': '2018',
        'dataContent': '离行式自助设备加钞间防盗门钥匙无由业务主管部门分别保管，备用钥匙无由上一级业务主管部门负责人封存保管',
        'isLastLevel': '-10',
      }
    ]
  }
}
</script>
