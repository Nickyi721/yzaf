<template>
  <CustomView :location="[{ text: type==='add' ? '新增设备信息' : '检查详情' }]">
    <CustomTitle>{{orgName + ' - ' + equipTypeText}}</CustomTitle>
    <DynamicForm ref="dynamicForm" :config="config" :content="content" @commit="_FormCommit"  :isSaveVisible='isSaveVisible'/>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'

import DynamicForm from './components/DynamicForm.vue'

export default {
  mixins: [
    Mixin.init,
  ],
  components: {
    DynamicForm,
  },
  data () {
    return {
      config: [],
      content: {},
      equipData: [],
      hasDetailData: false,

      detailList: [],
      detailConfig: [],

      selection: [],
      isSaveVisible: true
    }
  },
  methods: {
    $init (options) {
      this.type = this.$route.query.type
      this.equipType = this.$route.query.equipType
      this.equipTypeText = this.$route.query.equipTypeText
      this.orgName = this.$route.query.orgName
      //console.log(this.$route.query.orgName,'main')
      this.getEquipConfig()
      this.type === 'update' &&this.getEquipData()
    },
    _FormCommit (data) {
      this.saveEquipData(data)
      //console.log(data,'main')
    },
    // 获取配置
    async getEquipConfig () {
      const result = await Model.getEquipConfig({
        tnDllx: 0,
        tcXxxlx: this.$route.query.equipType
      })
      if (result.data) {
        this.config = result.data
      }
    },
    // 获取设备信息
    async getEquipData () {
      //console.log("进了")
      const result = await Model.getEquipData({
        tnDllx: 0,
        tcXxxlx: this.$route.query.equipType,
        tcSsdwdm: this.$route.query.orgId,
        tnYwpc: parseInt(this.$route.query.equipOrder, 10)
      })
      if (result.data) {
        //console.log(this.$route.query.equipOrder,'this.$route.query.equipOrder')
       //console.log(result.data,'result.data')
        const content = {}
        this.isSaveVisible = result.data.tnSfjm
        result.data.forEach(item => {
          if (typeof item.tcZfclxsj !== 'undefined') {
            content[item.tnRcxjjbxxszid.toString()] = item.tcZfclxsj
            //console.log(item.tcZfclxsj,'item.tcZfclxsj')
            //console.log(content,'content')
            
          }
          if (typeof item.tnSzzxsj !== 'undefined') {
            content[item.tnRcxjjbxxszid.toString()] = item.tnSzzxsj
             //console.log(item.tnSzzxsj,'item.tnSzzxsj')
          }
          if (typeof item.tnFdxsj !== 'undefined') {
            content[item.tnRcxjjbxxszid.toString()] = item.tnFdxsj
             //console.log(item.tnFdxsj,'item.tnFdxsj')
          }
        })
        this.content = content
        this.equipData = result.data
        // console.log('this.content', this.content)
        // console.log('this.equipData', this.equipData)
      }
    },
    // 保存数据
    async saveEquipData (data) {
      //console.log(this.$route.query.tnWxzt,'this.$route.query.tnWxzt')
      if(this.$route.query.tnWxzt==2){
        this.$msgbox({
          message: '请检查维修状态，正常状态不能继续保存！',
          type: 'warning'
        })
      }else{
          const list = data.filter(item => item)
          if (this.$route.query.type === 'update') {
            list.forEach(item => {
              const temp = this.equipData.filter(equip => equip.tnRcxjjbxxszid === item.tnRcxjjbxxszid)
              if (temp[0]) {
                item.tnRcxjjbxxid = temp[0].tnRcxjjbxxid
                item.tcCjrmc = temp[0].tcCjrmc
                item.tcCjrzh = temp[0].tcCjrzh
                item.tdCjsj = temp[0].tdCjsj
              } else {
                item.tnRcxjjbxxid = 0
              }
            })
          }
          const result = await Model.saveEquipData({
            tnDllx: 0,
            tcXxxlx: this.$route.query.equipType,
            tcSsdwdm: this.$route.query.orgId,
            tcSsdwmc: this.$route.query.orgName,
            tnDyywpc: this.$route.query.tnDyywpc||'',
            tnYwpc: this.$route.query.equipOrder,
            tcSbid:this.$route.query.tcSbid,
            xjjbxxList: list
          })
          if (result.state === '1') {
            this.$message({
              message: this.$route.query.type === 'add' ? '成功添加设施信息' : '成功修改设施信息',
              duration: 1000,
              onClose: () => {
                this.$router.go(-1)
              }
            })
          }
      }
    },
    // _ButtonAddClick () {
    //   this.$router.push({
    //     path: '/firecontrol/equip/detail/sec',
    //     query: {
    //       type: 'add',
    //       orgId: this.$route.query.orgId,
    //       orgName: this.$route.query.orgName,
    //       equipType: this.detailType,
    //     }
    //   })
    // },
    // _ButtonDeleteClick () {
    //   if (this.selection.length) {
    //     this.$confirm('是否删除所选数据？').then(() => {
    //       this.deleteDetailData(this.selection.filter(item => item.tnYwpc).map(item => item.tnYwpc))
    //     })
    //   } else {
    //     this.$msgbox({
    //       message: '请选择数据',
    //       type: 'warning'
    //     })
    //   }
    // }
  }
}
</script>
