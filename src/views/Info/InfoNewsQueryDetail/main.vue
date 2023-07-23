<template>
  <CustomView :location="[{ text: '信息详情'}]">
    <CustomTitle>
      {{content.title}}
      <span slot="info">{{content.pubDate}}</span>
    </CustomTitle>
    <div class="common-content">
      <div class="common-content-des">
        <p>
          <span>信息类型：</span>
          <span>{{content.infoType}}</span>
        </p>
        <p>
          <span>接收单位：</span>
          <span>{{content.sendGroup || getOrgList(content.orgList, 6)}}</span>
        </p>
        <p>
          <span>抄送单位：</span>
          <span>{{content.copyGroup || getOrgList(content.orgList, 7)}}</span>
        </p>
      </div>
      <div class="common-content-text" v-html="content.content"></div>
      <!-- 消息接收单位不包含登录用户，则不显示回复内容和操作按钮，如果消息为必须回复，则显示回复内容和回复按钮 -->
      <div class="common-content-text" v-if="this.sffsdw && bindData['tnSfhf']=='1'">
        <span>回复内容：</span>
        <el-input v-model="bindData['tcHfnr']" type="textarea" :rows="3" :disabled="isRespond"/>
      </div>
      <CommonFileDownload 
        :list="content.attachment" 
        :disabled='true' 
        @remove='_onRemove'
        >
      </CommonFileDownload>
    </div>
    <CustomControlBar slot="bottom">
    <!-- <CustomControlBar slot="bottom" v-if="content.tcDwlx!=='抄送单位'"> -->
      <el-button size="small" type="primary" v-if="this.sffsdw && bindData['tnSfhf']=='1'&&!isRespond" @click="_confirmResponse">确认回复</el-button>
      <el-button size="small" type="primary" v-if="this.sffsdw && toHandleStatus && content.infoType==='安全工作通知'" @click="_toHandleClick">待办</el-button>
      <el-button size="small" type="primary" v-if="this.sffsdw && handleStatus && content.infoType==='安全工作通知'" @click="_handledClick">已办</el-button>
    </CustomControlBar>
  </CustomView >
</template>
<script>
import Mixin from '@mixins'
import Model from './model.js'

