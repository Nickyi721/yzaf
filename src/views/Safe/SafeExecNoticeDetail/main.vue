<template>
  <CustomView title="隐患整改通知详情">
    <el-form :model="formData" label-width="180px" class="compose-form1">
      <el-form-item>
        <div class="title">
          <h2 class="safeTittle">安全检查报告<span>【{{ formData.aqjcbg.tcBgsbh }}】</span></h2>
          <span>
            <el-button type="" size="mini" @click="_ButtonClick('report')">
            <CustomIcon name="export"/>
              导出
            </el-button>
          </span>
        </div>
      </el-form-item>
      <div class="header">
        <div class="check">
          <div class="checkDetail">
            <img src="../../../assets/image/jcry.png" alt="">
            <p class=checkType>检查人员</p>
            <p class="checkTypeInfo">{{ formData.aqjcbg.tcJcry }}</p>
          </div>
          <div class="checkDetail">
            <img src="../../../assets/image/jcrq.png" alt="">
            <p class=checkType>检查日期</p>
            <p class="checkTypeInfo">{{ formData.aqjcbg.tcJcrq }}</p>
          </div>
          <div class="checkDetail">
            <img src="../../../assets/image/jcdw.png" alt="">
            <p class=checkType>检查单位</p>
            <p class="checkTypeInfo">{{ formData.aqjcbg.tcJcdwmc }}</p>
          </div>
        </div>
      </div>
      <p class="checkDw"><span>被检单位：</span>{{ formData.aqjcbg.tcBjdwmc }}</p>
      <ul class="detail">
        <li>
          <p class="tittleDetail">
            <CustomIcon name="time-limits"/>
            检查内容及存在问题
          </p>
          <div class="detailContent">{{ formData.aqjcbg.tcNrwt }}</div>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="rectification-opinion"/>
            整改意见和时限
          </p>
          <div class="detailContent">{{ formData.aqjcbg.tcZgyjsx }}</div>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="inspection-opinion"/>
            被检查单位意见
          </p>
          <div class="detailContent">{{ formData.aqjcbg.tcBjcdwyj }}</div>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="leader-instruction"/>
            检查单位主管领导批示
          </p>
          <div class="detailContent">{{ formData.aqjcbg.tcJcdwzg }}</div>
        </li>
      </ul>
    </el-form>

    <el-form label-width="180px" class="compose-form2">
      <el-form-item>
        <div class="title">
          <h2>隐患整改通知<span label="编号" >【{{ formData.yhzgtz.tcZgtzbh }}】</span></h2>
          <span>
            <el-button type="" size="mini" @click="_ButtonClick('notice')">
              <CustomIcon name="export"/>           
              导出
            </el-button>
          </span>
        </div>
      </el-form-item>
        <div class="yhzgContent">{{ formData.yhzgtz.tcZgtznr }}</div>
    </el-form>

    <el-form label-width="180px" class="compose-form2">
      <el-form-item>
        <div class="title">
          <h2>隐患整改回复书</h2>
          <span v-if="$route.query.curZt === '已回复'">
            <el-button type="" size="mini" @click="_ButtonClick('noticeReply')">
            <CustomIcon name="export"/>
              导出
            </el-button>
          </span>
        </div>
      </el-form-item>
      <div class="yhzgReport">
      <span>编号</span>    
      <el-input :readonly="true" v-model="formData['bh']" type="text" size="mini"></el-input>
      </div>
      <div class="note">
        <span><em>*</em>备注</span>
        <el-input :readonly="$route.query.curZt === '已回复'" v-model="formData['hfnr']" type="textarea" rows="5"></el-input>
      </div>
    </el-form>
    <div class='file-content'>
      <span>附件</span>
      <div style='width:507px;margin-left:40px;margin-top:-20px;height:150px'>
        <CommonFileUpload
          v-if="$route.query.curZt === '未回复'"
          :list="formData.xtFjList" 
          :limit='200'
          @uploadFile='(param) => _requestFile(param)' 
          >
        </CommonFileUpload>
        <CommonFileDownload
          style="margin-top:10px"
          :picVisible="picVisible"
          :list="formData.xtFjList || formData.yhzgtz.xtFjList" 
          :disabled="$route.query.curZt === '已回复'"
          @remove='_onRemove'
          >
        </CommonFileDownload>
      </div>
      <div>
        <el-button v-if="$route.query.curZt === '未回复'" class="noteButton" type="primary" size="mini" @click="_ButtonSubmit">提交</el-button>
      </div>
    </div>
  </CustomView>
</template>

<script>
// 共用模块
import Mixin from '@mixins'
import Model from './model.js'
import request from '@commons/request.js'
import CommonModel from '@commons/model.js'

