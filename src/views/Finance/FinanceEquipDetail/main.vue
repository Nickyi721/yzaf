<template>
  <CustomView :location="[{ text: type==='add' ? '新增设施信息' : '设施信息详情' }]">
    <CustomTitle>{{orgName + ' - ' + equipTypeText}}</CustomTitle>
    <DynamicForm ref="dynamicForm" :config="config" :content="content" :fileObj="fileObjC" @commit="_FormCommit" :isSaveVisible='isSaveVisible'/>
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
      fileObjC: {},
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

      this.getEquipConfig()
      this.type === 'update' && this.getEquipData()
    },
    _FormCommit (data, fileObj) {
      this.saveEquipData(data, fileObj)
    },
    // 获取配置
    async getEquipConfig () {
      let result = null
      if (this.$route.query.type === 'update') {
        result = await Model.getEquipConfig({
          tnDllx: 0,
          tcXxxlx: this.$route.query.equipType
        })
      }
      else{
        result = await Model.getEquipConfigAdd({
          tnDllx: 0,
          tcXxxlx: this.$route.query.equipType
        })
      }
      if (result.data) {
        this.config = result.data
      }
    },
    // 获取设备信息
    async getEquipData () {
      const result = await Model.getEquipData({
        tnDllx: 0,
        tcXxxlx: this.$route.query.equipType,
        tcSsdwdm: this.$route.query.orgId,
        tnYwpc: parseInt(this.$route.query.equipOrder, 10)
      })
      if (result.data) {
        const content = {}
        this.isSaveVisible = result.data.tnSfjm
        result.data.dataList.forEach(item => {
          if (typeof item.tcZfclxsj !== 'undefined') {
            content[item.tnAfabszid.toString()] = item.tcZfclxsj
          }
          if (typeof item.tnSzzxsj !== 'undefined') {
            content[item.tnAfabszid.toString()] = item.tnSzzxsj
          }
          if (typeof item.tnFdxsj !== 'undefined') {
            content[item.tnAfabszid.toString()] = item.tnFdxsj
          }
          if(item.xtFjList !== undefined && item.xtFjList.length !== 0) {
            item.xtFjList.forEach(xtFj => {
              xtFj.name = xtFj.tcYwjmc
            })
            this.fileObjC[item.tnAfabszid.toString()] = item.xtFjList
          }
        })
        this.content = content
        this.equipData = result.data.dataList
      }
    },
    // 保存数据
    async saveEquipData (data, fileObj) {
      data.forEach(item => {
        // 文件列表赋值
        if(item.tnAfabszid.toString() in fileObj) {
          item.fjList = fileObj[item.tnAfabszid.toString()]
        }
      })
      const list = data.filter(item => item)
      if (this.$route.query.type === 'update') {
        list.forEach(item => {
          const temp = this.equipData.filter(equip => equip.tnAfabszid === item.tnAfabszid)
          if (temp[0]) {
            item.tnAfabxxid = temp[0].tnAfabxxid
            item.tcCjrmc = temp[0].tcCjrmc
            item.tcCjrzh = temp[0].tcCjrzh
            item.tdCjsj = temp[0].tdCjsj
          } else {
            item.tnAfabxxid = 0
          }
        })
      }
      const result = await Model.saveEquipData({
        tnDllx: 0,
        tcXxxlx: this.$route.query.equipType,
        tcSsdwdm: this.$route.query.orgId,
        tcSsdwmc: this.$route.query.orgName,
        tnDyywpc: this.$route.query.tnDyywpc,
        tnYwpc: this.$route.query.equipOrder,
        zzsbList: list
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
    },
    _ButtonAddClick () {
      this.$router.push({
        path: '/finance/equip/detail/sec',
        query: {
          type: 'add',
          orgId: this.$route.query.orgId,
          orgName: this.$route.query.orgName,
          equipType: this.detailType,
        }
      })
    },
    _ButtonDeleteClick () {
      if (this.selection.length) {
        this.$confirm('是否删除所选数据？').then(() => {
          this.deleteDetailData(this.selection.filter(item => item.tnYwpc).map(item => item.tnYwpc))
        })
      } else {
        this.$msgbox({
          message: '请选择数据',
          type: 'warning'
        })
      }
    }
  }
}
</script>
