<template>
  <CustomView :title="$route.query.year + '年度重点工作登记'" :location="[{ text: '日常工作查询' }]">
    <CustomTitle slot="top">
      {{params.year + '年度工作详情'}}
    </CustomTitle>
    <div class="year">
      <div class="block-toolbar">
        <div class="block-toolbar-left">年度重点工作</div>
      </div>
      <el-form disabled :model="formData" ref="yearForm" :rules="yearRules" label-width="150px" class="compose-form">
        <el-form-item label="重点工作说明" prop="tcGznr">
          <div class="work-describe" placeholder="年度重点工作说明">{{formData['tcGznr']}}</div>
        </el-form-item>
        <el-form-item label="附件">
          <CommonFileDownload :list="fileList" :disabled=true></CommonFileDownload>
          <!-- <el-upload
            class="upload-demo"
            action=""
            :file-list="fileList"
            :on-preview="_FileDownload">
            <el-button class="upBtn" size="small" type="primary">上传</el-button>
          </el-upload> -->
        </el-form-item>
      </el-form>
    </div>
    <div class="season">
      <div class="block-toolbar">
        <div class="block-toolbar-left" style="margin:10px 20px">季度工作进展说明</div>
      </div>
      <div class="season-block" v-for="(list, index) in seasonList" :key="index">
        <div class="season-toolbar">
          <div class="season-toolbar-left">
            <span class="season-title">{{list.tcZq}}</span>
            <CustomIcon name="person"/>
            <span>{{list['tdCjsj']}}</span>
            <CustomIcon name="time"/>
            <span>{{list['tcCjrmc']}}</span>
          </div>
        </div>
        <el-form :disabled="list.updateShow" :model="list" :ref="list.tnNdzdgzid" :rules="yearRules" label-position="top" class="common-form-dlg season-form">
          <el-form-item label="工作进展说明" prop="tcGznr">
            <div class="work-describe" placeholder="年度重点工作说明">{{list['tcGznr']}}</div>
          </el-form-item>
          <el-form-item label="附件">
            <CommonFileDownload :list="list.seasonFile" :disabled=true></CommonFileDownload>
            <!-- <el-upload
              class="upload-demo"
              action=''
              :file-list="list.seasonFile"
              :on-preview="_FileDownload">
              <el-button class="upBtn" size="small" type="primary">上传</el-button>
            </el-upload> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
  </CustomView>
</template>

<script>
import Moment from 'moment'
import Mixin from '@mixins'
import Validator from '@commons/validator.js'

import Model from './model.js'
export default {
  mixins: [
    Mixin.init, 
  ],
  data () {
    return {
      seasonList: [],
      formData: {},
      bindData: {},
      typeRules: {
        tcZq: [
          Validator.required('请选择季度'),
        ],
        tcGznr: [
          Validator.required('请输入工作进展'),
        ]
      },
      yearRules: {
        tcGznr: [
          Validator.required('请输入年度重点工作说明'),
        ]
      },
      fileList: []
    }
  },
  methods: {
    $init(options) {
      this.getDetail()
    },
    // 点击文件下载
    _FileDownload() {
       request({
        url: '/zlk/zlkDownload',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        data: {
          requestData:{
            tcWjm: file.tcXwjmc
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
          const fileName = file.name
          const fileTag = fileName.split(".")[1]
          if(fileTag==="png"||fileTag==="jpg"||fileTag==="jpeg"){
            let src = URL.createObjectURL(blob)
            this.src = src
            this.picVisible = true
          }else{
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
        }
      })
    },
    // 获取详情
    async getDetail() {
      const result = await Model.getDetail({
        isQuery: 1,
        cdId: '0004090101',
        requestData: {
          tcNd: this.$route.query.year,
          tcDwdm: this.$route.query.tcDwdm
        }
      })
      if(result.data) {
        result.data.forEach((item) => {
          if(item.tnLx === 0) {
            if(item.xtFjList && item.xtFjList.length != 0) {
              item.xtFjList.forEach((file) => {
                let obj = {
                  name: file.tcYwjmc,
                  newName: file.tcXwjmc,
                  tcYwjmc: file.tcYwjmc,
                  tcXwjmc: file.tcXwjmc,
                  url: ''
                }
                this.fileList.push(obj)
              })
            }
            this.formData = item
          } else {
            item.tdCjsj = Moment(item.tdCjsj).format('YYYY-MM-DD')
            // 每个季度绑定对应的文件列表
            let seasonFile = []
            if(item.xtFjList && item.xtFjList.length != 0) {
              item.xtFjList.forEach((file) => {
                let obj = {
                  name: file.tcYwjmc,
                  newName: file.tcXwjmc,
                  tcYwjmc: file.tcYwjmc,
                  tcXwjmc: file.tcXwjmc,
                  url: ''
                }
                seasonFile.push(obj)
              })
            }
            item.seasonFile = seasonFile
            this.seasonList.push(item)
          }
        });
      }
    }
  },
}
</script>
<style lang="scss">
@import "~@assets/styles/define.scss";
  .year{
    border: 1px solid #ededed;
    border-radius: 4px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    margin: 0 40px;
    margin-bottom: 20px;
    padding: 10px 20px;
    .work-describe {
      white-space:normal;
      word-break:break-all;
      word-wrap:break-word;
    }
    .block-toolbar{
      overflow: hidden;
      margin-bottom: 10px;
      .block-toolbar-left{
        float: left;
        line-height: 28px;
        color: $text-dark;
        font-size: 15px;
        font-weight: bold;
      }
    }
  }
  .infoSeason {
    margin-left: 15px
  }
  .el-form-item__label{
    float: none;
    display: inline-block;
    text-align: left;
    padding: 0 !important;
    line-height: 32px !important;
    color: #006a45 !important;
  }
  .el-form-item__content{
    line-height: 30px !important;
    margin-left: 0 !important;
  }
  .season {
    border: 1px solid #ededed;
    border-radius: 4px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    margin: 0 40px;
    margin-bottom: 20px;
    padding: 10px 20px;
    .work-describe {
      white-space:normal;
      word-break:break-all;
      word-wrap:break-word;
    }
    .season-block{
      position: relative;
      &::before{
        content: '';
        display: block;
        position: absolute;
        width: 5px;
        height: 5px;
        border: 3px solid $green;
        border-radius: 100%;
        background: #fff;
        top: 30px;
        left: 20px;
        z-index: 2;
      }
      &::after{
        content: '';
        display: block;
        position: absolute;
        width: 2px;
        height: calc(100% + 20px);
        top: 33px;
        left: 25px;
        z-index: 1;
        background: #ededed;
      }
      &:last-child{
        &::after{
          display: none;
        }
      }
      .season-toolbar{
        overflow: hidden;
        margin-bottom: 10px;
        border-top: 1px dotted #dfdfdf;
        padding-top: 20px;
        padding-left: 20px;
        margin-left: 25px;
        .season-toolbar-left{
          vertical-align: middle;
          float: left;
          line-height: 28px;
          color: $text-light;
          font-size: 12px;
          >i{
            margin-right: 5px;
            font-size: 12px;
          }
          >span{
            margin-right: 20px;
            &.season-title{
              font-size: 14px;
              color: $orange;
            }
          }
        }
        .season-toolbar-right{
          float: right;
          text-align: right;
        }
      }
      .season-form{
        padding-left: 60px;
      }      
    }
  }
  .upBtn{
    width:56px;
    height:28px;
    border-color: #EBEEF5 !important;
    background:#fff !important;
    color:#C0C4CC !important;
  }

  
</style>
