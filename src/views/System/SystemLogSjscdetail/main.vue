<template>
  <CustomView :location="[{ text: '日志详情' }]">
    <div class="g-content">
      数据审查表ID：{{this.content.tnSjscid}} <br/>
      业务功能编码：{{this.content.tcYwgnbm}} <br/>
      业务功能名称：{{this.content.tcYwgnmc}} <br/>
      业务表名称: {{this.content.tcYwbmc}} <br/>
      业务ID： {{this.content.tnYwid}} <br/>
      异常原因编码：{{this.content.tcYcyybm}} <br/>
      异常原因：{{this.content.tcYcyy}} <br/>
      是否解决：{{sfjj}} <br/>
      单位编码：{{this.content.tcDwbm}} <br/>
      单位名称：{{this.content.tcDwmc}} <br/>
      创建人账号：{{this.content.tcCjrzh}} <br/>
      创建人名称：{{this.content.tcCjrmc}} <br/>
      创建时间：{{cjsj}} <br/>
    </div>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import Moment from 'moment'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      content: ''
    }
  },
  methods: {
    $init () {
      this.tnSjscid = this.$route.query.id
      this.getSjscDetail()
    },
    async getSjscDetail() {
      const result =  await Model.getSjscDetail(this.tnSjscid)
      if(result.data) {
        this.content = result.data
      }
    }
  },
  computed: {
    cjsj() {
      return Moment(this.content.tdCjsj).format('YYYY-MM-DD HH:mm:ss')
    },
    sfjj() {
      if(this.content.tnSfjj === 0){
        return '否'
      }else{
        return '是'
      }
    }
  }
}
</script>
