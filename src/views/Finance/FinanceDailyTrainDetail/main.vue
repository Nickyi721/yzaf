<template>
  <CustomView :location="[{ text: $route.query.type === 'add' ? '新增培训记录' : '培训记录详情'}]">
    <el-form v-if="($route.query.type === 'add' || bindData['tnBzw'] === 0) && ($route.query.show)" :model="bindData" label-position="top" class="common-form" ref="ruleForm" :rules="rules">
      <el-form-item label="演练/培训类型" prop="tcXxxlxbm">
         <el-select clearable v-model="bindData['tcXxxlxbm']" size="mini" placeholder="请选择演练/培训类型">
          <el-option v-for="option in optionsType" :key="option.tcSjubm" :label="option.tcSjnr" :value="option.tcSjubm"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="演练/培训目的" prop="tcPxmd">
        <el-input type="textarea" v-model="bindData['tcPxmd']" maxlength="65" placeholder="请输入演练/培训目的" :rows="3" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="演练/培训内容" prop="tcPxnr">
        <el-input type="textarea" v-model="bindData['tcPxnr']" maxlength="65" placeholder="请输入演练/培训内容" :rows="3" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="演练/培训地点" prop="tcPxdd">
        <el-input type="text" v-model="bindData['tcPxdd']" maxlength="65" placeholder="请输入演练/培训地点" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="演练/培训教师" prop="tcPxjs">
        <el-input type="text" v-model="bindData['tcPxjs']" maxlength="65" placeholder="请输入演练/培训教师" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="演练/培训时间段" prop="tdPxsj">
        <el-date-picker v-model="tdPxsj" size="mini" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" placeholder="选择演练/培训时间段" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="参与人员数量" prop="tnCyrysl">
        <el-input type="number" v-model="bindData['tnCyrysl']" maxlength="11" oninput="if(value.length>11) value=value.slice(0,11)" size="mini" placeholder="请输入参与人员数量"></el-input>
      </el-form-item>
      <el-form-item label="参加人员" prop="tcCxry">
        <el-input type="textarea" :rows="6" v-model="bindData['tcCxry']" maxlength="650" size="mini" placeholder="请输入参加人员"></el-input>
      </el-form-item>

      <el-form-item label="附件"> 
        <el-upload 
          class="upload-demo" 
          drag
          action='' 
          :http-request="(param) => _requestFile(param)"
          :auto-upload="true"
          :on-preview="_FileDownload"
          :on-remove="_FileRemove"
          :file-list="xtFjList"
          :show-file-list='true'>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-form-item>

      <el-form-item label="备注" prop="tcBz">
        <el-input type="textarea" v-model="bindData['tcBz']" maxlength="65" placeholder="请输入备注" :rows="3" size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="_saveClick">保存</el-button>
      </el-form-item>
    </el-form>
    
    <div v-if="($route.query.type !== 'add' && bindData['tnBzw'] === 1) || !($route.query.show)" class="unit-detail">
      <div slot="top" style="float: right">
        <CustomToolbar>
          <CustomButton icon="export" text="导出" @click="_ExportClick"/>
        </CustomToolbar>
      </div>
      <div class="unit-info">
        <div class="unit-info-item">
          <div class="unit-info-label">培训/演练类型</div>    
          <div class="unit-info-content">{{bindData['tcXxxlxmc']}}</div>    
        </div>
        <div class="unit-info-item">
          <div class="unit-info-label">培训/演练目的</div>    
          <div class="unit-info-content">{{bindData['tcPxmd']}}</div>    
        </div>
        <div class="unit-info-item">
          <div class="unit-info-label">培训/演练内容</div>    
          <div class="unit-info-content">{{bindData['tcPxnr']}}</div>    
        </div>
        <div class="unit-info-item">
          <div class="unit-info-label">培训/演练地点</div>    
          <div class="unit-info-content">{{bindData['tcPxdd']}}</div>    
        </div>
        <div class="unit-info-item">
          <div class="unit-info-label">培训/演练教师</div>    
          <div class="unit-info-content">{{bindData['tcPxjs']}}</div>    
        </div>
        <div class="unit-info-item">
          <div class="unit-info-label">培训/演练时间段</div>    
          <div class="unit-info-content">{{bindData['tcPxsj']}}</div>    
        </div>
        <div class="unit-info-item">
          <div class="unit-info-label">参与人员数量</div>    
          <div class="unit-info-content">{{bindData['tnCyrysl']}}</div>    
        </div>
        <div class="unit-info-item">
          <div class="unit-info-label">参加人员</div>    
          <div class="unit-info-content">{{bindData['tcCxry']}}</div>    
        </div>
        <div class="unit-info-item">
          <div class="unit-info-label">附件</div>    
          <CommonFileDownload :list="xtFjList" :disabled="true"></CommonFileDownload>
        </div>
      </div>
    </div>
    

  </CustomView>
</template>

