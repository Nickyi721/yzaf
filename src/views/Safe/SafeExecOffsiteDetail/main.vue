<template>
  <CustomView :location="[$route.query.type==='add' ? { text: '新增非现场检查' }:{text: '非现场检查详情'}]">
    <el-form ref="form" :model="formData" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="检查内容名称" prop="tcJcnrmc">
        <el-input v-model="formData['tcJcnrmc']" size="mini" style="width:350px" placeholder="请输入检查内容名称"></el-input>
      </el-form-item>
      <el-form-item label="结果说明" prop="tcJcdwzg">
        <el-input v-model="formData['tcJcdwzg']" type="textarea" rows="6" size="mini" style="width:350px" placeholder="请输入结果说明"></el-input>
      </el-form-item>
      <el-form-item label="检查时间" prop="tcJcsj">
        <el-date-picker :disabled="disabled"
          v-model="formData['tcJcsj']"
          type="date"
          size="mini"
          placeholder="选择检查时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="附件" prop="xtFjList">
        <CommonFileUpload
          :list="formData['xtFjList']"
          :limit='200'
          @uploadFile='(param) => _requestFile(param)'
          >
        </CommonFileUpload>
        <CommonFileDownload
          :list="formData['xtFjList']"
          @remove='_onRemove'
          >
        </CommonFileDownload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" v-if="formData.tcLx!='04010101'" @click="_SaveButtonClick()">保存</el-button>
      </el-form-item>
    </el-form>
  </CustomView>
</template>

<script>
import Validator from '@commons/validator.js'
import CommonModel from '@commons/model.js'
import Model from './model.js'
import Moment from 'moment'
import Mixin from '@mixins'
export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      rules: {
        tcJcnrmc: [
          Validator.required('请输入检查内容名称'),
          Validator.length(1, 66)
        ],
        tcJcsj: [Validator.required('选择检查时间')],
        tcJcdwzg: [
          Validator.required('请输入结果说明'),
          Validator.length(0, 666)
        ],
        // xtFjList: [Validator.required('请选择附件')]
      },
      formData: {
        xtFjList: []
      },
      disabled: false,
    }
  },
  methods: {
    $init() {
      if (this.$route.query.type !== 'add'){
        this.disabled = true
        this.getAPresentChkDetail()
      }
    },
    _SaveButtonClick(){
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          this.saveAPresentChk()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    //上传文件
    _requestFile (param) {
      var fileObj = param.file
      this.file = fileObj
      var form = new FormData() // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId', window.sessionStorage.sessionId)
      form.append('lylx', 0)
      form.append('cdId', '0004060201')
      form.append('isQuery', 0)
      form.append('isVideo', 0),//0否1是
      this.uploadFile(form, fileObj.name, fileObj.uid)
    },
    // 移除附件
    _onRemove (attachment) {
      this.$confirm('确认删除当前附件？').then(() => {
        //移除文件显示列表数据
        this.formData.xtFjList = this.formData.xtFjList.filter(ele => ele.uid != attachment.uid)
      }).catch(err => {})
    },
    //保存
    async saveAPresentChk() {
      this.formData.tcJcsj = Moment(this.formData.tcJcsj).format('YYYY-MM-DD')
      this.formData.tcBdwdm = this.$route.query.tcBdwdm
      this.formData.tcBdwmc = this.$route.query.tcBdwmc
      this.formData.tnFxcjcxxid = this.$route.query.tnFxcjcxxid
      const result = await Model.saveAPresentChk({
        isQuery: 0,
        requestdata: this.formData
      })
      if(result.state === '1'){
        this.$message({
          message: result.msg
        })
        this.$router.push('/safe/exec/off-site')
      }
    },
    //获取详情
    async getAPresentChkDetail() {
      const result = await Model.getAPresentChkDetail({
        requestdata: {
          tnFxcjcxxid: this.$route.query.tnFxcjcxxid
        }
      })
      if(result.state === '1'){
        this.formData = result.data
      }
    },
    //上传附件
    async uploadFile (data, name, uid) {
      const result = await CommonModel.uploadFile(data)
      if (result.state === '1') {
        this.$message({
          message: '上传成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle'
        })
        this.formData.xtFjList.push({
          name: name,
          tcYwjmc: result.data.split(",")[0],
          url: "",
          tcXwjmc: result.data.split(",")[1],
          tcWjmc: result.data,
          uid: uid
        })
      } else {
        this.formData.xtFjList = this.formData.xtFjList.filter(el => {
          return el.name != name
        })
      }
    },
  }
}
</script>
<style lang="scss" scoped>

</style>

