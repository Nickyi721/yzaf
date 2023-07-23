<template>
  <div>
    <el-form :disabled="disabled" ref="form" label-position="top" :model="bindData" :rules="rules" :label-width="labelWidth" class="common-form">
      <el-form-item v-for="(item, idx) in config" :key="idx" :label="item.tcXxxmc" :prop="item.tnXfaqjbxxszid.toString()" v-if="setLinkShow(item, idx)">
        <el-upload v-if="item.tnXxxlrfs === 0"
          class="upload-demo"
          drag
          action='' 
          :http-request="(param) => _RequestFile(param, item)"
          :auto-upload="true"
          :file-list="fileObjCopy[item.tnXfaqjbxxszid.toString()]"
          :on-remove="(file, fileList) => _FileRemove(file, fileList, item)"
          :on-preview="(file) => _FilePreview(file, item)"
          :on-error="(err, file, fileList) => _FileErrorHandle(err, file, fileList, item)"
          :before-upload="(file) => _FileBeforeUpload(file, item)"
          accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
          :show-file-list='true'>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2MB</div>
        </el-upload>
        <!-- <CommonFileDownload :list="fileObjCopy[item.tnXfaqjbxxszid.toString()]" :disabled=true></CommonFileDownload> -->
        <el-input v-if="item.tnXxxlrfs === 1" v-model="bindData[item.tnXfaqjbxxszid]" size="mini" :type="item.tnXxxsjlx === 1 ? 'text' : 'number'" :placeholder="'请输入' + item.tcXxxmc" :maxlength="Math.floor(item.tnXxxsjcd/3)"></el-input>
        <el-radio-group v-if="item.tnXxxlrfs === 2" v-model="bindData[item.tnXfaqjbxxszid]" @change="_OptionChange(item)">
          <el-radio v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjubm">{{option.tcSjnr}}</el-radio>
        </el-radio-group>

        <el-checkbox-group v-if="item.tnXxxlrfs === 3" v-model="bindData[item.tnXfaqjbxxszid]"  @change="_OptionChange(item)">
          <el-checkbox v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjnr">{{option.tcSjnr}}</el-checkbox>
        </el-checkbox-group>
        <el-select v-if="item.tnXxxlrfs === 4" v-model="bindData[item.tnXfaqjbxxszid]" :placeholder="'请选择' + item.tcXxxmc" size="mini" :disabled="item.disable" @change="_OptionChange(item)">
          <el-option v-for="option in options[item.tcXxxxxxnr]" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
        <el-date-picker v-if="item.tnXxxlrfs === 5" v-model="bindData[item.tnXfaqjbxxszid]" size="mini" :placeholder="'请选择' + item.tcXxxmc" :picker-options="pickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
        <el-upload v-if="item.tnXxxlrfs === 6" 
          class="upload-demo" 
          action='' 
          :auto-upload="true" 
          :show-file-list="true"
          :file-list="fileObjCopy[item.tnXfaqjbxxszid.toString()]"
          :http-request="param => _RequestFile(param, item)"
          :on-remove="(file, fileList) => _FileRemove(file, fileList, item)"
          :on-preview="(file) => _FilePreview(file, item)"
          :on-error="(err, file, fileList) => _FileErrorHandle(err, file, fileList, item)"
          >
          <el-button size="mini" type="default">上传</el-button>
        </el-upload>
        <el-button v-if="item.tnXxxlrfs === 8" class="common-form-dlg-btn" size="mini" @click="_ButtonItemClick(item)">{{curPerson[item.tnXfaqjbxxszid.toString()] ? curPerson[item.tnXfaqjbxxszid.toString()].tcYhmc : '选择人员'}}</el-button>
        <el-button v-if="item.tnXxxlrfs === 9" class="common-form-dlg-btn" size="mini" @click="_ButtonItemClick(item)">{{curRegion[item.tnXfaqjbxxszid.toString()] ? curRegion[item.tnXfaqjbxxszid.toString()].name : '选择机构'}}</el-button>
      </el-form-item>
      
      <div v-if="!disabled" class="common-form-control">
        <el-button type="primary" size="mini" @click="_ButtonSaveClick">保存</el-button>
      </div>
    </el-form>
    <!-- 选择案发单位 -->
    <CustomDialog title=" 选择所属机构" :visible="orgDlgVisble" @close="_OrgDlgCloseHandle">
      <CommonOrgTree ref="orgTree" check-strictly content fnCode="000408" module="special" style="height: 400px" @click="_OrgTreeRegionClick" />
      <div class="filter-btn" style="text-align:right;padding: 10px;">
        <el-button type="primary" size="mini" @click="_DlgButtonClick">确定</el-button>
      </div>
    </CustomDialog>

    <!-- 选择用户 -->
    <CustomDialog title="选择用户" width="90%" top="40px" :visible="userDlgVisible" @close="_UserDlgCloseHandle">
      <ChooseUser :multi="dlgMulti" @choose="_ChooseUserChange" />
    </CustomDialog>
  </div>
</template>

<script>
import Model from '../model.js'
import CommonModel from "@commons/model.js";
import Mixin from '@mixins'
import Validator from '@commons/validator.js'
import Moment from 'moment'

