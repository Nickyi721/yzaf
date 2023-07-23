<template>
  <CustomView :location="[{text :'安全检查报告书详情'}]">
    <el-form ref="form" :model="safe" label-width="180px" class="compose-form1">
      <el-form-item>
        <div class="title">
          <h2 class="safeTittle">安全检查报告<span>【{{ safe.tcBgsbh }}】</span></h2>
          <span>
            <el-button size="mini" @click="_ButtonClick" >
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
            <p class="checkTypeInfo">{{ safe.tcJcry }}</p>
          </div>
          <div class="checkDetail">
            <img src="../../../assets/image/jcrq.png" alt="">
            <p class=checkType>检查日期</p>
            <p class="checkTypeInfo">{{ safe.tcJcrq }}</p>
          </div>
          <div class="checkDetail">
            <img src="../../../assets/image/jcdw.png" alt="">
            <p class=checkType>检查单位</p>
            <p class="checkTypeInfo">{{ safe.tcJcdwmc }}</p>
          </div>
        </div>
      </div>  
      <p class="checkDw"><span>被检单位：</span>{{ safe.tcBjdwmc }}</p>
      <ul class="detail">
        <li>
          <p class="tittleDetail">
            <CustomIcon name="time-limits"/>
            检查内容及存在问题
          </p>
          <div class="detailContent">{{ safe.tcNrwt }}</div>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="rectification-opinion"/>
            整改意见和时限
          </p>
          <div class="detailContent">{{ safe.tcZgyjsx }}</div>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="inspection-opinion"/>
            被检查单位意见
          </p>
          <div class="detailContent">{{ safe.tcBjcdwyj }}</div>
        </li>
        <li>
          <p class="tittleDetail">
            <CustomIcon name="leader-instruction"/>
            检查单位主管领导批示
          </p>
          <div class="detailContent">{{ safe.tcJcdwzg }}</div>
        </li>
      </ul>
    </el-form>
  </CustomView>
</template>

<script>
import Model from './model.js'
import Mixin from '@mixins'
import request from '@commons/request.js'

export default {
  mixins: [
    Mixin.init, 
    Mixin.page
  ],
  data () {
    return {
      safe: {},
    }
  },
  methods: {
    $init(options) {
      this.getAqjcbgDetial()
    },
    _ButtonClick () {
      if(this.safe.tnAqjcbgid && this.safe.tnAqjcbgid !== '') {
        request({
          url: '/aqjcAqjcbg/scAqjcbgs',
          responseType: 'blob', // 表明返回服务器返回的数据类型
          data: {
            requestData:{
              tnAqjcbgid: this.safe.tnAqjcbgid,
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
              // document.body.removeChild(elink)
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
    },
    async getAqjcbgDetial() {
      const result = await Model.getAqjcbgDetial({
          requestData: { 
            tnAqjcbgid: this.$route.query.id || ''
          }
        })
      if (result && result.data) {
        this.safe = result.data
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "~@assets/styles/define.scss";
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
    margin-left: 10px;
    padding-top: 20px;
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
    margin-left:402px;
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
</style>