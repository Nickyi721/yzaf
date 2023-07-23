<template>
  <CustomView :location="[{text:'上报故障'}]">
    <el-form class="form-wrap" :model="params" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="故障设施种类" prop="tcGzsszlbm" >
        <el-select v-model="params.tcGzsszlbm" placeholder="请选择故障设施种类" size="mini" :disabled="disabled" @change="selectChange">
          <el-option value="" label="请选择"></el-option>
          <el-option :value="item.tcSjubm" :label="item.tcSjnr" v-for="item in equipType" :key="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障设施" prop="tnYwpc">
        <el-button v-if="disabled" @click.native="detailClick(params.tnYwpc)" size="small">点击查看</el-button>
        <el-input v-else @click.native="detailClick('')" v-model="params.tnYwpc" size="mini" placeholder="请选择故障设施" suffix-icon="el-icon-caret-bottom">
        </el-input>
      </el-form-item>
      <el-form-item label="故障数量" prop="tnGzsl">
        <el-input placeholder="请填写故障设施数量" :disabled="disabled" type="number"  v-model="params.tnGzsl" size="small"></el-input>
      </el-form-item>
      <el-form-item label="故障时间" prop="tdGzsj" required>
        <el-date-picker :disabled="disabled" type="date" placeholder="选择日期" v-model="params.tdGzsj" size="small"></el-date-picker>
      </el-form-item>

      <el-form-item label="备注" prop="tcBz">
        <el-input :disabled="disabled" type="textarea" v-model="params.tcBz" size="small"></el-input>
      </el-form-item>
      <el-form-item  label="附件" prop="tcBz">

        <CommonFileUpload v-if="!disabled" :list="fileList" :limit='200' @uploadFile='(param) => _requestFile(param)'>
        </CommonFileUpload>
        <div>
          <CommonFileDownload  :list="fileList" :disabled="true"></CommonFileDownload>
        </div>
      </el-form-item>
      <div v-if="disabled">
        <el-form-item label="故障上报单位" prop="tcBz">
          <el-input disabled type="text" v-model="params.tcGzfsdwmc" size="small"></el-input>
        </el-form-item>
        <el-form-item label="上报人" prop="tcBz">
          <el-input disabled type="text" v-model="params.tcCjrmc" size="small"></el-input>
        </el-form-item>
      </div>

      <el-form-item v-if="!disabled">
        <el-button size="mini" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form-item>
      <el-form-item label="完成维修" v-if="disabled&&params.tnSfgz==1">
        <el-button type="info" @click="changeStatus" size="small">修改</el-button>
        <span class="block">本条设备目前为报损中 ,如果已修复可点击进行状态修改</span>
      </el-form-item>

      <el-form-item v-if="disabled&&params.bz==1&&params.tnSfgz==1">
        <el-button size="mini" type="primary" @click="commit">上报</el-button>
      </el-form-item>
    </el-form>
    <info-dialog ref="infoDialog" @row-dblclick="rowDblclick"></info-dialog>
  </CustomView>
</template>

<script>
// 共用模块
// import Model from './model.js'

