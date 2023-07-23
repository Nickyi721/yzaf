<template>
  <div>
    <el-form ref="form" label-position="top" :model="bindData" :rules="rules" :label-width="labelWidth" class="common-form" :disabled="!isSaveVisible">
      <el-form-item v-for="(item, idx) in config" :key="idx" :label="item.tcXxxmc" :prop="item.tnAfabszid.toString()" v-if="setLinkShow(item, idx)">
        <el-input v-if="item.tnXxxlrfs === 1" v-model="bindData[item.tnAfabszid]" size="mini" :type="item.tnXxxsjlx === 1 ? 'text' : 'number'" :placeholder="'请输入' + item.tcXxxmc" :maxlength="Math.floor(item.tnXxxsjcd/3)"></el-input>
        <el-radio-group v-if="item.tnXxxlrfs === 2" v-model="bindData[item.tnAfabszid]" @change="_OptionChange(item)">
          <el-radio v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-radio>
        </el-radio-group>

        <el-checkbox-group v-if="item.tnXxxlrfs === 3" v-model="bindData[item.tnAfabszid]"  @change="_OptionChange(item)">
          <el-checkbox v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-checkbox>
        </el-checkbox-group>
        <el-select v-if="item.tnXxxlrfs === 4" v-model="bindData[item.tnAfabszid]" :placeholder="'请选择' + item.tcXxxmc" size="mini" :disabled="item.disable" @change="_OptionChange(item)">
          <el-option v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
        <el-date-picker v-if="item.tnXxxlrfs === 5" v-model="bindData[item.tnAfabszid]" size="mini" :placeholder="'请选择' + item.tcXxxmc" value-format="yyyy-MM-dd"></el-date-picker>
        <el-upload v-if="item.tnXxxlrfs === 6"
          class="upload-demo"
          drag
          action='' 
          :file-list="fileObjCopy[item.tnAfabszid.toString()]"
          :http-request="param => _RequestFile(param, item)"
          :on-remove="(file, fileList) => _FileRemove(file, fileList, item)"
          :on-preview="(file) => _FilePreview(file, item)"
          :show-file-list='true'>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">文件大小不超过2MB</div>
        </el-upload>
      </el-form-item>

      <div v-if="['030107','030106'].indexOf($route.query.equipType)>-1">
        <div v-if="$route.query.equipType==='030106'&&$route.query.type === 'update'">
          <el-form-item label="运钞车数量">
            {{vehicleList.length}}
          </el-form-item>
          <el-form-item label="运钞车车型">
            <span class="vehicle-ceil">越野型（{{vehicleList | vehicleListLength('越野型')}}）</span>
            <span class="vehicle-ceil">箱式（{{vehicleList | vehicleListLength('箱式')}}）</span>
            <span class="vehicle-ceil">皮卡（{{vehicleList | vehicleListLength('皮卡')}}）</span>
            <span class="vehicle-ceil">其他（{{vehicleList | vehicleListLength('其他')}}）</span>
          </el-form-item>
        </div>
        <div v-if="$route.query.equipType==='030107'&&$route.query.type === 'update'">
          <el-form-item label="枪支数量">
            {{vehicleList.length}}
          </el-form-item>
          <el-form-item label="在用枪支数量">
            {{vehicleList|vehicleListLength('无')}}
          </el-form-item>
          <el-form-item label="封存枪支数量">
            {{vehicleList|vehicleListLength('有')}}
          </el-form-item>
        </div>
      </div>
      <div class="common-form-control" v-if='isSaveVisible'>
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Model from '../model.js'
import CommonModel from "@commons/model.js";
import Mixin from '@mixins'
import Validator from '@commons/validator.js'