export default {
  mixins: [
    Mixin.page,
    Mixin.init, 
  ],
  data () {
    return {
      content: {
        tnXxid:'',
        title: '',
        infoType: '',
        sendGroup: '',
        copyGroup: '',
        sendOrg: '',
        copyOrg: '',
        orgList: [],
        content: '',
        pubDate:'',
        attachment: [
        ]
      },
      bindData: {
        tcXxzt: '',
        tcXxztmc: '',
        tnXxid: '',
        tcHfnr: ''
      },
      toHandleStatus: true,
      handleStatus: true,
      src: '',
      picVisible: false,
      imgIcon: true,
      zipIcon: false,
      isRespond: false,
      sffsdw: false
    }
  },
  methods: {
    $init () {
      this.sffsdw = this.$route.params.sffsdw == '1'
      this.getDetail()
    },
    _toHandleClick () {
      this.bindData.tnXxid = this.content.tnXxid
      this.bindData.tnBlbz = 0//个人设置待办
      this.updateStatus()
    },
    _handledClick () {
      this.bindData.tnXxid = this.content.tnXxid
      this.bindData.tnBlbz = 1//个人设置已办
      this.updateStatus()
    },
    _onRemove() {
    },
    closeHandle(){
      this.picVisible = false
    },
    _confirmResponse() {
      this.confirmResponse()
    },
    getOrgList (list, type) {
      return list.filter(item => item.tnLx === type).map(item => {
        if (item.mode === 1) {
          if (item.selected) {
            return `${item.tcDwmc}及下一级单位`
          } else {
            return `${item.tcDwmc}下一级单位`
          }
        } else if (item.mode === 2) {
          if (item.selected) {
            return `${item.tcDwmc}及所有子单位`
          } else {
            return `${item.tcDwmc}所有子单位`
          }
        } else {
          return `${item.tcDwmc}`
        }
      }).join('，')
    },
    async getDetail(){      
      const result = await Model.getDetail({
        isQuery: 1,  //是否是查询类 0-否 1-是
	      cdId:'0004030101', //菜单ID
        requestData: {
          tnXxid:this.$route.params.tnXxid,
        }
      })      
      if(result){
        const data = result.data[0]
        this.content.tnXxid = this.$route.params.tnXxid
        this.content.title = data.tcXxbt
        this.content.pubDate = data.tdFbsj
        this.content.infoType = data.tcLxmc
        // if(this.$route.params.tnBlbz === '0' || this.$route.params.tnBlbz === '-10'){
        //   this.toHandleStatus = true
        //   this.handleStatus = true
        // }
        // if(this.$route.params.tnBlbz === '1'){
        //   this.toHandleStatus = false
        //   this.handleStatus = false
        // }
        this.toHandleStatus = this.handleStatus = this.$route.params.tnBlbz != 1
        
        this.content.sendGroup = data.jsQzglMc
        this.content.copyGroup = data.csQzglMc

        this.content.orgList = data.xxglXxgldwpzDto || this.content.orgList
        this.content.orgList.forEach(el => {
            el.mode = el.tnXjxzbz
            el.selected = !el.tnBjxzbz
        })
        this.content.attachment = data.xtFjList
        this.content.content = data.tcZw
        if(data.tnSfhf && data.tcHfnr && data.tcHfnr.length>0){
          this.isRespond = true
        }
        this.bindData.tcHfnr = data.tcHfnr || ''
        this.bindData.tnSfhf = data.tnSfhf
      }
    },
    async updateStatus(){
      const result = await Model.updateStatus({
        isQuery: 0,  //是否是查询类 0-否 1-是
	      cdId:'0004030102', //菜单ID
        requestData: this.bindData
      })
      if (result.state==="1") {
        if(result.data === '1'){
          this.$message({
            message:'回复内容不能为空!',
            type:"success",
            duration:1000,
            customClass: "middle"
          })
        }
        else{
          this.$message({
            message:'修改成功!',
            type:"success",
            duration:1000,
            customClass: "middle"
          })
          this.$router.push({path: '/info/news/query/'})
        }
      }
    },
    async confirmResponse(){
      if(!this.bindData.tcHfnr || this.bindData.tcHfnr == ''){
        this.$message({
          message:'回复内容不能为空!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
        return
      }
      const result = await Model.confirmResponse({
        isQuery: 0,  //是否是查询类 0-否 1-是
	      cdId:'0004030102', //菜单ID
        requestData: {
          tnXxid:this.$route.params.tnXxid,
          tcHfnr: this.bindData.tcHfnr
        }
      })      
      if(result){
        this.isRespond = true
        this.$message({
          message:'回复成功!',
          type:"success",
          duration:1000,
          customClass: "middle"
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog {
  height: 419px;
}
/deep/ .el-dialog__body {
  .ctrl {
    text-align: right;
    padding: 10px;
  }
  /deep/ .custom-view {
    height: 358px !important;
  }
}
.compose-content{
  margin-top:10px;
  width:calc(100% - 20px);
  margin-left:10px;
  background:rgba(255,255,255,1);

  .el-form-item__label{
    color: #999!important;
  }

  .compose-content-title{
    height: 2px;
    line-height: 2px;
    font-size: 18px;
    padding-top:24px;
    padding-left:31px;
    font-size:20px;
    font-family:Microsoft YaHei;
    font-weight:bold;
    color:rgba(51,51,51,1);
  }

  .compose-content-des{
    font-size: 14px;
    width:calc(100% - 28px);
    margin-bottom: 16px;
    padding-left: 15px;
    margin-left:16px;
    margin-top: 26px;
    padding-bottom:14px;
    border-bottom:1px dotted rgba(238,238,238,1);
    
    p{
      padding: 4px 0px;
      &:nth-child(1){
        color:#0080ff;
      }
      span{
        &:first-child{
          color: #999999;
        }
      }
    }
  }
  .compose-content-text{
    margin-bottom: 14px;
    font-size: 14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    width:calc(100% - 62px);
    margin-left:31px;
    p{
      padding: 4px 0px;
    }
  }
  .compose-content-attachment{
    width:calc(100% - 32px);
    margin-left:16px;
    height:48px;
    font-size: 14px;
    margin-bottom: 32px;
    // background:rgba(238,238,238,1);
    div{
      margin-bottom: 8px;
      position: relative;
      float:left;
      min-width: 190px;
      img{
       padding:8px;
      }
      span{
        vertical-align: 29px;
      }
      .download{
        position:absolute;
        font-size: 14px;
        top:28px;
        left:48px;
        margin:0 !important;
        color:#0090ff;
        &:nth-child(4){
          left:120px;
        }
      }

    }
    p{
      line-height: 24px;
      span{
        display: inline-block;
        margin-right: 16px;
      }
    }
  }

  .compose-content-btns{
    background:rgba(255,255,255,1);
    position:fixed;
    bottom:0;
    width:100%;
    height:64px; 
    .el-button{
      width:128px;
      height:48px;
      margin-left:16px;
      margin-top:9px;
    }
  }
}
</style>
