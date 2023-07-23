<template>
  <CustomView  :location="[{ text: type==='add' ? '新增设施信息' : '设施信息详情' }]">
    <!-- 机构树 -->
    <!-- <CommonOrgTree ref="commonTree" slot="side" fnCode="000405" @click="_OrgTreeClick" @loaded="_OrgTreeLoaded"/> -->
    <div>故障上报详情</div>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
// import Model from './model.js'

// 页面组件

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  components: {
  
  },
  data () {
    return {
      // 数据列表
      list: [],
    }
  },
  methods: {
    $init(){
      
    },
    // 事件-点击树结点
    _OrgTreeClick(node) {      
      
    },
    // 事件-机构树加载完成
    _OrgTreeLoaded(node) {
      
    },
  },
}
</script>
