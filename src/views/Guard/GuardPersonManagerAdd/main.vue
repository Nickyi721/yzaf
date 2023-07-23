<template>
  <CustomView :location="[{ text: $route.params.type === 'add' ? '新增管理人员' : '管理人员详情' }]">
    <el-form ref="form" :model="formData" :rules="rules" label-position="top" class="common-form">
      <el-form-item label="姓名" prop="tcXm">
        <el-input v-model="formData['tcXm']" :disabled="disabled" size="mini" style="width:600px" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="tcXb">
        <el-select v-model="formData['tcXb']" :disabled="disabled" placeholder="请选择性别" size="mini" style="width:300px">
          <el-option v-for="item in xb" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="职务" prop="tcZw">
        <el-select v-model="formData['tcZw']" :disabled="disabled" placeholder="请选择职务" size="mini" style="width:300px">
          <el-option v-for="item in dutiesType['050202']" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="民族" prop="tcMz">
        <el-input v-model="formData['tcMz']" :disabled="disabled" size="mini" style="width:600px" placeholder="请输入民族"></el-input>
      </el-form-item>
      <el-form-item label="出生年月" prop="tdCsny">
        <el-date-picker v-model="formData['tdCsny']" align="right" size='mini' :picker-options="pickerOptions" type="date" placeholder="请选择出生年月" ></el-date-picker>
      </el-form-item>
      <el-form-item label="参加安保工作时间" prop="tdCjgzsj">
        <el-date-picker v-model="formData['tdCjgzsj']" align="right" size='mini' :picker-options="pickerOptions" type="date" placeholder="请选择参加安保工作时间" ></el-date-picker>
      </el-form-item>
      <el-form-item label="检查证件编号" prop="tcJczjbh">
        <el-input v-model="formData['tcJczjbh']" :disabled="disabled" size="mini" style="width:600px" placeholder="请输入检查证件编号"></el-input>
      </el-form-item>
      <el-form-item label="政治面貌" prop="tcZzmm">
        <el-select v-model="formData['tcZzmm']" :disabled="disabled" placeholder="请选择政治面貌" size="mini" style="width:300px">
          <el-option v-for="item in zzmmType['050206']" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="办公电话" prop="tcBgdh">
        <el-input v-model="formData['tcBgdh']" :disabled="disabled" size="mini" style="width:600px" placeholder="请输入办公电话"></el-input>
      </el-form-item>
      <el-form-item label="文化程度" prop="tcWhcd">
        <el-select v-model="formData['tcWhcd']" :disabled="disabled" placeholder="请选择文化程度" size="mini" style="width:300px">
          <el-option v-for="item in whcdType['050203']" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="专兼职" prop="tcZjz">
        <el-select v-model="formData['tcZjz']" :disabled="disabled" placeholder="请选择专兼职" size="mini" style="width:300px">
          <el-option v-for="item in zjzType['050204']" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="tcZt">
        <el-select v-model="formData['tcZt']" :disabled="disabled" placeholder="请选择状态" size="mini" style="width:300px">
          <el-option v-for="item in statusType['050205']" :key="item.tcSjubm" :label="item.tcSjnr" :value="item.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员" prop="tcYhzh">
        <el-button ref="person" class="common-form-dlg-btn" @click="_choosePerson" :disabled="isEditable">{{formData.tcYhzh ? formData.tcYhzh : '请选择人员'}}</el-button>
      </el-form-item>      
      <el-form-item label="备注" prop="tcBz">
        <el-input v-model="formData['tcBz']" :disabled="disabled" size="mini" type="textarea" :rows="5" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="上传证件照片" prop="file">
        <el-upload class="upload-demo" 
          action='' 
          :http-request="(param) => _requestFile(param)"
          :limit="1" 
          :on-change="(file, fileList) => _handleChange(file, fileList)"
          :auto-upload="true"
          :file-list="formData['xtFjList']"
          list-type="picture" 
          :on-remove="_onRemove"
          :on-preview="_downloadFile"
          :show-file-list='true'>
          <el-button size="mini" type="default" :disabled="disabled" >点击上传</el-button>
          <div slot="tip" class="el-upload__tip">上传证件照片不能超过10M</div>
        </el-upload>
        <!-- <a v-if="file!=undefined" @click="_aClick">{{}}</a> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="_SaveButtonClick()" >保存</el-button>
      </el-form-item>
    </el-form>

    <CustomDialog title="选择用户" width="90%" top="40px" :visible="dialogVisible" @close="dialogVisible = false">
      <ChooseUser @choose="_ChooseUserChange" :tcSsdwbm="tcSsdwbm"/>
    </CustomDialog>    
  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'
import Validator from '@commons/validator.js'
import CommonModel from '@commons/model.js'
import request from '@commons/request.js'
import Moment from 'moment'
import ChooseUser from './components/ChooseUser.vue'