<script>
import Mixin from '@mixins'
import Model from './model.js'
import CommonModel from "@commons/model.js";
import Validator from '@commons/validator.js'
import Moment from 'moment'

// 文件上传
import request from '@commons/request.js'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      // 加载数据字典
      dict: ["031201"],
      rules: {
        tcXxxlxbm: [
          Validator.required('请选择演练/培训类型')
        ],
        tcPxnr: [
          Validator.required('请输入演练/培训内容')
        ],
        tcPxdd:[
          Validator.required('请输入演练/培训地点')
        ],
        tnCyrysl: [
          Validator.required('请输入参与人员数量')
        ],
        tcPxjs: [
           Validator.required('请输入演练/培训教师')
        ],
        // tdPxsj:[
        //   Validator.required('请选择演练/培训时间')
        // ],
        tcCxry: [
          Validator.required('参训人员不能为空'),
        ]
      },
      bindData:{
        // tdPxsj: []
      },
      tdPxsj: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      optionsType: [],
      options: {},
      xtFjList: [],
    }
  },
  methods: {
    $init(options){
      this.options = options
      this.optionsType = options['031201']
      if(this.$route.query.type !== 'add') {
        this.getDetail()
      }
    },
    _saveClick () {
      this.$refs.ruleForm.validate((valid, obj) => {
        if (valid) {
          if(this.tdPxsj !== null && this.tdPxsj.length != 0) {
            if(this.$route.query.type === 'add') {
              this.addData()
            } else {
              this.updateData()
            }
          } else {
            this.$alert('请选择培训/演练时间段')
          }
        } else {
          const firstKey = Object.keys(obj)[0]
          this.$alert(obj[firstKey][0].message)
        }
      })
    },
    // 新增记录
    async addData() {
      // 演练类型
      if(this.bindData.tcXxxlxbm !== undefined) {
        let objType = this.optionsType.find(item=>{
          return item.tcSjubm === this.bindData.tcXxxlxbm  
        })
        this.bindData.tcXxxlxmc = objType.tcSjnr
      }
      const result = await Model.addRecord({
        isQuery: 0,
        requestData: {
          tcFqdwbm: this.$route.query.tcFqdw.id,
          tcFqdwmc: this.$route.query.tcFqdw.name,
          tcXxxlxbm: this.bindData.tcXxxlxbm,
          tcXxxlxmc: this.bindData.tcXxxlxmc,
          // tdPxkssj: this.bindData.tdPxsj[0],
          // tdPxjssj: this.bindData.tdPxsj[1],
          tdPxkssj: this.tdPxsj[0],
          tdPxjssj: this.tdPxsj[1],
          tnCyrysl: this.bindData.tnCyrysl,
          tcPxdd: this.bindData.tcPxdd,
          tcPxnr: this.bindData.tcPxnr,
          tcPxmd: this.bindData.tcPxmd || '',
          tcCxry: this.bindData.tcCxry,
          tcPxjs: this.bindData.tcPxjs,
          tcBz: this.bindData.tcBz || '',
          xtFjList: this.xtFjList
        }
      })
      if(result.state === '1') {
        this.$message({
          message: '新增成功！',
          type: 'success',
          customClass: "middle",
        })
        this.$router.push({ 
          path: '/finance/daily/train',
        })
      }
    },
    // 修改记录
    async updateData() {
      // 演练类型
      if(this.bindData.tcXxxlxbm !== undefined) {
        let objType = this.optionsType.find(item=>{
          return item.tcSjubm === this.bindData.tcXxxlxbm  
        })
        this.bindData.tcXxxlxmc = objType.tcSjnr
      }   
      const result = await Model.updateRecord({
        isQuery: 0,
        requestData: {
          tnPxylid: JSON.parse(this.$route.query.row).tnPxylid,
          tcFqdwbm: JSON.parse(this.$route.query.row).tcFqdwbm,
          tcFqdwmc: JSON.parse(this.$route.query.row).tcFqdwmc,
          tcXxxlxbm: this.bindData.tcXxxlxbm,
          tcXxxlxmc: this.bindData.tcXxxlxmc,
          // tdPxkssj: this.bindData.tdPxsj[0],
          // tdPxjssj: this.bindData.tdPxsj[1],
          tdPxkssj: this.tdPxsj[0],
          tdPxjssj: this.tdPxsj[1],
          tnCyrysl: this.bindData.tnCyrysl,
          tcPxdd: this.bindData.tcPxdd,
          tcPxnr: this.bindData.tcPxnr,
          tcPxmd: this.bindData.tcPxmd || '',
          tcCxry: this.bindData.tcCxry,
          tcPxjs: this.bindData.tcPxjs,
          tcBz: this.bindData.tcBz || '',
          xtFjList: this.xtFjList
        }
      })
      if(result.state === '1') {
        this.$message({
          message: '修改成功！',
          type: 'success',
          customClass: "middle",
        })
        this.$router.push({ 
          path: '/finance/daily/train',
        })
      }
    },
    // 获取详情
    async getDetail() {
      const result = await Model.getDetail({
        isQuery: 1,
        requestData: {
          tnPxylid: JSON.parse(this.$route.query.row).tnPxylid
        }
      })
      if(result.state === '1' && result.data) {
        result.data.tdPxkssj = Moment(result.data.tdPxkssj).format('YYYY-MM-DD')
        result.data.tdPxjssj = Moment(result.data.tdPxjssj).format('YYYY-MM-DD')
        this.xtFjList = result.data.xtFjList
        this.xtFjList.forEach(item => {
          item.name = item.tcYwjmc
        })
        this.bindData = result.data
        this.tdPxsj = [this.bindData.tdPxkssj, this.bindData.tdPxjssj]
        this.bindData.tcPxsj = this.bindData.tdPxkssj + ' 至 ' + this.bindData.tdPxjssj
      }
    },
    // 后端导出
    _ExportClick() {
      request({
        url: '/trainingRecord/exportDetail',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          isQuery: 0,
          requestData: {
            tnPxylid: JSON.parse(this.$route.query.row).tnPxylid
          }
        }
      }).then((res) => { // 处理返回的文件流
        if(res == undefined){
          this.$message({
            message:'下载失败,请联系管理员!',
            type:"fail",
            duration:1000,
            customClass: "middle"
          })
        }else{
          const content = res
          const blob = new Blob([content])
          let year = new Date().getFullYear()
          let month = new Date().getMonth() + 1
          let strDate = new Date().getDate()
          if (month >= 1 && month <= 9) {
            month = '0' + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
          }
          const myDate = year + month + strDate
          const fileName = '教育培训及演练详情-' + myDate
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName + '.xls'
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
      })
    },
    // 文件上传
    _requestFile(param) {
      let fileObj = param.file
      this.file = fileObj
      let form = new FormData()    // FormData 对象
      form.append('file', fileObj) // 文件对象
      form.append('sessionId',window.sessionStorage.sessionId)
      form.append('lylx',0),
      form.append('cdId','0004050302')
      form.append('isQuery', 0)
      form.append('isVideo', 0)
      this.uploadFile(form, fileObj.name)
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
        const wjmc = result.data.split(",")
        let fileObj = {
          tcYwjmc: wjmc[0],
          tcXwjmc: wjmc[1],
          name: wjmc[0]
        }
        Object.assign(fileObj, this.file)
        this.xtFjList.push(fileObj)
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
    _FileRemove(file, fileList) {
      this.xtFjList = this.xtFjList.filter(el => {
        return el.tcYwjmc !== file.name
      })
    },
    // 点击文件下载
    async _FileDownload(file) {
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
      } else {
        this.$message({
          message:'下载失败,请联系管理员!',
          type:"fail",
          duration:1000,
          customClass: "middle"
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";

  .el-dialog {
    height: 419px;
  }
  /deep/ .el-dialog__body {
    .ctrl {
      text-align: right;
      padding: 10px;
    }
  }

.unit-detail{
  // padding: 10px;
  // margin: 0 60px;
  // margin-bottom: 10px;
  // box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
  // border: 1px solid $border-light;
  // border-radius: 4px;
  padding-left: 20px;

  .unit-title-bar{
    &::after{
      content: '';
      display: block;
      clear: both;
    }

    .unit-flag{
      float: left;
      width: 100px;
      position: relative;
      color: #fff;
      overflow: hidden;
      padding: 5px 10px;
      margin-left: -11px;
      user-select: none;
      font-size: 13px;

      >span{
        position: relative;
        z-index: 2;
        cursor: pointer;

        &:first-child{
          margin-right: 8px;
          display: inline-block;
          background: rgba(0, 0, 0, 0.1);
          width: 16px;
          height: 16px;
          line-height: 16px;
          border-radius: 100%;
          text-align: center;
          >i{
            color: #fff;
            font-size: 12px;
            margin-left: -2px;
            margin-top: -2px;
          }
        }
      }

      

      &::after{
        content: '';
        display: block;
        background: $green;
        width: 100%;
        height: 100%;
        position: absolute;
        left: -5px;
        top: 0;
        transform: skewX(-15deg);
        border-radius: 4px;
        background: $green;
        z-index: 1;
      }

      &.color-yellow{
        &::after{
          background: $warn;
        }
      }
      &.color-orange{
        &::after{
          background: $orange;
        }
      }
    }
    .unit-title{
      float: left;
      padding: 5px;
      
    }
    .unit-control{
      float: right;
    }
  }

  .unit-info{
    padding-top: 20px;
    .unit-info-item{
      font-size: 14px;
      overflow: hidden;
      margin-bottom: 10px;
      >*{
        float: left;
        &.unit-info-label{
          width: 120px;
          text-align: right;
          padding-right: 10px;
          color: $text-light;
        }
        &.unit-info-content{
          width: calc(100% - 120px);
        }
      }
      
    }
  }
}
</style>
