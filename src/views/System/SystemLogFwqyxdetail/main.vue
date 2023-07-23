<template>
  <CustomView :location="[{ text: '日志详情' }]">
    <div class="g-content">
      Ip: {{this.content.tcIp}} <br/>
      端口：{{this.content.tcPort}} <br/>
      测试时间：{{cssj}} <br/>
      服务器运行情况表ID：{{this.content.tnFwqyxqkid}} <br/>
      类型：{{lx}} <br/>
      是否连通：{{sflt}} <br/>
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
      this.tnFwqyxqkid = this.$route.query.id
      this.getFwqyxDetail()
    },
    async getFwqyxDetail() {
      const result =  await Model.getFwqyxDetail(this.tnFwqyxqkid)
      if(result.data) {
        this.content = result.data
      }
    }
  },
  computed: {
    cssj() {
      return Moment(this.content.tdCssj).format('YYYY-MM-DD HH:mm:ss')
    },
    sflt() {
      if(this.content.tnSflt === 1){
        return '是'
      }else{
        return '否'
      }
    },
    lx() {  
      if(this.content.tnLx === 1){
        return 'SLB'
      }else if(this.content.tnLx === 2){
        return 'PC后台服务'
      }else if(this.content.tnLx === 3){
        return 'PC后台nginx'
      }else if(this.content.tnLx === 4){
        return 'APP后台服务'
      }else if(this.content.tnLx === 5){
        return 'APP后台服务nginx'
      }else{
        return 'APP-PC后台服务'
      }
    }
  }
}
</script>