export default {
  mixins: [Mixin.dict],
  props: {
    content: {
      type: Object,
      default: () => { }
    },
    config: {
      type: Array,
      default: () => []
    },
    isSaveVisible: {
      type: Boolean,
      default: () => true
    },
    // 文件列表
    fileObj: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    return {
      bindData: this.content,
      rules: {},
      options: {},
      labelWidth: '',
      vehicleList: [],
      // 文件列表
      fileObjCopy: this.fileObj,
    }
  },
  filters: {
    vehicleListLength (data, type) {
      //  ['越野型', '箱式', '皮卡', '其他']
      let list = []
      data.forEach(item => {
        for (let x in item) {
          if (item[x] === type) {
            list.push(item)
          }
        }
      })
      return list.length
    }
  },
  watch: {
    config: {
      handler () {
        // 设置label宽度
        const name = this.config.map(item => item.tcXxxmc).sort((a, b) => b.length - a.length)
        this.labelWidth = name[0].length * 14 + 'px'

        this.setContent()
        this.processContent()

        this.setOptions()
        this.setRules()
        this.$refs.form.clearValidate()
      },
      deep: true
    },
    content: {
      handler () {
        this.processContent()
      },
      deep: true
    },
    fileObj: {
      handler () {
        this.fileObjCopy = this.fileObj
        this.$forceUpdate()
      },
      deep: true
    }
  },
  created () {
    this.$route.query.type === 'update' && ['030107', '030106'].indexOf(this.$route.query.equipType) > -1 && this.getEquipDetail()
  },
  methods: {
    async getEquipDetail () {
      const result = await Model.getEquipData({
        tnDllx: 0,
        tcXxxlx: this.$route.query.detailType,
        tcSsdwdm: this.$route.query.orgId,
        tnDyywpc: this.$route.query.equipOrder
      })
      if (result.data) {
        this.vehicleList = this.processData(result.data.dataList)
      }
    },
    processData (listData) {
      const data = {}
      listData.forEach(item => {
        data[item.tnYwpc] = data[item.tnYwpc] || []
        data[item.tnYwpc].push(item)
      })
      return Object.keys(data)
        .map(key => data[key])
        .sort((a, b) => b.tnYwpc - a.tnYwpc)
        .map(fields => {
          const data = {}
          fields.forEach(item => {
            let value
            
            if (typeof item.tcZfclxsj !== 'undefined') {
              value = item.tcZfclxsj
            }
            if (typeof item.tnSzzxsj !== 'undefined') {
              value = item.tnSzzxsj
            }
            if (typeof item.tnSzfdsj !== 'undefined') {
              value = item.tnSzfdsj
            }
            
            data[item.tnAfabszid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          return data
        })
    },
    _OptionChange (item) {
      const links = this.config.filter(field => field.tnXxxldxid === item.tnXh)
      links.forEach(field => {
        const linkValues = field.tcXxxldglz.split(',')
        if (linkValues.indexOf(this.bindData[item.tnAfabszid]) < 0) {
          this.$set(this.bindData, field.tnAfabszid, field.tnXxxlrfs === 3 ? [] : null)
        }
      })
    },
    _ButtonSaveClick () {
      this.config.forEach(item => {
        if(item.tnXxxlrfs === 6) {
          if((item.tnAfabszid.toString() in this.fileObjCopy) && this.fileObjCopy[item.tnAfabszid.toString()].length !== 0) {
            delete this.$refs.form.rules[item.tnAfabszid.toString()]
          }
        }
      })
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          const data = JSON.parse(JSON.stringify(Object.keys(this.bindData).map(key => {
            const value = this.bindData[key]
            const id = parseInt(key, 10)
            const itemConfigIdx = this.config.findIndex(item => item.tnAfabszid === id)
            const config = this.config[itemConfigIdx]
            if (config) {
              let valueText = ''
              if (config.tnXxxlrfs === 2 || config.tnXxxlrfs === 4) {
                const options = this.options[config.tcXxxxxxnr].filter(item => item.tcSjubm === value)
                valueText = options.length ? options[0].tcSjnr : ''
              } else if (config.tnXxxlrfs === 3) {
                valueText = this.options[config.tcXxxxxxnr].filter(item => value.findIndex(v => v === item.tcSjubm) >= 0).map(item => item.tcSjnr).join(',')
              }
              let dataValue = value
              if (config.tnXxxsjlx === 0) {
                dataValue = parseInt(value)
              }
              if (config.tnXxxsjlx === 2) {
                dataValue = parseFloat(value)
              }
              return {
                tnAfabszid: id,
                tnXxxsjlx: config.tnXxxsjlx,
                tnXxxlrfs: config.tnXxxlrfs,
                zzsbz: config.tnXxxlrfs === 3 ? dataValue.join(',') : dataValue,
                tcSjmc: valueText
              }
              
            }
          }))).filter(item => item && !!item.zzsbz)
          this.config.forEach(config => {
            if (data.findIndex(item => item.tnAfabszid === config.tnAfabszid) < 0) {
              data.push({
                tnAfabszid: config.tnAfabszid,
                tnXxxsjlx: config.tnXxxsjlx,
                tnXxxlrfs: config.tnXxxlrfs,
                // zzsbz: '',
              })
            }
          })
          this.$emit('commit', data, this.fileObjCopy)
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 文件上传
    _RequestFile(param, item) {
      let fileObjTemp = param.file
      this.file = fileObjTemp
      let form = new FormData()    // FormData 对象
      form.append('file', fileObjTemp) // 文件对象
      form.append('sessionId',window.sessionStorage.sessionId)
      form.append('lylx',0),
      form.append('cdId','0004080101')
      form.append('isQuery', 0)
      form.append('isVideo', 0)
      const isLt2M = param.file.size / 1024 / 1024 < 200;
      if(isLt2M) {
        this.uploadFile(form, fileObjTemp.name, item)
      } else{
        this.$msgbox({
          message: '上传附件大小不能超过 200MB!',
          type: 'warning'
        })
      }
    },
    async uploadFile(data, name, item) {
      const result = await Model.uploadFile(data);
      if (result.state === "1") {
        this.$message({
          message:'上传成功!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
        const wjmc = result.data.split(",")
        let fileObj = {
          tcYwjmc: wjmc[0],
          tcXwjmc: wjmc[1],
          name: wjmc[0]
        }
        if(item.tnAfabszid.toString() in this.fileObjCopy) {
          this.fileObjCopy[item.tnAfabszid.toString()].push(fileObj)
        } else {
          let tempArr = []
          tempArr.push(fileObj)
          this.fileObjCopy[item.tnAfabszid.toString()] = tempArr
        }
      }else{
        this.$message({
          message:'上传失败!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
      }
    },
    // 移除文件
    _FileRemove(file, fileList, item) {
      this.fileObjCopy[item.tnAfabszid.toString()] = this.fileObjCopy[item.tnAfabszid.toString()].filter(el => {
        return el.tcYwjmc != file.name
      })
    },
    // 点击文件-下载
    async _FilePreview(file, item) {
      const result = await CommonModel.downloadFile({
        tcWjm: file.tcXwjmc
      });
      if(result) {
        const content = result
        const blob = new Blob([content])
        const fileName = file.name
        const fileTag = fileName.split(".")[1]
        
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      }
    },
    async setOptions () {
      this.options = await this.$getOptions(this.config.filter(item => item.tcXxxxxxnr).map(item => item.tcXxxxxxnr))
    },
    setRules () {
      this.config.map(item => {
        const rule = []
        if (item.tnXxxsjlx === 1) {
          item.tnXxxlrfs === 1 && rule.push(Validator.length(1, Math.floor(item.tnXxxsjcd / 3)))
        }
        if (item.tnXxxsjlx === 0) {
          rule.push(Validator.isNumber(item.tnXxxsjcd))
        }
        if (item.tnXxxsjlx === 2) {
          rule.push(Validator.isFloat(item.tnXxxsjcd))
        }
        item.tnXxxsfbt && rule.push(Validator.required(`请设置${item.tcXxxmc}`))
        this.rules[item.tnAfabszid.toString()] = rule
      })
    },
    setContent () {
      this.config.forEach(item => {
        if (item.tnXxxlrfs === 3) {
          this.$set(this.content, item.tnAfabszid, this.content[item.tnAfabszid] || [])
        }
      })
    },
    processContent () {
      const content = { ...this.content }
      Object.keys(content).forEach(key => {
        const id = parseInt(key, 10)
        const itemConfigIdx = this.config.findIndex(item => item.tnAfabszid === id)
        if (itemConfigIdx >= 0) {
          const itemConfig = this.config[itemConfigIdx]
          if (itemConfig.tnXxxlrfs === 3) {
            content[key] = typeof content[key] === 'string' ? content[key].split(',') : []
          }
        }
      })
      this.bindData = content
    },
    setLinkShow (item, idx) {
      let show = true
      if (typeof item.tnXxxldxid !== 'undefined' && item.tnXxxldfs === 1) {
        const idx = this.config.findIndex(field => field.tnXh === item.tnXxxldxid)
        const id = this.config[idx].tnAfabszid
        
        show = typeof this.bindData[id.toString()] === 'undefined'
          ? false
          : (item.tcXxxldglz.split(',').indexOf(this.bindData[id.toString()]) >= 0)
      }
      return show
    }
  }
}
</script>
<style lang="scss" scoped>
.vehicle-ceil {
  padding-right: 10px;
}
</style>