export default {
  mixins: [
    Mixin.page,
    Mixin.init, 
  ],
  components:{
    ChooseUser
  },
  data () {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules:{
        tcXm: [
          Validator.required('请输入姓名'),
          Validator.length(1, 15)
        ],
        tcXb: [
          Validator.required('请选择性别')
        ],
        tcZw: [
          Validator.required('请选择职务')
        ],
        tcMz: [
          Validator.required('请输入民族'),
          Validator.length(1, 6)
        ],
        tdCsny: [
          Validator.required('请选择出生年月')
        ],
        tdCjgzsj:[
          Validator.required('请选择参加安保工作时间')
        ],
        tcJczjbh: [
          Validator.required('请输入检查证件编号'),
          Validator.length(1, 20)
        ],
        tcZzmm: [
          Validator.required('请选择政治面貌')
        ],
        tcBgdh: [
          Validator.required('请输入固话或者手机号，固话格式为0000-00000000'),
          Validator.length(1, 13),
          Validator.isFixedPhoneNumber()
        ],
        tcWhcd: [
          Validator.required('请选择文化程度')
        ],
        tcZjz: [
          Validator.required('请选择专兼职')
        ],
        tcZt: [
          Validator.required('请选择状态')
        ],
        tcBz: [
          // Validator.required('请输入备注'),
          Validator.length(1, 100)
        ],
      },
      query: {},
      dutiesType: [],
      whcdType: [],
      zjzType: [],
      statusType: [],
      zzmmType: [],
      tcSsdwbm:this.$route.params.tcSsdwbm,
      xb:[
        {"tcSjubm":"0","tcSjnr":"男"},
        {"tcSjubm":"1","tcSjnr":"女"}
      ],
      formData:{
        tnAbjgid: '',
        tcXm:'',
        tcXb:'',
        tcZw:'',
        tcMz:'',
        tdCsny:'',
        tdCjgzsj:'',
        tcJczjbh:'',
        tcZzmm:'',
        tcBgdh:'',
        tcWhcd:'',
        tcZjz:'',
        tcZt:'',
        tcBz:'',
        tcSczp:'',
        tcRyzt: '0',
        xtFjList: []
      },
      disabled: false,
      dialogVisible: false,
      isEditable: false
    }
  },
  methods: {
    $init(options) {
      this.getDuties()
      this.getWHCD()
      this.getZJZ()
      this.getStatus()
      this.getZZMM()
      if(this.$route.params.type === 'add')
        this.formData.tnAbjgid = parseInt(this.$route.params.tnAbjgid)
      else{
        this.query.tnAbglryid = this.$route.params.tnAbglryid
        this.getDetail()
      }
    },
    _handleChange(){

    },
    _onRemove (file, fileList) {
      // //移除文件显示列表数据
      this.formData.xtFjList = []
    },
    _requestFile(param) {
      var fileObj = param.file
      this.file = fileObj
      var form = new FormData()    // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId',window.sessionStorage.sessionId)
      form.append('lylx',0),
      form.append('cdId','00040402')
      form.append('isVideo', 0)
      form.append('isQuery', 0)
      this.uploadFile(form,fileObj.name)
    },
    async uploadFile(data, name) {
      const result = await Model.uploadFile(data);
      if (result.state === "1") {
        this.$message({
          message:'上传成功!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
        //修改上传图片文件名    
        this.formData.xtFjList.push({
          name: name,
          tcYwjmc: result.data.split(',')[0],
          url: '',
          tcXwjmc: result.data.split(',')[1],
          tcWjmc: result.data
        })
      }
      else{
        this.formData.xtFjList = []
        // this.$message({
        //   message:'上传失败!',
        //   type:"success",
        //   duration:1000,
        //   customClass: "middle"
        // })
      }
    },
    _downloadFile (file) {
      if (file.tcXwjmc != undefined) {
        request({
          url: '/zlk/zlkDownload',
          responseType: 'blob', // 表明返回服务器返回的数据类型
          data: {
            requestData: {
              tcWjm: file.tcXwjmc
              // tcWjm:'378c0e8256b948479632aa109eaf310d.txt'
            }
          }
        })
          .then((res) => { // 处理返回的文件流
            if (res != undefined) {
              const content = res
              const blob = new Blob([content])
              const fileName = file.name
              const fileTag = fileName.split('.')[1]
              // if (fileTag === 'png' || fileTag === 'jpg' || fileTag === 'jpeg') {
              //   let src = URL.createObjectURL(blob)
              //   this.src = src
              //   this.picVisible = true
              // } else {
                // const fileName = 'xxx.png'
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
            } else {
              this.$message({
                message: '下载失败,请联系管理员!',
                type: 'fail',
                duration: 1000,
                customClass: 'middle'
              })
            }
          })
      }
    },
    _SaveButtonClick(){
      this.$refs.form.validate((valid, obj) => {
        if (valid) {
          if(this.$route.params.type === 'add')
            this.addData()
          else
            this.updateData()
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 选择人员
    _choosePerson() {
      this.dialogVisible = true
      this.$forceUpdate()
    },
    _ChooseUserChange(selection) {
      this.formData.tcZzid = selection[0].tnYhid
      this.formData.tnYhid = selection[0].tnYhid      
      this.formData.tcZzmc = selection[0].tcYhmc
      this.formData.tcYhzh = selection[0].tcYhzh
      this.$forceUpdate()
      this.$refs.form.clearValidate(['tcZzid'])
      this.dialogVisible = false
    },
    //获取职务
    async getDuties () {
      const result = await CommonModel.getDictData(['050202'])
      if (result && result.data) {
        this.dutiesType = result.data;
        
      }
    },
    //获取文化程度
    async getWHCD () {
      const result = await CommonModel.getDictData(['050203'])
      if (result && result.data) {
        this.whcdType = result.data;
      }
    },
    //获取专兼职
    async getZJZ () {
      const result = await CommonModel.getDictData(['050204'])
      if (result && result.data) {
        this.zjzType = result.data;
      }
    },
    //获取状态
    async getStatus () {
      const result = await CommonModel.getDictData(['050205'])
      if (result && result.data) {
        this.statusType = result.data;
      }
    },
    //获取政治面貌
    async getZZMM () {
      const result = await CommonModel.getDictData(['050206'])
      if (result && result.data) {
        this.zzmmType = result.data;
      }
    },
    //更新数据
    async addData(){
      this.formData.tdCjgzsj = Moment(this.formData.tdCjgzsj).format('YYYY-MM-DD')
      this.formData.tdCsny = Moment(this.formData.tdCsny).format('YYYY-MM-DD')
      this.formData.tcSczp = this.formData.xtFjList.length === 1 ? this.formData.xtFjList[0].tcWjmc : ''
      const result = await Model.addData({
        isQuery:0,  //是否是查询类 0-否 1-是
        cdId:'00040402', //菜单ID
        cdMc:'安全保卫人员管理',
        requestData: this.formData
      })
      if (result.state==="1") {
        this.$message({
          message:'新增成功!',
          type:"success",
          duration:1000,
          customClass: "middle",
          showClose: true,
        })
        this.$router.push({name: 'guardPersonManager',params: {id: this.formData.tnAbjgid}})
        // this.$router.push({path: '/guard/person/manager'})
      }
      // else{
      //   this.$message({
      //     message:'新增失败!',
      //     type:"fail",
      //     duration:2000,
      //     customClass: "middle",
      //     onClose:function(){

      //     }
      //   })
      // }
    },
    async getDetail(){
      const result = await Model.getDetail({
        isQuery:1,  //是否是查询类 0-否 1-是
        cdId:'00040402', //菜单ID
        cdMc:'安全保卫人员管理',
        requestData: this.query
      })
      if(result.state==='1'){
        this.formData = result.data[0]
        // this.formData.tdCjgzsj = Moment(this.formData.tdCjgzsj, 'YYYY-MM-DD').valueOf();
        // this.formData.tdCsny = Moment(this.formData.tdCsny, 'YYYY-MM-DD').valueOf();
        this.formData.xtFjList = []
        if(this.formData['tcSczp'])
          this.formData.xtFjList.push({
            name: this.formData['tcSczp'].split(',')[0],
            tcYwjmc: this.formData['tcSczp'].split(',')[0],
            url: '',
            tcXwjmc: this.formData['tcSczp'].split(',')[1],
            tcWjmc: this.formData['tcSczp']
          })
      }
    },
    //更新数据
    async updateData(){
      this.formData.tdCjgzsj = Moment(this.formData.tdCjgzsj).format('YYYY-MM-DD')
      this.formData.tdCsny = Moment(this.formData.tdCsny).format('YYYY-MM-DD')
      this.formData.tcSczp = this.formData.xtFjList.length === 1 ? this.formData.xtFjList[0].tcWjmc : ''
      const result = await Model.updateData({
        isQuery:0,  //是否是查询类 0-否 1-是
        cdId:'00040402', //菜单ID
        cdMc:'安全保卫人员管理',
        requestData: this.formData
      })
      if (result.state==="1") {
        this.$message({
          message:'修改成功!',
          type:"success",
          duration:1000,
          customClass: "middle",
          showClose: true,
        })
        this.$router.push({name: 'guardPersonManager',params: {id: this.formData.tnAbjgid}})
      }
      // else{
      //   this.$message({
      //     message:'修改失败!',
      //     type:"fail",
      //     duration:2000,
      //     customClass: "middle",
      //     onClose:function(){

      //     }
      //   })
      // }
    }
  }
}
</script>
