<template>
  <CustomView title="检查表详情">
    <ComposeQuery :config="config" :list="list" @control="controlHandle" @query="queryHandle">
      <div class="note">
        <div>备注：</div>
        <p>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx</p>
      </div>
    </ComposeQuery>
  </CustomView>
</template>

<style lang="scss" scoped>
.note{
  padding: 16px 0;
  font-size: 14px;
  color: #f60;
  p{
    color: #666;
  }
}
</style>

<script>
import config from './config'

export default {
  data () {
    return {
      config,
      list: {}
    }
  },
  methods: {
    controlHandle (type, payload) {

    },
    queryHandle (type, payload) {

    }
  },
  created () {
    this.list = [
      {
        'checkType': '现场检查',
        'checkContent': 'GPS系统运行不正常 ',
        'checkResult': '×',
        'attachment': 'xxx.jpg',
      },
      {
        'checkType': '现场检查',
        'checkContent': 'GPS系统运行不正常 ',
        'checkResult': '×',
        'attachment': 'xxx.jpg',
      },
      {
        'checkType': '现场检查',
        'checkContent': 'GPS系统运行不正常 ',
        'checkResult': '√',
        'attachment': 'xxx.jpg',
      },

    ]
  }
}
</script>
