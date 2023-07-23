<template>
  <CustomView :location="[{ text: $route.params.type === 'add' ? '二维码信息录入' : '二维码详情' }]">
    <el-form ref="form" :model="formData" :rules="rules" label-position="top" label-width="300px" class="common-form" :disabled="disabled">
      <el-form-item label="二维码名称" prop="tcEwmmc">
        <el-input v-model="formData['tcEwmmc']" size="mini" placeholder="请输入名称" style="width: 300px;"></el-input>
      </el-form-item>
      <!-- <el-form-item label="二维码大类" prop="tcEwmDlbm">
        消防
      </el-form-item> -->
      <el-form-item label="二维码大类" prop="tcEwmDlbm">
        <el-select v-model="formData['tcEwmDlbm']" placeholder="请选择大类" size="mini" style="width:300px" @change="_selectChange">
          <el-option v-for="item in EwmDl" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二维码小类" prop="tcEwmXlbm">
        <el-select v-model="formData['tcEwmXlbm']" placeholder="请选择小类" size="mini" style="width:300px" @change="_selectChangeXl">
          <el-option v-for="item in EwmXl" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注说明" prop="tcBz">
        <el-input v-model="formData['tcBz']" size="mini" placeholder="请输入备注说明，格式为位置+编号" style="width: 300px;"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-radio-group v-model="radio" @change="_radioChange">
          <el-radio label="1">选择内容</el-radio>
          <el-radio label="2">输入内容</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="tnCdid" v-if="this.radio==='1'">
        <el-input v-model="formData['tnCdid']" size="mini" type="text" :rows="5" style="width: 300px; margin-right:10px" placeholder="请选择场地ID" maxlength="40" :readonly="true"></el-input>
        <el-button size="mini" type="primary" @click="_btnClick" v-if="!disabled">选择内容</el-button>
      </el-form-item>
      <el-form-item prop="tcCdmc" v-if="this.radio==='2'">
        <el-input v-model="formData['tcCdmc']" size="mini" type="text" :rows="5" style="width: 300px; margin-right:10px" placeholder="请输入场地内容" maxlength="40"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="_saveButtonClick()" v-if="!disabled">保存</el-button>
      </el-form-item>
    </el-form>
    <CustomDialog title="选择内容" width="90%" top="40px" :visible="dialogVisible" @close="dialogVisible = false">
      <Content ref="content" style="height: 500px" @choose="_contentSelect" :checked="checked" :tcEwmXlbm='formData["tcEwmXlbm"]' :tcEwmDlbm='formData["tcEwmDlbm"]'/>
    </CustomDialog>
  </CustomView>
  
</template> 

<script>
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'
import request from '@commons/request.js'
import CommonModel from '@commons/model.js'
import Moment from 'moment'

import Content from './components/Content'

