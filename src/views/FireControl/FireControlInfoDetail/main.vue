<template>
  <!-- <CustomView :location="[{ text: type ==='add' ? '消防信息录入' : '消防信息详情' }]"> -->
  <CustomView :location="[{ text: _TYpeMethod() }]">
    <CustomTitle>{{orgName + ' - ' + equipTypeText}}</CustomTitle>
    <DynamicForm ref="dynamicForm" :disabled="disabled" :curOrg="$route.query.orgId" :curRegionObj="curRegionObj" :curPersonObj="curPersonObj" :fileObj="fileObjC" :config="config" :content="content" @commit="_FormCommit" />
    
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
    DynamicForm
  },
  data() {
    return {
      type: '',
      config: [],
      content: {},
      fileObjC: {},
      curRegionObj: {},
      curPersonObj: {},
      disabled: false
    }
  },
  methods: {
    $init (options) {
      this.type = this.$route.query.type
      this.equipType = this.$route.query.equipType
      this.equipTypeText = this.$route.query.equipTypeText
      this.orgName = this.$route.query.orgName
      this.disabled = (this.$route.query.view === 'false' || this.$route.query.view === false)?false:true
      this.getEquipConfig()
    },
    _TYpeMethod() {
      if(this.type === 'add') {
        return '消防信息录入'
      } else if(this.type === 'addMx') {
        return '明细信息录入'
      } else if(this.type === 'update') {
        return '消防信息详情'
      } else {
        return '明细信息详情'
      }
    },
    // 获取配置
    async getEquipConfig () {
      const result = await Model.getEquipConfig({
        tnDllx: 0,
        tcXxxlx: this.$route.query.equipType
      })
      if (result.data) {
        this.config = result.data
        this.config = this.config.filter(item => item.tnXxxlrfs !== 7)
        if(this.type === 'update' || this.type === 'updateMx') {
          this.getEquipData()
        }
      }
    },
    // 获取数据
    async getEquipData () {
      const result = await Model.getEquipData({
        tnDllx: 0,
        tcXxxlx: this.$route.query.equipType,
        tcSsdwdm: this.$route.query.orgId,
        tnYwpc: this.$route.query.tnYwpc ? parseInt(this.$route.query.tnYwpc, 10) : parseInt(this.$route.query.equipOrder, 10)
      })
      if (result.data) {
        const content = {}
        result.data.forEach(item => {
          if (typeof item.tcZfclxsj !== 'undefined') {
            content[item.tnXfaqjbxxszid.toString()] = item.tcZfclxsj
          }
          if (typeof item.tnSzzxsj !== 'undefined') {
            content[item.tnXfaqjbxxszid.toString()] = item.tnSzzxsj
          }
          if (typeof item.tnFdxsj !== 'undefined') {
            content[item.tnXfaqjbxxszid.toString()] = item.tnFdxsj
          }
          if(item.xtFjList.length !== 0) {
            item.xtFjList.forEach(xtFj => {
              xtFj.name = xtFj.tcYwjmc
            })
            this.fileObjC[item.tnXfaqjbxxszid.toString()] = item.xtFjList

          }
        })
        this.content = content

        this.config.forEach(item => {
          // 人员
          if(item.tnXxxlrfs === 8) {
            this.curPersonObj[item.tnXfaqjbxxszid.toString()] = {}
          }
          // 机构
          if(item.tnXxxlrfs === 9) {
            this.curRegionObj[item.tnXfaqjbxxszid.toString()] = {}
          }
        })
        
        result.data.forEach(item => {
          // 人员
          if(item.tnXfaqjbxxszid.toString() in this.curPersonObj) {
            // this.curPersonObj[item.tnXfaqjbxxszid.toString()].tcYhzh = item.tcSjmc
            this.curPersonObj[item.tnXfaqjbxxszid.toString()].tcYhmc = item.tcSjmc
            
          }
          // 机构
          if(item.tnXfaqjbxxszid.toString() in this.curRegionObj) {
            this.curRegionObj[item.tnXfaqjbxxszid.toString()].name = item.tcSjmc
          }
        })

      }
    },
    _FormCommit (data, fileObj) {
      this.saveEquipData(data, fileObj)
    },
    // 保存数据
    async saveEquipData (data, fileObj) {
      data.forEach(item => {
        item.tcXxxlx = this.$route.query.equipType
        item.tcSsdwdm = this.$route.query.orgId
        item.tcSsdwmc = this.$route.query.orgName
        if(this.type === 'addMx') {
          item.tnDyywpc = parseInt(this.$route.query.equipOrder, 10)
        }
        if(this.type === 'update') {
          item.tnYwpc = parseInt(this.$route.query.equipOrder, 10)
        }
        if(this.type === 'updateMx') {
          item.tnYwpc = parseInt(this.$route.query.tnYwpc, 10)
          item.tnDyywpc = parseInt(this.$route.query.equipOrder, 10)
        }
        
        item.tnDllx = 0
        // 转字符串
        if(item.jbxxz !== null) {
          item.jbxxz = item.jbxxz.toString()
        }
        // 文件列表赋值
        if(item.tnXfaqjbxxszid.toString() in fileObj) {
          item.xtFjList = fileObj[item.tnXfaqjbxxszid.toString()]
        }

        // 给特殊类型的录入方式赋值
        this.config.forEach(con => {
          if(item.tnXfaqjbxxszid === con.tnXfaqjbxxszid) {
            item.tnXxxlrfs = con.tnXxxlrfs
          }
        })
        
      })
      // 过滤掉没填的联动项
      data = data.filter(el => el.jbxxz !== null)

      // 过滤掉没填的联动项
      let dataCopy = []
      data.forEach(el => {
        if(el.jbxxz !== '') {
          dataCopy.push(el)
        } else if(el.tnXxxlrfs === 0 || el.tnXxxlrfs === 6 || el.tnXxxlrfs === 7) {
          dataCopy.push(el)
        }
      })

      const result = await Model.saveEquipData(dataCopy)
      if (result.state === '1') {
        let message = ''
        if(this.type === 'add') {
          message =  '成功添加消防信息'
        } else if(this.type === 'addMx') {
          message =  '成功添加明细信息'
        } else if(this.type === 'update') {
          message =  '成功修改消防信息'
        } else {
          message =  '成功修改明细信息'
        }
        this.$message({
          message: message,
          duration: 1000,
          onClose: () => {
            this.$router.go(-1)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>