// 页面组件
import InfoDialog from './components/InfoDialog/main'
import Mixin from '@mixins'
import Model from './model'
import Moment from 'moment'
import CommonModel from '@commons/model.js'
export default {
  mixins: [
    Mixin.init
  ],
  components: {
    InfoDialog
  },
  data () {
    return {
      dict: ['0301'],
      equipType: [],
      equipTypeSet: [],
      disabled: false,
      fileList: [],
      params: {
        tcGzsszlbm: '',
        tcGzsszlmc: '',
        tnYwpc: '',
        tnGzsl: '',
        tdGzsj: '',
        tcBz: ''
      },
      rules: {
        tcGzsszlbm: [
          { required: true, message: '请选择故障设施种类', trigger: 'blur' }
        ],
        tnYwpc: [
          { required: true, message: '请选择故障设施', trigger: 'blur' }
        ],
        tnGzsl: [
          { required: true, message: '请填写故障设施数量', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在1到11个字符', trigger: 'blur' }
        ],
        tdGzsj: [
          { required: true, message: '请选择故障时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    selectChange () {
      console.log('change')
      this.$set(this.params, 'tnYwpc', '')
    },
    _requestFile (param) {
      var fileObj = param.file
      var form = new FormData() // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId', window.sessionStorage.sessionId)
      form.append('lylx', 0)
      form.append('isVideo', 1) // 0否1是
      form.append('cdId', '0004060201')
      form.append('isQuery', 0)
      this.uploadFile(form, fileObj.name, fileObj.uid)
    },
    async uploadFile (data, name, tnAqjczjid, uid) {
      const result = await CommonModel.uploadFile(data)
      if (result.state === '1') {
        this.$message({
          message: '上传成功!',
          type: 'success',
          duration: 1000,
          customClass: 'middle'
        })
        const wjmc = result.data.split(',')
        this.params.tcYwjmc = wjmc[0]
        this.params.tcXwjmc = wjmc[1]
        this.fileList = [{
          name: result.data.split(',')[0],
          newName: result.data.split(',')[1],
          url: '',
          tcYwjmc: result.data.split(',')[0],
          tcXwjmc: result.data.split(',')[1]
        }]
        console.log(this.xtFjList)
      }
    },
    rowDblclick (data) {
      // this.params.tnYwpc = data.tnYwpc
      // this.params.tcGzfsdwbm = data.orgId
      // this.params.tcGzfsdwmc = data.orgName
      this.$set(this.params, 'tnYwpc', data.tnYwpc)
      this.$set(this.params, 'tcGzfsdwbm', data.orgId)
      this.$set(this.params, 'tcGzfsdwmc', data.orgName)
      console.log(this.params)
    },
    detailClick (tnYwpc) {
      if (!this.params.tcGzsszlbm) {
        return this.$message.warning('请选择故障设施种类')
      }
      const { tcDwdm, tcDwmc } = JSON.parse(sessionStorage.user)
      let detailType, detailTypeText
      const { tnAfssgzbsid } = this.$route.query
      let currentOrg = {
        id: tcDwdm,
        name: tcDwmc
      }
      if (tnAfssgzbsid) {
        currentOrg = {
          id: this.params.tcGzfsdwbm,
          name: this.params.tcGzfsdwmc
        }
      }
      if (this.params.tcGzsszlbm === '030106') {
        detailType = '030108'
        detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.params.tcGzsszlbm)[0].tcSjnr
      } else if (this.params.tcGzsszlbm === '030107') {
        detailType = '030109'
        detailTypeText = this.equipTypeSet.filter(item => item.tcSjubm === this.params.tcGzsszlbm)[0].tcSjnr
      } else {
        detailType = ''
        detailTypeText = ''
      }
      this.$refs['infoDialog'].init({
        currentType: this.params.tcGzsszlbm,
        detailType,
        detailTypeText,
        currentOrg,
        tnYwpc
      })
    },
    $init (options) {
      this.equipTypeSet = options['0301']
      this.equipType = options['0301'].filter(item => item.tcSjubm !== '030108' && item.tcSjubm !== '030109')
      const { tnAfssgzbsid } = this.$route.query
      if (tnAfssgzbsid) {
        this.getDetail({ tnAfssgzbsid })
        this.disabled = true
      }
    },
    async getDetail (data) {
      const res = await Model.getDetail(data)
      if (res.state === '1') {
        this.params = res.data
        if (res.data.tcYwjmc) {
          this.fileList = [{
            name: res.data.tcYwjmc,
            newName: res.data.tcXwjmc,
            url: '',
            tcYwjmc: res.data.tcYwjmc,
            tcXwjmc: res.data.tcXwjmc
          }]
        }
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const re = /^[0-9]*[1-9][0-9]*$/
          /*  if (this.params.tnGzsl.length > 11) {
            return this.$message.warning('故障数量最多为11位数字')
          } */
          if (!re.test(Number(this.params.tnGzsl))) {
            return this.$message.warning('故障数量为正整数')
          }
          if (this.params.tcBz && this.params.tcBz.length > 100) {
            return this.$message.warning('备注最多输入100个字')
          }
          this.params.tcGzsszlmc = this.equipTypeSet.filter(item => item.tcSjubm === this.params.tcGzsszlbm)[0].tcSjnr
          this.params.tnGzsl = parseInt(this.params.tnGzsl)
          this.params.tdGzsj = Moment(this.params.tdGzsj).format('YYYY/MM/DD')
          const res = await Model.saveJraqgzsb(this.params)
          if (res.state === '1') {
            this.$message.warning(res.msg)
            this.$router.go(-1)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    commit () {
      this.params.tdGzsj = Moment(this.params.tdGzsj).format('YYYY/MM/DD')
      this.$confirm('确定是否上报？').then(async () => {
        const res = await Model.saveSb(this.params)
        if (res.state === '1') {
          this.$message.warning(res.msg)
          this.$router.go(-1)
        }
      }).catch(() => {})
    },
    changeStatus () {
      this.$confirm('您本条设备故障是否已修复？').then(async () => {
        const res = await Model.saveYwx({
          tnYwpc: this.params.tnYwpc
        })
        if (res.state === '1') {
          this.$message.warning(res.msg)
          const { tnAfssgzbsid } = this.$route.query
          this.getDetail({ tnAfssgzbsid })
        }
      }).catch(() => {})
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.form-wrap {
  padding: 30px 0 0;
  width: 400px;
  /deep/ .el-input,
  /deep/ .el-select {
    width: 100% !important;
  }
}
.el-date-editor {
  width: auto !important;
}
.block{
  display: block;
  padding-top: 10px;
  font-size: 13px;
  color: #999;
  line-height: 20px;
}
.status-wrap {
  padding: 10px 30px 30px;
  font-size: 14px;
}
// button{
//   border-color: #006a45!important;
//   color: #006a45!important;
//   background-color: #ffffff!important;
//   &:hover{
//     color: #ffffff!important;
//     background-color: #006a45!important;
//   }
// }
</style>