export default {
  mixins: [Mixin.page, Mixin.init],
  components: { Content },
  data () {
    return {
      rules: {
        tcEwmmc: [
          Validator.required('请输入二维码名称'),
          Validator.length(1, 20)
        ],
        tcEwmDlbm: [
          Validator.required('请二维选择码大类')
        ],        
        tcEwmXlbm: [
          Validator.required('请二维选择码小类')
        ],
        tcBz: [
          Validator.length(1, 40)
        ]
      },
      query: {// 用于获取详情

      },
      formData: {
        tcEwmmc: '',
        tcEwmDlbm: '',
        tcEwmDlmc: '',
        tcEwmXlbm: '',
        tcEwmXlmc: '',
        tnCdid: '',
        tcCdmc: '',
        tnEwmid: '',
        tcBz: '',
        tnSfyx: '10030402'
      },
      radio: '',
      EwmDl: [],
      EwmXl: [],
      checked: [],
      dialogVisible: false,
      disabled: false,
    }
  },
  methods: {
    $init (options) {
      if(this.$route.params.type === 'view') this.disabled = true
      this.formData.tnEwmid = this.$route.params.tnEwmid==='-1'?'':this.$route.params.tnEwmid
      this.getEwmDl()
      if (this.$route.params && this.$route.params.type !== 'add') {
        this.query.tnEwmid = this.$route.params.tnEwmid
        this.getQrcodeDetail()        
      }
    },

    _btnClick() {
      if(this.formData.tcEwmXlbm){
        this.dialogVisible = true
        if(this.$refs.content) {
          if(this.formData.tcEwmDlbm === '000701'){
            this.$refs.content.getXfEquipConfig()
          }
          else{
            this.$refs.content.getJrEquipConfig()
          }
        }
      }else{
        this.$alert(`请先选择二维码大类、二维码小类`)
      }
    },

    _contentSelect(selection) {
      this.dialogVisible = false
      this.formData.tnCdid = selection[0].tnYwpc
    },

    _saveButtonClick () {
      this.$refs.form.validate ((valid, obj) => {
        if (valid) {
          this.saveQrCodeItem()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    _selectChangeXl(val) {
      this.formData.tcEwmXlbm = val
      this.formData.tnCdid = ''
    },
    _selectChange(val){
      this.formData.tcEwmDlbm = val
      let type = this.formData.tcEwmDlbm === '000701' ? '1001':'0301'
      this.formData.tcEwmXlbm = ''
      this.formData.tcEwmDlmc = ''
      this.getEwmXl(type)
    },
    _radioChange(val){
      // this.formData.tcCdmc = ''
      // this.formData.tnCdid = ''
      // this.$forceUpdate()
    },
    _buttonClick() {
      this.$emit('query', this.query)
    },
    //获取二维码大类
    async getEwmDl() {
      const result = await CommonModel.getDictData(['0007']);
      if (result && result.data) {
        this.EwmDl = result.data["0007"];
      }
    },
    //获取二维码小类
    async getEwmXl(type) {
      const result = await CommonModel.getDictData([type]);
      if (result && result.data) {
        this.EwmXl = result.data[type];
      }
    },
    
    //保存数据
    async saveQrCodeItem(){
      this.formData.tcEwmDlmc = this.EwmDl.find(el=>el.tcSjubm===this.formData.tcEwmDlbm).tcSjnr
      this.formData.tcEwmXlmc = this.EwmXl.find(el=>el.tcSjubm===this.formData.tcEwmXlbm).tcSjnr
      if(this.radio === '1'){
        Reflect.deleteProperty(this.formData, 'tcCdmc')
        if(!this.formData.tnCdid || this.formData.tnCdid == ''){
          this.$alert(`请选择内容!`)
          return
        }
      }else{
        Reflect.deleteProperty(this.formData, 'tnCdid')
        if(!this.formData.tcCdmc || this.formData.tcCdmc== ''){
          this.$alert(`请输入内容!`)
          return
        }
      }
      const result = await Model.saveQrCodeItem({
        isQuery:0,  //是否是查询类 0-否 1-是
        cdId:'0004080301', //菜单ID
        cdMc:'',
        requestData: this.formData
      })
      if (result.state==="1") {
        this.$message({
          message: result.msg,
          type:"success",
          duration:1000,
          customClass: "middle",
          showClose: true,
        })
        this.$router.push({name: 'fireControlCodeDeploy'})
      }
    },
    // 获取详情
    async getQrcodeDetail(){
      const result = await Model.getQrcodeDetail({
        isQuery:1,  //是否是查询类 0-否 1-是
        cdId:'0004080301', //菜单ID
        cdMc:'',
        requestData: this.query
      })
      if(result.state==='1'){
        this.formData = result.data
        let type = this.formData.tcEwmDlbm === '000701' ? '1001':'0301'
        this.getEwmXl(type)
        this.radio =  this.formData.tnCdid ? '1' : '2'
      }
    },
  }
}
</script>