export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      formData: {
        aqjcbg: {},
        yhzgtz: {},
        xtFjList: []
      },
      picVisible: true
    }
  },
  methods: {
    $init () {
      this.getNoticeDetail()
    },
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
    _onRemove (attachment) {
      this.$confirm('确认删除当前附件？').then(() => {
        //移除文件显示列表数据
        this.formData.xtFjList = this.formData.xtFjList.filter(ele => ele.uid != attachment.uid)
        this.picVisible = false
      }).catch(err => {})
    },
    async uploadFile(data, name, uid) {
      const result = await CommonModel.uploadFile(data);
      if (result.state === "1") {
        this.$message({
          message: '上传成功!',
          type: "success",
          duration: 1000,
          customClass: "middle",
          showClose: true,
        })
      //修改上传图片文件名   
        this.formData.xtFjList.push({
          name: name,
          tcYwjmc: result.data.split(",")[0],
          url: "",
          tcXwjmc: result.data.split(",")[1],
          tcWjmc: result.data,
          uid: uid
        })
      }else{
        this.formData.xtFjList.filter(ele => ele.uid != uid)
      }
    },
    async getNoticeDetail() {
      const result = await Model.getNoticeDetail({
        isQuery: 1,
        cdId: '0004060204',
        requestData: {
          tnAqjcbgid: this.$route.query.curPlan,
        }
      })
      if(result.data) {
        this.formData.aqjcbg = result.data.aqjcbg
        this.formData.bh = result.data.bh
        this.formData.yhzgtz = result.data.yhzgtz
        this.formData.xtFjList = result.data.xtfjList || []
        this.formData.hfnr = result.data.hfnr.split("#").join("\n")
      }
    },
    _ButtonClick(type) {
      if(type === 'report') {
        if(this.formData.aqjcbg.tnAqjcbgid && this.formData.aqjcbg.tnAqjcbgid !== '') {
          request({
            url: '/aqjcAqjcbg/scAqjcbgs',
            responseType: 'blob', // 表明返回服务器返回的数据类型
            data: {
              requestData:{
                tnAqjcbgid: this.formData.aqjcbg.tnAqjcbgid,
              }
            }
          }).then((res) => { // 处理返回的文件流
            if(res == undefined ){
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
              const fileName = '安全检查报告-' + myDate
              if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName + '.docx'
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
        } else {
          this.$message({
            message: "发生未知错误，请联系管理员",
            type: 'error',
            showClose: true,
            duration: 1000,
            customClass: "middle",
          })
        }
      } else if(type === 'notice') {
        if(this.formData.yhzgtz.tnYhzgtzid && this.formData.yhzgtz.tnYhzgtzid !== '') {
          request({
            url: '/aqjcYhzgtz/scYhzgtz',
            responseType: 'blob', // 表明返回服务器返回的数据类型
            data: {
              requestData:{
                tnYhzgtzid: this.formData.yhzgtz.tnYhzgtzid,
              }
            }
          }).then((res) => { // 处理返回的文件流
            if(res == undefined ){
              this.$message({
                message:'下载失败,请联系管理员!',
                type:"fail",
                duration:1000,
                customClass: "middle",
                showClose: true,
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
              const fileName = '隐患整改通知书-' + myDate
              if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName + '.docx'
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
        } else {
          this.$message({
            message:"发生未知错误，请联系管理员",
            type: 'error',
            showClose: true,
            duration:1000,
            customClass: "middle",
          })
        }
      } else {
        if(this.formData.yhzgtz.tnYhzgtzid && this.formData.yhzgtz.tnYhzgtzid !== '') {
          request({
            url: '/aqjcYhzgtz/scYhzghf',
            responseType: 'blob', // 表明返回服务器返回的数据类型
            data: {
              requestData:{
                tnYhzgtzid: this.formData.yhzgtz.tnYhzgtzid,
              }
            }
          }).then((res) => { // 处理返回的文件流
            if(res == undefined ){
              this.$message({
                message:'下载失败,请联系管理员!',
                type:"fail",
                duration:1000,
                customClass: "middle",
                showClose: true,
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
              const fileName = '隐患整改回复书-' + myDate
              if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName + '.docx'
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
        } else {
          this.$message({
            message:"发生未知错误，请联系管理员",
            type: 'error',
            showClose: true,
            duration:1000,
            customClass: "middle",
          })
        }
      }
    },
    _ButtonSubmit() {
      this.addNoticeReply()
    },
    async addNoticeReply() {
      const result = await Model.addNoticeReply({
        isQuery: 0,
        cdId: '0004060204',
        requestData: {
          tcAqjctoid: this.formData.yhzgtz.tcAqjctoid || '',
          tnAqjcjhid: this.formData.yhzgtz.tnAqjcjhid || '',
          tnAqjcbgid: this.formData.yhzgtz.tnAqjcbgid || '',
          tcBjcdwid: this.formData.yhzgtz.tcBjcdwid || '',
          tcBjcdwmc: this.formData.yhzgtz.tcBjcdwmc || '',
          tcLxr: this.formData.yhzgtz.tcLxr || '',
          tcTzsj: this.formData.yhzgtz.tcTzsj || '',
          tnXxzt: this.formData.yhzgtz.tnXxzt || '',
          tcZgtzbh: this.formData.bh || '',
          tcZgtznr: this.formData.hfnr || '',
          xtFjList: this.formData.xtFjList || []
        }
      })
      if(result.state === '1') {
        this.$message({
          message:"新增回复书成功！",
          type: 'success',
          showClose: true,
          duration: 1000,
          customClass: "middle",
        })
        this.$router.push({path: '/safe/exec/notice'})
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";
  .title{
    margin-top: 20px;
  }
  .file-content{
    background:white;
    margin: 0 10px 20px 10px;
    padding-left: 380px;
    height: 200px;
  }
  .icon {
    width: 24px;
    height: 24px;
    vertical-align: -6px;
    fill: currentColor;
    overflow: hidden;
    margin-right:8px;
  }
  .icon1 {
    width:16px;
    height:16px;
    vertical-align: -6px;
    fill: currentColor;
    overflow: hidden;
    margin-right:8px;
    vertical-align: -3px;
  }
  /deep/ .view-body{
    background:#f8f8f8;
    padding-top:10px !important;
  }
  .compose-form1{
  width: calc(100% - 20px);
  margin-left:10px;
  background:rgba(255,255,255,1)
  }
  .compose-form-content {
    color: #000;
    line-height: 20px;
    padding-top: 10px;
    word-break: break-all;
  }
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
  h2{
    text-align: center;
  }
  .el-button {
    position:absolute;
    top:10px;
    right:15px;
  }
 .noteButton{
    position:static;
    display:block;
    margin-left:260px;
    margin-top:16px;
  }
  .el-input{
    width:506px;
  }
  /deep/ .el-input__inner{
    margin-left: 8px;
  }
  .header{
    width:100%;
    height:58px;
  }
  .check{
    width:510px;
    height:58px;
    margin:auto;
  }
  .checkDetail{
    float:left;
    width:170px;
    height:58px;
    position:relative;
  }
  .checkType{
    height:19px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:19px;
    color:rgba(153,153,153,1);
    position:absolute;
    top:8px;
    left:58px;
  }

 .checkTypeInfo{
    height:19px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:19px;
    color:rgba(51,51,51,1);
    opacity:1;
    position:absolute;
    top:28px;
    left:58px;
}
  .checkDw{
    width:100%;
    height:19px;
    margin-left: 10px;
    margin-bottom: 16px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:19px;
    color:rgba(51,51,51,1);
    span{
      color:rgba(153,153,153,1);
    }
  }
  .detail{
    li{
      overflow: hidden;
      border:transparent;
      border-top:1px dotted rgba(238,238,238,1);
      width: calc(100% - 32px);
      margin-left:16px;
      .iconfont{
        font-weight: normal;     
        font-size: 24px;
        vertical-align: -3px;
      }
      &:nth-child(1){
        .iconfont{
          color:$orange
        }
      }
      &:nth-child(2){
        .iconfont{
          color:$blue
        }
      }
      &:nth-child(3){
        .iconfont{
          color:$cyan
        }
      }
      &:nth-child(4){
        border-bottom:1px dotted rgba(238,238,238,1);
        .iconfont{
          color:$error
        }
      }
    }
  }
  .tittleDetail{
    height:19px;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    line-height:19px;
    color:rgba(51,51,51,1);
    padding-top: 12px;
    padding-bottom: 15px;
  }
  .detailContent{
    width:100%;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:19px;
    color:rgba(51,51,51,1);
    padding-top:14px;
    padding-bottom:25px;
  }

  .compose-form2{
    width: calc(100% - 20px);
    margin-left: 10px;
    margin-top:20px;
    background:white;
  }
  .yhzgContent{
    padding:0 16px 24px;
  }
  .yhzgReport{
    padding-left: calc(50% - 267px);
  }
  .note{
    padding-bottom:30px;
    padding-left: calc(50% - 272px);
    em{
      color:red;
    }
    span{
      vertical-align:50px;
    }
  }
  .el-textarea{
    width:506px;
    margin-top:16px;
    margin-left:8px;
  }
</style>