import ChooseUser from './ChooseUser.vue'

export default {
  mixins: [Mixin.dict, Mixin.init],
  components: {
    ChooseUser,
  },
  props: {
    content: {
      type: Object,
      default: () => { }
    },
    config: {
      type: Array,
      default: () => []
    },
    // 文件列表
    fileObj: {
      type: Object,
      default: () => {}
    },
    // 机构
    curRegionObj: {
      type: Object,
      default: () => {}
    },
    // 人员
    curPersonObj: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      bindData: this.content,
      rules: {},
      options: {},
      labelWidth: '',
      // vehicleList: [],
      orgDlgVisble: false,
      userDlgVisible: false,
      // 多选用户模式
      dlgMulti: false,
      // 机构
      curRegion: this.curRegionObj,
      // 人员
      curPerson: this.curPersonObj,
      // 当前选项卡
      curItem: {},
      // 文件列表
      fileObjCopy: this.fileObj,
      staff: [],
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
          return time.getTime() > Date.now();
        }
      },
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
  methods: {
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
            
            data[item.tnXfaqjbxxszid] = item.tcSjmc || value
          })
          data.tnYwpc = fields[0].tnYwpc
          return data
        })
    },
    _OptionChange (item) {
      const links = this.config.filter(field => field.tnXxxldxid === item.tnXh)
      links.forEach(field => {
        const linkValues = field.tcXxxldglz.split(',')
        if (linkValues.indexOf(this.bindData[item.tnXfaqjbxxszid]) < 0) {
          this.$set(this.bindData, field.tnXfaqjbxxszid, field.tnXxxlrfs === 3 ? [] : null)
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
      if(item.tnXxxlrfs === 0) {
        const isJPG = param.file.type === 'image/jpeg';
        const isPNG = param.file.type === 'image/png';
        const isLt2M = param.file.size / 1024 / 1024 < 2;
        if (!isJPG && !isPNG) {
          this.$msgbox({
            message: '上传必须是图片,并且为JPG/PNG 格式!',
            type: 'warning'
          })
          return
        }
        if (!isLt2M) {
          this.$msgbox({
            message: '上传图片大小不能超过 2MB!',
            type: 'warning'
          })
        }
        if((isJPG || isPNG) && isLt2M) {
          this.uploadFile(form, fileObjTemp.name, item)
        }
      } else {
        const isLt2M = param.file.size / 1024 / 1024 < 200;
        if(isLt2M) {
          this.uploadFile(form, fileObjTemp.name, item)
        } else{
          this.$msgbox({
            message: '上传附件大小不能超过 200MB!',
            type: 'warning'
          })
        }
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
        if(item.tnXfaqjbxxszid.toString() in this.fileObjCopy) {
          this.fileObjCopy[item.tnXfaqjbxxszid.toString()].push(fileObj)
        } else {
          let tempArr = []
          tempArr.push(fileObj)
          this.fileObjCopy[item.tnXfaqjbxxszid.toString()] = tempArr
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
      this.fileObjCopy[item.tnXfaqjbxxszid.toString()] = this.fileObjCopy[item.tnXfaqjbxxszid.toString()].filter(el => {
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
        // 预览
        // if(fileTag === "png" || fileTag === "jpg"|| fileTag === "jpeg") {
        //   let src = URL.createObjectURL(blob)
        //   this.src = src
        //   this.picVisible = true
        // } else {
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
        // }
      }
    },
    // 文件上传失败 - 处理方法
    _FileErrorHandle(err, file, fileList, item) {
      this.fileObjCopy[item.tnXfaqjbxxszid.toString()] = this.fileObjCopy[item.tnXfaqjbxxszid.toString()].filter(el => {
        return el.tcYwjmc != file.name
      })
    },
    // 上传之前判断
    _FileBeforeUpload(file, item) {
      // const isJPG = file.type === 'image/jpeg';
      // const isPNG = file.type === 'image/png';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG && !isPNG) {
      //   this.$msgbox({
      //     message: '上传必须是图片,并且为JPG/PNG 格式!',
      //     type: 'warning'
      //   })
      // }
      // if (!isLt2M) {
      //   this.$msgbox({
      //     message: '上传图片大小不能超过 2MB!',
      //     type: 'warning'
      //   })
      // }
    },
    // 事件-人员选择、机构选择、明细
    _ButtonItemClick(item) {
      this.curItem = item
      if(item.tnXxxlrfs === 9) {
        this.orgDlgVisble = true
      } else if(item.tnXxxlrfs === 8) {
        this.userDlgVisible = true
      }
    },
    // 事件-选择机构
    async _OrgTreeRegionClick(node) {
      this.curRegion[this.curItem.tnXfaqjbxxszid.toString()] = node
      // 根据单位id获取全名
      const result = await Model.getOrgDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId: '0004080101',
        requestData: {
          tcDwbm: node.id,
          tnSfjm: 1
        }
      })
      this.curRegion[this.curItem.tnXfaqjbxxszid.toString()].dwjc = result.data.tcDwmc
      if(this.curItem.tnXfaqjbxxszid.toString() in this.curRegion) {
        delete this.$refs.form.rules[this.curItem.tnXfaqjbxxszid.toString()]
      }
    },
    // 机构选择-关闭
    _OrgDlgCloseHandle() {
      this.orgDlgVisble = false
      if(this.curItem.tnXfaqjbxxszid.toString() in this.curRegion) {
        delete this.$refs.form.rules[this.curItem.tnXfaqjbxxszid.toString()]
      }
      // this.$forceUpdate()
    },
    // 机构选择-确定
    _DlgButtonClick() {
      this.orgDlgVisble = false
      if(this.curItem.tnXfaqjbxxszid.toString() in this.curRegion) {
        delete this.$refs.form.rules[this.curItem.tnXfaqjbxxszid.toString()]
      }
      this.$set(this.bindData, this.curItem.tnXfaqjbxxszid, this.curRegion[this.curItem.tnXfaqjbxxszid.toString()].id)
    },
    // 选择用户
    _ChooseUserChange(selection) {
      this.userDlgVisible = false
      this.curPerson[this.curItem.tnXfaqjbxxszid.toString()] = selection[0]
      if(selection.length !== 0) {
        delete this.$refs.form.rules[this.curItem.tnXfaqjbxxszid.toString()]
      }
      this.$set(this.bindData, this.curItem.tnXfaqjbxxszid, selection[0].tnYhid)
    },
    // 选择用户关闭
    _UserDlgCloseHandle() {
      this.userDlgVisible = false
    },
    // 保存按钮
    _ButtonSaveClick () {
      this.config.forEach(item => {
        if(item.tnXxxlrfs === 0 || item.tnXxxlrfs === 6) {
          if((item.tnXfaqjbxxszid.toString() in this.fileObjCopy) && this.fileObjCopy[item.tnXfaqjbxxszid.toString()].length !== 0) {
            delete this.$refs.form.rules[item.tnXfaqjbxxszid.toString()]
          }
        }
      })
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          const data = Object.keys(this.bindData).map(key => {
            const value = this.bindData[key]

            const id = parseInt(key, 10)
            const itemConfigIdx = this.config.findIndex(item => item.tnXfaqjbxxszid === id)
            const config = this.config[itemConfigIdx]
            if (config) {
              let valueText = ''
              if (config.tnXxxlrfs === 2 || config.tnXxxlrfs === 4) {
                const options = this.options[config.tcXxxxxxnr].filter(item => item.tcSjubm === value)
                valueText = options.length ? options[0].tcSjnr : ''
              } else if (config.tnXxxlrfs === 3) {
                valueText = this.options[config.tcXxxxxxnr].filter(item => value.findIndex(v => v === item.tcSjubm) >= 0).map(item => item.tcSjnr).join(',')
              } else if(config.tnXxxlrfs === 8) {
                // 人员选择
                valueText = this.curPerson[config.tnXfaqjbxxszid.toString()].tcYhmc
              } else if(config.tnXxxlrfs === 9) {
                // 机构选择
                valueText = this.curRegion[config.tnXfaqjbxxszid.toString()].dwjc
              }
              let dataValue = value
              if (config.tnXxxsjlx === 0 && dataValue != null) {
                dataValue = parseInt(value)
              }
              if (config.tnXxxsjlx === 2 && dataValue != null) {
                dataValue = parseFloat(value)
              }
              return {
                tnXfaqjbxxszid: id,
                tnXxxsjlx: config.tnXxxsjlx,
                jbxxz: config.tnXxxlrfs === 3 ? dataValue.join(',') : dataValue,
                tcSjmc: valueText,
                tnXxxlrfs: config.tnXxxlrfs,
                tnDllx: 0
              }
            }
          }).filter(item => item)

          this.config.forEach(config => {
            if (data.findIndex(item => item.tnXfaqjbxxszid === config.tnXfaqjbxxszid) < 0) {
              data.push({
                tnXfaqjbxxszid: config.tnXfaqjbxxszid,
                tnXxxsjlx: config.tnXxxsjlx,
                jbxxz: '',
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
        this.rules[item.tnXfaqjbxxszid.toString()] = rule
      })
    },
    setContent () {
      this.config.forEach(item => {
        if (item.tnXxxlrfs === 3) {
          this.$set(this.content, item.tnXfaqjbxxszid, this.content[item.tnXfaqjbxxszid] || [])
        }
      })
    },
    processContent () {
      const content = { ...this.content }
      Object.keys(content).forEach(key => {
        const id = parseInt(key, 10)
        const itemConfigIdx = this.config.findIndex(item => item.tnXfaqjbxxszid === id)
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
        const id = this.config[idx].tnXfaqjbxxszid
        show = typeof this.bindData[id.toString()] === 'undefined'
          ? false
          : (item.tcXxxldglz.split(',').indexOf(this.bindData[id.toString()]) >= 0)
      }
      return show
    },
  }
}
</script>
<style lang="scss" scoped>
.vehicle-ceil {
  padding-right: 10px;
}
.el-button+.el-button {
  margin-left: 0 !important
}
</style>
