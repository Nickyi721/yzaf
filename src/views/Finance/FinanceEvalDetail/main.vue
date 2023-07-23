<template>
  <CustomView :location="[{ text: '金融安全评估：' + $route.query.tcXxxlxmc }]">
    <CustomTitle slot="top" block>{{$route.query.orgName}}</CustomTitle>
    <div class="eval">
      <InfoForm :config="config.BasicInfoList" :isDisabled="editControl" :content="info" ref="infoForm"/>
      <EvalForm :config="config.EvaContentList" :isDisabled="editControl" :content="content" ref="evalForm"/>
    </div>
    <CustomControlBar slot="bottom" v-if="!editControl">
      <el-button type="primary" size="mini" v-if='isSaveVisible' @click="_ButtonSaveClick">保存</el-button>
    </CustomControlBar>
  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import InfoForm from './components/InfoForm/main.vue'
import EvalForm from './components/EvalForm/main.vue'
import { parse } from 'path';
import { log } from 'util';

export default {
  components: {
    InfoForm,
    EvalForm,
  },
  mixins: [
    Mixin.init
  ],
  data () {
    return {
      config: {},
      info: {},
      content: {},
      editControl: false,
      isSaveVisible: true,
    }
  },
  methods: {
    async $init (options) {
      this.editControl = false
      if (this.$route.query.type === 'update') {
        if(this.$route.query.tcPgrid != JSON.parse(window.sessionStorage.user).tnYhid) {
          this.editControl = true
        }
        if(this.$route.query.tnPgztid === 1 || this.$route.query.tnPgztid === 3) {
          this.editControl = true
        }
        if(this.$route.query.pgsjbzw === 0) {
          this.editControl = true
        }
        await this.getEvalData()
      } else {
        this.editControl = false
      }
      await this.getEvalConfig()
    },
    async getEvalConfig () {
      let result = null
      if(this.$route.query.type === 'update'){
        if(this.$route.query.sfYjpg === 0) {
          result = await Model.getEvalConfigAdd({
            isQuery: 1,
            requestData: {
              tcPglx: this.$route.query.formType,
              tcDwdm: this.$route.query.orgCode
            }
          })
        } else {
          if(this.$route.query.tnSfjm) {
            result = await Model.getEvalConfigAdd({
              isQuery: 1,
              requestData: {
                tcPglx: this.$route.query.formType,
                tcDwdm: this.$route.query.orgCode
              }
            })
          } else {
            result = await Model.getEvalConfig({
              isQuery: 1,
              requestData: {
                tcPglx: this.$route.query.formType,
                tcDwdm: this.$route.query.orgCode
              }
            })
          }
        }
      }else{
        result = await Model.getEvalConfigAdd({
          isQuery: 1,
          requestData: {
            tcPglx: this.$route.query.formType,
            tcDwdm: this.$route.query.orgCode
          }
        })
      }
      
      if (result.data) {
        this.config = result.data
        if (this.$route.query.type === 'add') {
          const info = result.data.JraqAfabxxList
          info.forEach(item => {
            let value
            if (typeof item.tnSzzxsj !== 'undefined') {
              value = item.tnSzzxsj
            }
            if (typeof item.tcFdxsj !== 'undefined') {
              value = item.tcFdxsj
            }
            if (typeof item.tcZfclxsj !== 'undefined') {
              value = item.tcZfclxsj
            }
            this.$set(this.info, item.tnPgjbxxbid, value)
          })
        }
      }
    },
    async getEvalData () {
      const result = await Model.getEvalData({
        tcPglx: this.$route.query.formType,
        tnPgnrzbid: this.$route.query.evalId
      })
      if (result.data) {
        // 2019年7月30日需求：评估完成、审核未通过、正在评估的记录可修改并且不加密
        // if(this.$route.query.sfYjpg === 1) {
        //   this.isSaveVisible = result.data.tnSfjm
        //   this.editControl = !(result.data.tnSfjm)
        // }
        const info = result.data.BasicInfoList
        info.forEach(item => {
          if (typeof item.tnSzzxsj !== 'undefined') {
            this.$set(this.info, item.tnPgjbxxbid, item.tnSzzxsj)
          } else if (typeof item.tcZfclxsj !== 'undefined') {
            this.$set(this.info, item.tnPgjbxxbid, item.tcZfclxsj)
          } else {
            this.$set(this.info, item.tnPgjbxxbid, item.tcFdxsj)
          }
        })
        const content = result.data.EvaContentList
        content.forEach(item => {
          this.$set(this.content, item.tnPgnrszbid, item.tcYysjxid)
        })
      }
    },
    _ButtonSaveClick () {
      this.$refs.infoForm.$refs.form.validate((valid, obj) => {
        if (valid) {
          const info = this.$refs.infoForm.formData
          const BasicInfoList = this.config.BasicInfoList.map(item => {
            let value = info[item.tnPgjbxxbid]
            if (item.tnXxxsjlx === 0) {
              value = parseInt(value)
            }
            if (item.tnXxxsjlx === 2) {
              value = parseFloat(value).toFixed(2)
            }
            if (item.tnXxxlrfs === 3) {
              value = value.join(',')
            }
            return {
              tnPgjbxxbid: item.tnPgjbxxbid,
              jbxxz: value,
              tnSjlx: item.tnXxxsjlx,
            }
          // 原来的过滤条件
          // }).filter(item => typeof item.jbxxz !== 'undefined' && !isNaN(item.jbxxz))
          }).filter(item => {
            if(item.tnSjlx !== 1) {
              return typeof item.jbxxz !== 'undefined' && item.jbxxz !== null && !isNaN(item.jbxxz)
            } else {
              return typeof item.jbxxz !== 'undefined' && item.jbxxz !== null
            }
          })

          const content = this.$refs.evalForm.formData
          const EvaContentList = Object.keys(content).filter(key => {
            if (!(content[key] instanceof Array)) {
              return true
            } else {
              return content[key].length
            }
          }).map(key => ({
            tnPgnrszbid: parseInt(key, 10),
            tcYysjxid: (content[key] instanceof Array) ? content[key].join(',') : content[key]
          }))
          .filter(item => item.tcYysjxid)
          
          this.saveEvalData(BasicInfoList, EvaContentList)
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    async saveEvalData(BasicInfoList, EvaContentList) {
      const data = {
        tnGzzBzw: parseInt(this.$route.query.isGroup),
        tcDwdm: this.$route.query.orgCode,
        tcDwmc: this.$route.query.orgName,
        // tnGzzBzw: 1,
        tnDllx: 0,
        tcXxxlx: this.$route.query.formType,
        BasicInfoList,
        EvaContentList
      }
      this.$route.query.type === 'update' && (data.tnPgnrzbid = parseInt(this.$route.query.evalId, 10))
      const result = await Model.saveEvalData(data)
      if (result.state === '1') {
        this.$message({
          message: '成功保存评估数据',
          duration: 1000,
          customClass: 'middle',
          onClose: () => {
            // this.$router.push({
            //   path:'/finance/eval/form',
            //   query:{
            //     orgCode: this.$route.query.orgCode,
            //     orgName: this.$route.query.orgName,
            //     tcPgrid: this.$route.query.tcPgrid || JSON.parse(window.sessionStorage.user).tnYhid,
            //     tnPgztid: this.$route.query.tnPgztid,
            //     evalId: result.data.tnPgnrzbid,
            //     isGroup: this.$route.query.isGroup
            //   } 
            // })
            // 页面跳转方式 修改
            window.sessionStorage.tnPgnrzbid = result.data.tnPgnrzbid;
            this.$router.go(-1)
          }
        })
      }
    }
  },
  
}
</script>

<style lang="scss" scoped>
  .eval{
    height: 100%;
    overflow-y: auto;
    min-width: 1000px;
    padding: 10px 20px 40px 20px;
  }
</style>
